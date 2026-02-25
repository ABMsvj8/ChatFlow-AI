/**
 * Instagram webhook payload types
 */

export interface InstagramWebhookVerification {
  hub: {
    mode: string
    verify_token: string
    challenge: string
  }
}

export interface InstagramMessageEvent {
  object: string
  entry: Array<{
    id: string
    time: number
    messaging: Array<{
      sender: {
        id: string
      }
      recipient: {
        id: string
      }
      message: {
        text: string
      }
      timestamp: number
    }>
  }>
}

export interface NormalizedInstagramMessage {
  customerId: string // sender ID from Instagram
  pageId: string // recipient ID (our page)
  messageText: string
  timestamp: number
  platform: 'instagram'
}
