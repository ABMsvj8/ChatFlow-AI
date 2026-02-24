export interface AgentRespondRequest {
  conversation_id: string
  incoming_message: string
  agent_id: string
}

export interface AgentRespondResponse {
  message_id: string
  response: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
  estimatedCost: number
}

export interface AgentConfig {
  id: string
  business_id: string
  name: string
  system_prompt: string
  ai_provider: string
  ai_model: string
  temperature: number
  max_tokens: number
}

export interface ConversationMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export interface ConversationContext {
  messages: ConversationMessage[]
  agentConfig: AgentConfig
  businessName?: string
  businessDescription?: string
}
