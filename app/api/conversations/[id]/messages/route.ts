import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content } = await request.json()
  if (!content || typeof content !== 'string') {
    return NextResponse.json({ error: 'Content required' }, { status: 400 })
  }

  // Verify user has access to this conversation
  const { data: conversation, error: fetchError } = await supabase
    .from('conversations')
    .select('business_id')
    .eq('id', id)
    .single()

  if (fetchError || !conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
  }

  // Check that user owns the business
  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('id', (conversation as any).business_id)
    .eq('owner_id', user.id)
    .single()

  if (!business) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Insert message
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: id,
      role: 'system', // Placeholder for human messages
      content,
      created_at: new Date().toISOString(),
    } as any)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
