import { NextResponse, type NextRequest } from 'next/server'
import { randomUUID } from 'crypto'

const FACEBOOK_OAUTH_URL = 'https://www.facebook.com/v19.0/dialog/oauth'
const INSTAGRAM_APP_ID = (process.env.INSTAGRAM_APP_ID || '1203093125354472').trim()
const REDIRECT_URI = 'https://chatflow-ai-black.vercel.app/api/platforms/callback/instagram'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Generate CSRF state token
    const state = randomUUID()

    // Build the OAuth URL (same logic as connect route)
    const scope = 'instagram_business_basic,instagram_business_manage_messages,pages_show_list,pages_read_engagement'
    const oauthUrl = `${FACEBOOK_OAUTH_URL}?${new URLSearchParams({
      client_id: INSTAGRAM_APP_ID!,
      redirect_uri: REDIRECT_URI,
      scope,
      response_type: 'code',
      state,
    }).toString()}`

    // Return the URL as JSON for debugging
    return NextResponse.json({
      url: oauthUrl,
      base: FACEBOOK_OAUTH_URL,
      client_id: INSTAGRAM_APP_ID,
      redirect_uri: REDIRECT_URI,
      scope,
      state,
    })
  } catch (error) {
    console.error('Error in Instagram debug route:', error)
    return NextResponse.json(
      { error: 'Failed to generate Instagram OAuth URL', details: String(error) },
      { status: 500 }
    )
  }
}
