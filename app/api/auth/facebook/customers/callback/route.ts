import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { decodeOAuthState, exchangeCodeForToken, getFacebookPageInfo } from '@/lib/oauth'

/**
 * GET /api/auth/facebook/customers/callback
 * Handles OAuth callback from Meta
 * Exchanges code for access token and saves to connected_platforms
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // Handle OAuth errors
    if (error) {
      const message = errorDescription || error
      const redirectUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'https://chatflow-ai-black.vercel.app')
      redirectUrl.searchParams.set('error', message)
      return NextResponse.redirect(redirectUrl)
    }

    // Validate required parameters
    if (!code || !state) {
      const redirectUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'https://chatflow-ai-black.vercel.app')
      redirectUrl.searchParams.set('error', 'Missing authorization code or state')
      return NextResponse.redirect(redirectUrl)
    }

    // Decode state and validate
    const stateData = decodeOAuthState(state)
    if (!stateData) {
      const redirectUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'https://chatflow-ai-black.vercel.app')
      redirectUrl.searchParams.set('error', 'Invalid or expired state parameter')
      return NextResponse.redirect(redirectUrl)
    }

    const { businessId } = stateData

    // Check authentication
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      const redirectUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'https://chatflow-ai-black.vercel.app')
      redirectUrl.searchParams.set('error', 'Session expired')
      return NextResponse.redirect(redirectUrl)
    }

    // Verify user owns this business
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('id', businessId)
      .eq('owner_id', user.id)
      .single()

    if (!business) {
      const redirectUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'https://chatflow-ai-black.vercel.app')
      redirectUrl.searchParams.set('error', 'Unauthorized business')
      return NextResponse.redirect(redirectUrl)
    }

    // Exchange code for token
    const clientId = process.env.INSTAGRAM_APP_ID // Facebook uses same app as Instagram
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'https://chatflow-ai-black.vercel.app'}/api/auth/facebook/customers/callback`

    if (!clientId || !clientSecret) {
      console.error('Facebook OAuth credentials not configured')
      const redirectUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'https://chatflow-ai-black.vercel.app')
      redirectUrl.searchParams.set('error', 'Service misconfigured')
      return NextResponse.redirect(redirectUrl)
    }

    const tokenData = await exchangeCodeForToken(code, clientId, clientSecret, redirectUri)
    if (!tokenData) {
      const redirectUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'https://chatflow-ai-black.vercel.app')
      redirectUrl.searchParams.set('error', 'Failed to exchange authorization code')
      return NextResponse.redirect(redirectUrl)
    }

    // Get Facebook page info
    const pageInfo = await getFacebookPageInfo(tokenData.accessToken, tokenData.userId)
    if (!pageInfo) {
      const redirectUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'https://chatflow-ai-black.vercel.app')
      redirectUrl.searchParams.set('error', 'Failed to retrieve page information')
      return NextResponse.redirect(redirectUrl)
    }

    // Save to connected_platforms table
    const { data: connectedPlatform, error: insertError } = await supabase
      .from('connected_platforms')
      .insert({
        business_id: businessId,
        platform: 'facebook',
        platform_account_id: pageInfo.pageId,
        account_name: pageInfo.accountName,
        access_token: tokenData.accessToken,
        webhook_secret: null, // Will be set up separately for Facebook webhooks
        status: 'active',
        connected_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString(),
        metadata: {
          user_id: tokenData.userId,
          username: tokenData.userName,
          profile_picture_url: pageInfo.profilePic,
          category: pageInfo.category,
        },
      } as any)
      .select('id')
      .single()

    if (insertError || !connectedPlatform) {
      console.error('Failed to save connected platform:', insertError)
      const redirectUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'https://chatflow-ai-black.vercel.app')
      redirectUrl.searchParams.set('error', 'Failed to save page connection')
      return NextResponse.redirect(redirectUrl)
    }

    // Success: redirect to dashboard with success message
    const redirectUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'https://chatflow-ai-black.vercel.app')
    redirectUrl.searchParams.set('connected', `Facebook (${pageInfo.accountName})`)
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('Error in Facebook OAuth callback:', error)
    const redirectUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'https://chatflow-ai-black.vercel.app')
    redirectUrl.searchParams.set('error', 'Internal server error')
    return NextResponse.redirect(redirectUrl)
  }
}
