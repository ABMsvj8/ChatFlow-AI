import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

const TOKEN_URL = 'https://graph.instagram.com/v20.0/oauth/access_token'
const GRAPH_API_URL = 'https://graph.instagram.com/v20.0'
const CLIENT_ID = process.env.INSTAGRAM_APP_ID
const CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET
const REDIRECT_URI = 'https://chatflow-ai-black.vercel.app/api/auth/instagram/callback'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('Instagram OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      `${origin}/dashboard?error=${encodeURIComponent(errorDescription || error)}`
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(`${origin}/dashboard?error=Invalid+OAuth+response`)
  }

  try {
    // Decode state
    const decodedState = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'))
    let businessId = decodedState.businessId

    // Exchange code for access token
    const tokenResponse = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code,
      }).toString(),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('Token exchange error:', errorData)
      return NextResponse.redirect(
        `${origin}/dashboard?error=${encodeURIComponent('Failed to exchange token')}`
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    const userId = tokenData.user_id

    if (!accessToken || !userId) {
      return NextResponse.redirect(
        `${origin}/dashboard?error=${encodeURIComponent('Invalid token response')}`
      )
    }

    // Get Instagram Business Account info
    let instagramAccountId: string | null = null
    let accountName: string | null = null
    let pageId: string | null = null

    try {
      // Get user's Instagram accounts
      const igUserResponse = await fetch(`${GRAPH_API_URL}/${userId}?fields=id,username&access_token=${accessToken}`)
      const igUserData = await igUserResponse.json()

      if (igUserData.id) {
        instagramAccountId = igUserData.id
        accountName = igUserData.username || `IG-${instagramAccountId}`
      }

      // Get Page ID (Instagram is connected via Facebook Pages)
      const pagesResponse = await fetch(
        `${GRAPH_API_URL}/${userId}/accounts?fields=id,name&access_token=${accessToken}`
      )
      const pagesData = await pagesResponse.json()

      if (pagesData.data && pagesData.data.length > 0) {
        pageId = pagesData.data[0].id
      }
    } catch (err) {
      console.error('Failed to fetch Instagram account info:', err)
      // Continue anyway — we have the essential data
    }

    // If no businessId was set during OAuth initiation, create one now
    if (!businessId) {
      console.debug('No businessId in state, attempting to create one')
      
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

      const { data } = await supabase.auth.getUser()
      const user = data?.user
      
      if (user) {
        const slug = `biz-${user.id.slice(0, 8)}-${Date.now()}`
        const { data: newBusiness } = await supabase
          .from('businesses')
          .insert({
            owner_id: user.id,
            name: `${user.email?.split('@')[0] || 'User'}'s Business`,
            slug,
          })
          .select('id')
          .single()

        if (newBusiness?.id) {
          businessId = newBusiness.id
        }
      }
    }

    // If we still don't have a businessId, we can't store the connected account
    // (it's required by foreign key)
    if (!businessId) {
      console.error('No business ID available after OAuth callback')
      return NextResponse.redirect(
        `${origin}/dashboard?error=${encodeURIComponent('Failed to create business account')}`
      )
    }

    // Get user and store the connected account
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

    // Store connected account in Supabase
    const { error: dbError } = await supabase.from('connected_accounts').insert({
      business_id: businessId,
      platform: 'instagram',
      platform_account_id: instagramAccountId || userId,
      access_token: accessToken,
      refresh_token: null,
      token_expires_at: null,
      metadata: {
        username: accountName,
        page_id: pageId,
        user_id: userId,
      },
    })

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.redirect(
        `${origin}/dashboard?error=${encodeURIComponent('Failed to save connection')}`
      )
    }

    // Redirect back to dashboard with success message
    return NextResponse.redirect(`${origin}/dashboard?success=instagram`)
  } catch (error) {
    console.error('Unexpected error in Instagram callback:', error)
    return NextResponse.redirect(
      `${origin}/dashboard?error=${encodeURIComponent('An unexpected error occurred')}`
    )
  }
}
