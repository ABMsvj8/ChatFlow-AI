import { AgentConfig, ConversationMessage } from '@/lib/types/agent-response'

interface PromptContext {
  agentConfig: AgentConfig
  businessName?: string
  businessDescription?: string
  conversationHistory: ConversationMessage[]
  incomingMessage: string
}

/**
 * Build the full system prompt for Claude, including:
 * - Agent personality and instructions
 * - Business context
 * - Agent goals and rules
 * - Conversation history
 * - Current incoming message
 */
export function buildSystemPrompt(context: PromptContext): string {
  const { agentConfig, businessName, businessDescription, conversationHistory } = context

  const lines: string[] = []

  // 1. Agent Personality & Instructions
  lines.push('# Agent Instructions')
  lines.push(agentConfig.system_prompt || '')
  lines.push('')

  // 2. Business Context
  if (businessName || businessDescription) {
    lines.push('# Business Context')
    if (businessName) lines.push(`Business Name: ${businessName}`)
    if (businessDescription) lines.push(`Business Description: ${businessDescription}`)
    lines.push('')
  }

  // 3. AI Model Info
  lines.push('# Important')
  lines.push('You are an AI customer service agent. Respond naturally and helpfully.')
  lines.push('Keep responses concise (under 150 words unless more detail is needed).')
  lines.push('')

  // 4. Conversation History
  if (conversationHistory.length > 0) {
    lines.push('# Conversation History')
    conversationHistory.forEach((msg) => {
      const role = msg.role === 'user' ? 'Customer' : msg.role === 'assistant' ? 'You' : 'System'
      lines.push(`${role}: ${msg.content}`)
    })
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Build the user message for Claude, which is the incoming customer message
 */
export function buildUserMessage(incomingMessage: string): string {
  return `Customer: ${incomingMessage}\n\nRespond as the AI agent:`
}

/**
 * Format conversation history for the API call
 */
export function formatConversationHistory(
  messages: ConversationMessage[]
): Array<{ role: 'user' | 'assistant'; content: string }> {
  return messages.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }))
}
