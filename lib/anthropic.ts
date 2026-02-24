import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export default anthropic

// Claude pricing (as of Feb 2026)
const CLAUDE_PRICING = {
  'claude-3-5-sonnet-20241022': {
    input: 0.003, // per 1K tokens
    output: 0.015, // per 1K tokens
  },
}

interface TokenCost {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  estimatedCost: number
}

export function calculateTokenCost(
  inputTokens: number,
  outputTokens: number,
  model: string = 'claude-3-5-sonnet-20241022'
): TokenCost {
  const pricing = CLAUDE_PRICING[model as keyof typeof CLAUDE_PRICING] || CLAUDE_PRICING['claude-3-5-sonnet-20241022']
  
  const inputCost = (inputTokens / 1000) * pricing.input
  const outputCost = (outputTokens / 1000) * pricing.output
  const totalCost = inputCost + outputCost

  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    estimatedCost: Math.round(totalCost * 10000) / 10000, // Round to 4 decimal places
  }
}
