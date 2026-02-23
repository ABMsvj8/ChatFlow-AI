import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

const INSTAGRAM_OAUTH_URL = 'https://api.instagram.com/oauth/authorize'
const APP_ID = process.env.INSTAGRAM_APP_ID
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Get the user's business
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handle error silently
          }
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get or create user's business (gracefully)
  let businessId: string | null = null

  try {
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1)
      .single()

    businessId = business?.id || null
  } catch {
    // Silently ignore select errors, we'll try to create
  }

  // Business creation is optional—OAuth should not be blocked by this
  // If we don't have a business, try to create one, but don't fail if we can't
  if (!businessId) {
    try {
      // Generate a unique slug
      const slug = `biz-${user.id.slice(0, 8)}-${Date.now()}`

      // Try to insert a default business for the user
      const { data: newBusiness, error } = await supabase
        .from('businesses')
        .insert({
          owner_id: user.id,
          name: `${user.email?.split('@')[0] || 'User'}'s Business`,
          slug,
          plan: 'free',
        })
        .select('id')
        .single()

      if (!error && newBusiness?.id) {
        businessId = newBusiness.id
      }
      // Continue to OAuth even if business creation fails—the OAuth flow is what matters
    } catch (createError) {
      // Business creation failed, but we continue to OAuth
      // Log the error silently for debugging if needed
      console.debug('Business creation failed, proceeding with OAuth:', createError)
    }
  }

  // Store business ID in session/state for callback (may be null)
  const state = Buffer.from(
    JSON.stringify({
      businessId: businessId || null,
      timestamp: Date.now(),
    })
  ).toString('base64')

  const params = new URLSearchParams({
    client_id: APP_ID!,
    redirect_uri: REDIRECT_URI,
    scope: 'instagram_business_profile,instagram_business_content_publish,instagram_business_manage_messages,pages_show_list,pages_read_engagement',
    response_type: 'code',
    state,
  })

  const authUrl = `${INSTAGRAM_OAUTH_URL}?${params.toString()}`

  return NextResponse.redirect(authUrl)
}
