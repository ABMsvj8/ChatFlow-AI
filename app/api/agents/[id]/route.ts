import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  
  // Verify agent belongs to user's business
  const { data: agent } = await supabase
    .from('agents')
    .select('id, business_id')
    .eq('id', id)
    .single()

  if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

  // Verify business ownership (RLS check)
  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('id', agent.business_id)
    .eq('owner_id', user.id)
    .single()

  if (!business) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Parse request body
  const body = await request.json()
  const { name, system_prompt, ai_model, temperature, max_tokens } = body

  // Validate required fields
  if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  if (!system_prompt?.trim()) return NextResponse.json({ error: 'System prompt is required' }, { status: 400 })
  if (!ai_model?.trim()) return NextResponse.json({ error: 'AI model is required' }, { status: 400 })
  if (temperature === undefined || temperature === null) return NextResponse.json({ error: 'Temperature is required' }, { status: 400 })
  if (!max_tokens || max_tokens < 100) return NextResponse.json({ error: 'Max tokens must be at least 100' }, { status: 400 })

  // Validate ranges
  if (typeof temperature !== 'number' || temperature < 0 || temperature > 1) {
    return NextResponse.json({ error: 'Temperature must be between 0 and 1' }, { status: 400 })
  }
  if (typeof max_tokens !== 'number' || max_tokens < 100 || max_tokens > 4096) {
    return NextResponse.json({ error: 'Max tokens must be between 100 and 4096' }, { status: 400 })
  }

  // Update agent
  const { error } = await supabase
    .from('agents')
    .update({
      name: name.trim(),
      system_prompt: system_prompt.trim(),
      ai_model: ai_model.trim(),
      temperature,
      max_tokens,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, message: 'Agent updated successfully' })
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  // Fetch agent with RLS check (inherited from agent RLS policy)
  const { data: agent, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

  return NextResponse.json(agent)
}
