import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, goal, tone, businessDescription, customInstructions } = body

  if (!name || !goal) return NextResponse.json({ error: 'Name and goal required' }, { status: 400 })

  // Get or create business
  let businessId: string
  const { data: existing } = await supabase.from('businesses').select('id').eq('user_id', user.id).limit(1).single()

  if (existing && 'id' in existing) {
    businessId = (existing as { id: string }).id
  } else {
    const { data: newBiz } = await supabase.from('businesses').insert({ user_id: user.id, name: 'My Business' }).select('id').single()
    if (!newBiz || !('id' in newBiz)) return NextResponse.json({ error: 'Failed to create business' }, { status: 500 })
    businessId = (newBiz as { id: string }).id
  }

  const { error } = await supabase.from('agents').insert({
    business_id: businessId,
    name,
    status: 'active',
    goal,
    personality_config: { tone, businessDescription, customInstructions },
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
