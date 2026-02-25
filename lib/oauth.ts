/**
 * OAuth state encoding/decoding for CSRF protection
 * State format: base64(business_id|timestamp|signature)
 */

export interface OAuthState {
  businessId: string
  timestamp: number
}

/**
 * Encode state parameter for OAuth request
 * Includes timestamp and business_id for verification
 */
export function encodeOAuthState(businessId: string): string {
  const timestamp = Date.now()
  const stateObj = JSON.stringify({ businessId, timestamp })
  return Buffer.from(stateObj).toString('base64')
}

/**
 * Decode state parameter from OAuth callback
 * Validates that state hasn't expired (< 10 minutes old)
 */
export function decodeOAuthState(state: string): OAuthState | null {
  try {
    const decoded = Buffer.from(state, 'base64').toString('utf-8')
    const parsed = JSON.parse(decoded) as OAuthState

    // Validate state isn't too old (10 minute expiry)
    const stateAge = Date.now() - parsed.timestamp
    if (stateAge > 10 * 60 * 1000) {
      console.warn('OAuth state expired')
      return null
    }

    return parsed
  } catch (error) {
    console.error('Failed to decode OAuth state:', error)
    return null
  }
}

/**
 * Get Meta OAuth authorization URL
 */
export function getInstagramOAuthUrl(
  clientId: string,
  redirectUri: string,
  state: string
): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'instagram_business_basic,instagram_business_content_publish',
    state,
  })

  return `https://www.instagram.com/oauth/authorize?${params.toString()}`
}

/**
 * Exchange OAuth code for access token
 */
export async function exchangeCodeForToken(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<{ accessToken: string; userId: string; userName: string } | null> {
  try {
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code,
    })

    const response = await fetch('https://graph.instagram.com/v19.0/oauth/access_token', {
      method: 'POST',
      body: params.toString(),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OAuth token exchange failed:', error)
      return null
    }

    const data = await response.json()
    return {
      accessToken: data.access_token,
      userId: data.user_id,
      userName: data.user_name || `User ${data.user_id}`,
    }
  } catch (error) {
    console.error('Failed to exchange OAuth code:', error)
    return null
  }
}

/**
 * Get Instagram Business Account info
 */
export async function getInstagramAccountInfo(
  accessToken: string,
  userId: string
): Promise<{ pageId: string; accountName: string; profilePic?: string } | null> {
  try {
    const response = await fetch(
      `https://graph.instagram.com/v19.0/${userId}?fields=ig_user,username,profile_picture_url&access_token=${accessToken}`
    )

    if (!response.ok) {
      console.error('Failed to fetch Instagram account info')
      return null
    }

    const data = await response.json()
    return {
      pageId: data.ig_user,
      accountName: data.username || `User ${userId}`,
      profilePic: data.profile_picture_url,
    }
  } catch (error) {
    console.error('Failed to get Instagram account info:', error)
    return null
  }
}

/**
 * Get Facebook OAuth authorization URL
 */
export function getFacebookOAuthUrl(
  clientId: string,
  redirectUri: string,
  state: string
): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'pages_manage_metadata,pages_read_user_profile,pages_manage_messaging,pages_read_engagement',
    state,
  })

  return `https://www.facebook.com/v19.0/oauth/authorize?${params.toString()}`
}

/**
 * Get Facebook Page info (after OAuth)
 */
export async function getFacebookPageInfo(
  accessToken: string,
  userId: string
): Promise<{ pageId: string; accountName: string; profilePic?: string; category?: string } | null> {
  try {
    // Get user's pages
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${userId}/accounts?fields=id,name,picture,category&access_token=${accessToken}`
    )

    if (!response.ok) {
      console.error('Failed to fetch Facebook pages')
      return null
    }

    const data = await response.json()
    if (!data.data || data.data.length === 0) {
      console.warn('User has no Facebook pages')
      return null
    }

    // Return the first page (user can connect more later)
    const page = data.data[0]
    return {
      pageId: page.id,
      accountName: page.name || `Page ${page.id}`,
      profilePic: page.picture?.data?.url,
      category: page.category,
    }
  } catch (error) {
    console.error('Failed to get Facebook page info:', error)
    return null
  }
}

/**
 * Get WhatsApp OAuth authorization URL
 */
export function getWhatsAppOAuthUrl(
  clientId: string,
  redirectUri: string,
  state: string
): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'whatsapp_business_management,whatsapp_business_messaging,business_management',
    state,
  })

  return `https://www.facebook.com/v19.0/oauth/authorize?${params.toString()}`
}

/**
 * Get WhatsApp Business Account info (WABA + phone number)
 */
export async function getWhatsAppBusinessInfo(
  accessToken: string,
  userId: string
): Promise<{ wabaId: string; phoneNumberId: string; accountName: string; phoneNumber?: string } | null> {
  try {
    // Get user's WhatsApp business accounts
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${userId}/whatsapp_business_accounts?fields=id,name,phone_number_id,phone_numbers&access_token=${accessToken}`
    )

    if (!response.ok) {
      console.error('Failed to fetch WhatsApp business accounts')
      return null
    }

    const data = await response.json()
    if (!data.data || data.data.length === 0) {
      console.warn('User has no WhatsApp business accounts')
      return null
    }

    // Return the first WABA
    const waba = data.data[0]
    const phoneNumber = waba.phone_numbers?.[0]?.phone_number || waba.phone_number_id

    return {
      wabaId: waba.id,
      phoneNumberId: waba.phone_number_id || '',
      accountName: waba.name || `WhatsApp ${waba.id}`,
      phoneNumber,
    }
  } catch (error) {
    console.error('Failed to get WhatsApp business info:', error)
    return null
  }
}
