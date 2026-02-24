import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import anthropic, { calculateTokenCost } from '@/lib/anthropic'
import { buildSystemPrompt, buildUserMessage, formatConversationHistory } from '@/lib/agents/prompt-builder'
import type { AgentRespondRequest, AgentConfig, ConversationMessage } from '@/lib/types/agent-response'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request
    const body: AgentRespondRequest = await request.json()
    const { conversation_id, incoming_message, agent_id } = body

    if (!conversation_id || !incoming_message || !agent_id) {
      return NextResponse.json(
        { error: 'Missing required fields: conversation_id, incoming_message, agent_id' },
        { status: 400 }
      )
    }

    if (!incoming_message.trim()) {
      return NextResponse.json(
        { error: 'incoming_message cannot be empty' },
        { status: 400 }
      )
    }

    // Fetch conversation to verify user has access
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('business_id, agent_id')
      .eq('id', conversation_id)
      .single()

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Verify user owns the business
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('id', (conversation as any).business_id)
      .eq('owner_id', user.id)
      .single()

    if (!business) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch agent config
    const { data: agentData, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agent_id)
      .eq('business_id', (conversation as any).business_id)
      .single()

    if (agentError || !agentData) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const agentConfig = agentData as AgentConfig

    // Fetch conversation history (last 10 messages)
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true })
      .limit(10)

    if (messagesError) {
      return NextResponse.json(
        { error: 'Failed to fetch conversation history' },
        { status: 500 }
      )
    }

    const conversationHistory = (messagesData || []) as ConversationMessage[]

    // Fetch business info for context
    const { data: businessData } = await supabase
      .from('businesses')
      .select('name, description')
      .eq('id', (conversation as any).business_id)
      .single()

    // Build prompts
    const systemPrompt = buildSystemPrompt({
      agentConfig,
      businessName: businessData?.name,
      businessDescription: businessData?.description,
      conversationHistory,
      incomingMessage: incoming_message,
    })

    const userMessage = buildUserMessage(incoming_message)

    // Call Claude API
    const response = await anthropic.messages.create({
      model: agentConfig.ai_model || 'claude-3-5-sonnet-20241022',
      max_tokens: agentConfig.max_tokens || 500,
      temperature: agentConfig.temperature || 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    })

    // Extract response text
    const aiResponse =
      response.content[0].type === 'text'
        ? response.content[0].text
        : 'Unable to generate response'

    // Calculate token costs
    const { inputTokens, outputTokens, totalTokens, estimatedCost } = calculateTokenCost(
      response.usage.input_tokens,
      response.usage.output_tokens,
      agentConfig.ai_model
    )

    // Save agent response to messages table
    const { data: savedMessage, error: saveError } = await supabase
      .from('messages')
      .insert({
        conversation_id,
        role: 'assistant',
        content: aiResponse,
        platform_message_id: null,
        metadata: {
          ai_model: agentConfig.ai_model,
          tokens_used: totalTokens,
          cost: estimatedCost,
        },
        created_at: new Date().toISOString(),
      } as any)
      .select('id')
      .single()

    if (saveError || !savedMessage) {
      return NextResponse.json(
        { error: 'Failed to save agent response' },
        { status: 500 }
      )
    }

    // Update conversation metadata
    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        message_count: conversationHistory.length + 2, // +1 for incoming, +1 for response
        last_message_at: new Date().toISOString(),
      })
      .eq('id', conversation_id)

    if (updateError) {
      console.error('Failed to update conversation metadata:', updateError)
      // Don't fail the request - the response was saved successfully
    }

    return NextResponse.json({
      message_id: (savedMessage as any).id,
      response: aiResponse,
      inputTokens,
      outputTokens,
      totalTokens,
      estimatedCost,
    })
  } catch (error) {
    console.error('Error in /api/agents/respond:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to generate response: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
