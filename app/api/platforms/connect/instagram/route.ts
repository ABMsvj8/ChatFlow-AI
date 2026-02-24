import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { randomUUID } from 'crypto'

const FACEBOOK_OAUTH_URL = 'https://www.facebook.com/v19.0/dialog/oauth'
const INSTAGRAM_APP_ID = (process.env.INSTAGRAM_APP_ID || '1203093125354472').trim()
const REDIRECT_URI = 'https://chatflow-ai-black.vercel.app/api/platforms/callback/instagram'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get the authenticated user
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

    // Generate CSRF state token
    const state = randomUUID()
    
    // Store state in a secure, httpOnly cookie for CSRF protection
    const response = NextResponse.redirect(
      new URL(
        `${FACEBOOK_OAUTH_URL}?${new URLSearchParams({
          client_id: INSTAGRAM_APP_ID!,
          redirect_uri: REDIRECT_URI,
          scope: 'instagram_business_basic,instagram_business_manage_messages,pages_show_list,pages_read_engagement',
          response_type: 'code',
          state,
        }).toString()}`
      )
    )

    // Set state cookie (secure, httpOnly, sameSite=Lax)
    response.cookies.set('instagram_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
    })

    return response
  } catch (error) {
    console.error('Error in Instagram connect route:', error)
    return NextResponse.json(
      { error: 'Failed to initiate Instagram connection' },
      { status: 500 }
    )
  }
}
