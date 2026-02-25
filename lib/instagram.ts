/**
 * Instagram Graph API client
 * Handles posting DM responses back to Instagram
 */

export async function postMessageToInstagram(
  recipientId: string,
  messageText: string,
  accessToken: string
): Promise<{ message_id: string }> {
  const url = `https://graph.instagram.com/v19.0/${recipientId}/messages`

  const params = new URLSearchParams({
    message: JSON.stringify({ text: messageText }),
    access_token: accessToken,
  })

  try {
    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'POST',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Instagram API error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return { message_id: data.message_id }
  } catch (error) {
    console.error('Failed to post message to Instagram:', error)
    throw error
  }
}

/**
 * Verify webhook token
 */
export function verifyWebhookToken(
  providedToken: string,
  expectedToken: string
): boolean {
  return providedToken === expectedToken
}
