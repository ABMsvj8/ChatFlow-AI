import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

const TOKEN_URL = 'https://graph.facebook.com/v19.0/oauth/access_token'
const GRAPH_API_URL = 'https://graph.facebook.com/v19.0'
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET
const REDIRECT_URI = 'https://chatflow-ai-black.vercel.app/api/platforms/callback/instagram'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle OAuth errors from Facebook
  if (error) {
    console.error('Instagram OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      `${origin}/dashboard?error=${encodeURIComponent(errorDescription || error)}`
    )
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/dashboard?error=Invalid+OAuth+response`)
  }

  try {
    // Verify CSRF state token
    const cookieStore = await cookies()
    const storedState = cookieStore.get('instagram_oauth_state')?.value

    if (!state || !storedState || state !== storedState) {
      console.error('State mismatch or missing state in CSRF check')
      return NextResponse.redirect(
        `${origin}/dashboard?error=${encodeURIComponent('Invalid+state+parameter')}`
      )
    }

    // Clear the state cookie
    const clearStateResponse = NextResponse.json({ success: false })
    clearStateResponse.cookies.set('instagram_oauth_state', '', {
      maxAge: 0,
    })

    // Initialize Supabase client
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

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(`${origin}/dashboard?error=Unauthorized`)
    }

    // Exchange code for access token via Facebook OAuth
    const tokenResponse = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: INSTAGRAM_APP_ID!,
        client_secret: INSTAGRAM_APP_SECRET!,
        redirect_uri: REDIRECT_URI,
        code,
      }).toString(),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('Token exchange error:', errorData)
      return NextResponse.redirect(
        `${origin}/dashboard?error=${encodeURIComponent('Failed+to+exchange+token')}`
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    const userId = tokenData.user_id

    if (!accessToken || !userId) {
      console.error('Missing access token or user ID in token response')
      return NextResponse.redirect(
        `${origin}/dashboard?error=${encodeURIComponent('Invalid+token+response')}`
      )
    }

    // Get Instagram Business Account ID
    let instagramAccountId: string | null = null
    let pageId: string | null = null
    let accountName: string | null = null

    try {
      // Get the user's accounts (Pages) - this gives us Page IDs
      const accountsResponse = await fetch(
        `${GRAPH_API_URL}/me/accounts?access_token=${accessToken}`
      )

      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json()
        
        if (accountsData.data && accountsData.data.length > 0) {
          // Get the first page's ID
          pageId = accountsData.data[0].id
          accountName = accountsData.data[0].name

          // Now get the Instagram Business Account connected to this page
          const igResponse = await fetch(
            `${GRAPH_API_URL}/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
          )

          if (igResponse.ok) {
            const igData = await igResponse.json()
            
            if (igData.instagram_business_account?.id) {
              instagramAccountId = igData.instagram_business_account.id
            }
          }
        }
      }

      // Fallback: if we couldn't get Instagram account via page, try via user directly
      if (!instagramAccountId) {
        const userResponse = await fetch(
          `${GRAPH_API_URL}/me?fields=id,username&access_token=${accessToken}`
        )

        if (userResponse.ok) {
          const userData = await userResponse.json()
          if (userData.id) {
            instagramAccountId = userData.id
            accountName = userData.username || `IG-${userData.id}`
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch Instagram account info:', err)
      // Continue with the token we have - account ID is essential but we can proceed
    }

    if (!instagramAccountId) {
      console.error('Could not determine Instagram account ID')
      return NextResponse.redirect(
        `${origin}/dashboard?error=${encodeURIComponent('Could+not+identify+Instagram+account')}`
      )
    }

    // Get or create a business for this user
    let businessId: string | null = null

    try {
      // Try to get existing business for this user
      const { data: existingBusiness, error: selectError } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .single()

      if (selectError && selectError.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        throw selectError
      }

      if (existingBusiness?.id) {
        businessId = existingBusiness.id
      } else {
        // Create a new business for the user
        const { data: newBusiness, error: insertError } = await supabase
          .from('businesses')
          .insert({
            user_id: user.id,
            name: `${user.email?.split('@')[0] || 'User'}'s Business`,
          })
          .select('id')
          .single()

        if (insertError) {
          throw insertError
        }

        if (newBusiness?.id) {
          businessId = newBusiness.id
        }
      }
    } catch (err) {
      console.error('Error managing business record:', err)
      return NextResponse.redirect(
        `${origin}/dashboard?error=${encodeURIComponent('Failed+to+setup+business')}`
      )
    }

    if (!businessId) {
      console.error('Failed to obtain or create business ID')
      return NextResponse.redirect(
        `${origin}/dashboard?error=${encodeURIComponent('Failed+to+setup+business')}`
      )
    }

    // Store the connection in connected_platforms table
    try {
      const { error: dbError } = await supabase.from('connected_platforms').upsert(
        {
          business_id: businessId,
          platform: 'instagram',
          platform_account_id: instagramAccountId,
          account_name: accountName || `IG-${instagramAccountId}`,
          access_token: accessToken,
          refresh_token: null,
          token_expires_at: null,
          status: 'active',
        },
        {
          onConflict: 'business_id,platform,platform_account_id',
        }
      )

      if (dbError) {
        console.error('Database error storing connection:', dbError)
        return NextResponse.redirect(
          `${origin}/dashboard?error=${encodeURIComponent('Failed+to+save+connection')}`
        )
      }
    } catch (err) {
      console.error('Error upserting connected platform:', err)
      return NextResponse.redirect(
        `${origin}/dashboard?error=${encodeURIComponent('Failed+to+save+connection')}`
      )
    }

    // Redirect back to dashboard with success message
    const response = NextResponse.redirect(`${origin}/dashboard?connected=instagram`)
    
    // Clear the state cookie in the response
    response.cookies.set('instagram_oauth_state', '', {
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error('Unexpected error in Instagram callback:', error)
    return NextResponse.redirect(
      `${origin}/dashboard?error=${encodeURIComponent('An+unexpected+error+occurred')}`
    )
  }
}
