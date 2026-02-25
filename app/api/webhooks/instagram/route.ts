import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { verifyWebhookToken, postMessageToInstagram } from '@/lib/instagram'
import type { InstagramMessageEvent, NormalizedInstagramMessage } from '@/lib/types/instagram-webhook'

/**
 * GET handler: Webhook verification handshake with Meta
 * Meta sends: GET /api/webhooks/instagram?hub.mode=subscribe&hub.verify_token=TOKEN&hub.challenge=CHALLENGE
 * We must respond with the challenge string if token matches
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    // Verify this is a subscription request
    if (mode !== 'subscribe') {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
    }

    // Verify the token matches our webhook token
    const webhookToken = process.env.INSTAGRAM_WEBHOOK_TOKEN
    if (!webhookToken || !verifyWebhookToken(token || '', webhookToken)) {
      console.warn('Invalid webhook token provided')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Return the challenge string (plain text, not JSON)
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  } catch (error) {
    console.error('Error in webhook verification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST handler: Incoming Instagram DMs
 * Meta sends message payload with sender, message text, timestamp
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Parse and validate the incoming message
    const message = parseInstagramMessage(body)
    if (!message) {
      console.warn('Invalid message payload')
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    console.log(`[Instagram] Received message from ${message.customerId}: "${message.messageText}"`)

    // Initialize Supabase client (anonymous - webhook doesn't have user session)
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )

    // Find or create conversation
    const { conversationId, businessId, agentId } = await getOrCreateConversation(
      supabase,
      message
    )

    if (!conversationId || !businessId || !agentId) {
      console.warn('Failed to find or create conversation')
      return NextResponse.json(
        { error: 'Unable to create conversation' },
        { status: 500 }
      )
    }

    // Call the AI engine to generate response
    const aiResponse = await callAIEngine(conversationId, message.messageText, agentId)

    if (!aiResponse) {
      console.warn('AI engine failed to generate response')
      return NextResponse.json(
        { error: 'AI engine unavailable' },
        { status: 500 }
      )
    }

    // Post response back to Instagram
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    if (!accessToken) {
      console.error('INSTAGRAM_ACCESS_TOKEN not configured')
      return NextResponse.json(
        { error: 'Service misconfigured' },
        { status: 500 }
      )
    }

    try {
      await postMessageToInstagram(message.customerId, aiResponse, accessToken)
      console.log(`[Instagram] Posted response to ${message.customerId}`)
    } catch (error) {
      console.error('Failed to post response back to Instagram:', error)
      // Don't fail the webhook - Meta expects 200 regardless
    }

    // Return 200 to acknowledge webhook receipt
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Error in Instagram webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Parse Instagram message from webhook payload
 */
function parseInstagramMessage(payload: unknown): NormalizedInstagramMessage | null {
  try {
    const data = payload as InstagramMessageEvent

    if (!data.object || data.object !== 'instagram') {
      return null
    }

    if (!data.entry || !Array.isArray(data.entry) || data.entry.length === 0) {
      return null
    }

    const entry = data.entry[0]
    if (!entry.messaging || !Array.isArray(entry.messaging) || entry.messaging.length === 0) {
      return null
    }

    const msg = entry.messaging[0]
    if (!msg.sender || !msg.recipient || !msg.message) {
      return null
    }

    return {
      customerId: msg.sender.id,
      pageId: msg.recipient.id,
      messageText: msg.message.text || '',
      timestamp: msg.timestamp,
      platform: 'instagram',
    }
  } catch (error) {
    console.error('Failed to parse Instagram message:', error)
    return null
  }
}

/**
 * Find existing conversation or create a new one
 * Matches by customer platform ID + platform type
 */
async function getOrCreateConversation(
  supabase: any,
  message: NormalizedInstagramMessage
): Promise<{ conversationId?: string; businessId?: string; agentId?: string }> {
  try {
    // Find connected Instagram account
    const { data: connectedAccount } = await supabase
      .from('connected_platforms')
      .select('id, business_id')
      .eq('platform', 'instagram')
      .eq('metadata->>platform_account_id', message.pageId)
      .single()

    if (!connectedAccount) {
      console.warn(`No connected Instagram account found for page ${message.pageId}`)
      return {}
    }

    const businessId = (connectedAccount as any).business_id
    const connectedAccountId = (connectedAccount as any).id

    // Find or create conversation
    let conversation = await findConversation(supabase, message.customerId, businessId)

    if (!conversation) {
      // Get the default agent for this business
      const { data: agents } = await supabase
        .from('agents')
        .select('id')
        .eq('business_id', businessId)
        .eq('is_active', true)
        .limit(1)
        .single()

      if (!agents) {
        console.warn(`No active agent found for business ${businessId}`)
        return {}
      }

      const agentId = (agents as any).id

      // Create conversation
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
          business_id: businessId,
          agent_id: agentId,
          connected_account_id: connectedAccountId,
          platform_conversation_id: `instagram-${message.customerId}`,
          platform_user_id: message.customerId,
          platform_user_name: `Instagram User ${message.customerId.slice(-4)}`,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any)
        .select('id')
        .single()

      if (error || !newConv) {
        console.error('Failed to create conversation:', error)
        return {}
      }

      conversation = newConv as any
    }

    // Save incoming message to database
    await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        role: 'user',
        content: message.messageText,
        platform_message_id: `${message.customerId}-${message.timestamp}`,
        metadata: { platform: 'instagram' },
        created_at: new Date(message.timestamp * 1000).toISOString(),
      } as any)

    // Get agent ID from conversation
    const agentId = (conversation as any).agent_id

    return {
      conversationId: conversation.id,
      businessId,
      agentId,
    }
  } catch (error) {
    console.error('Error in getOrCreateConversation:', error)
    return {}
  }
}

/**
 * Find existing conversation by customer platform ID
 */
async function findConversation(supabase: any, customerId: string, businessId: string) {
  try {
    const { data } = await supabase
      .from('conversations')
      .select('id, agent_id')
      .eq('business_id', businessId)
      .eq('platform_user_id', customerId)
      .eq('status', 'active')
      .limit(1)
      .single()

    return data || null
  } catch (error) {
    // Likely no conversation found
    return null
  }
}

/**
 * Call the AI conversation engine (internal API)
 */
async function callAIEngine(
  conversationId: string,
  messageText: string,
  agentId: string
): Promise<string | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://chatflow-ai-black.vercel.app'
    const response = await fetch(`${baseUrl}/api/agents/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation_id: conversationId,
        incoming_message: messageText,
        agent_id: agentId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`AI engine error: ${JSON.stringify(error)}`)
    }

    const data = await response.json()
    return data.response || null
  } catch (error) {
    console.error('Failed to call AI engine:', error)
    return null
  }
}
