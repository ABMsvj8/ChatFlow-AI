import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { encodeOAuthState, getInstagramOAuthUrl } from '@/lib/oauth'

/**
 * GET /api/auth/instagram/customers
 * Initiates Instagram OAuth flow for the current user
 * Redirects to Meta's OAuth authorization page
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's business
    const { data: business, error: bizError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1)
      .single()

    if (bizError || !business) {
      // Redirect to onboarding instead of erroring
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'https://chatflow-ai-black.vercel.app'}/onboarding?next=connect-instagram`
      )
    }

    const businessId = (business as any).id

    // Validate Instagram OAuth env vars
    const clientId = process.env.INSTAGRAM_APP_ID
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'https://chatflow-ai-black.vercel.app'}/api/auth/instagram/customers/callback`

    if (!clientId) {
      console.error('INSTAGRAM_APP_ID not configured')
      return NextResponse.json(
        { error: 'Service misconfigured' },
        { status: 500 }
      )
    }

    // Generate state with business_id for CSRF protection
    const state = encodeOAuthState(businessId)

    // Build Instagram OAuth URL
    const authUrl = getInstagramOAuthUrl(clientId, redirectUri, state)

    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Error in Instagram OAuth initiate:', error)
    return NextResponse.json(
      { error: 'Failed to initiate OAuth' },
      { status: 500 }
    )
  }
}
