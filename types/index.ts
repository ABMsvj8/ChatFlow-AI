/**
 * Shared application types.
 * Domain-specific types live alongside their feature modules.
 * Re-export from here for convenient single-import access.
 */

export type { Database, Json } from './supabase'

export type Platform = 'instagram' | 'facebook' | 'whatsapp' | 'tiktok'
export type AiProvider = 'anthropic' | 'openai'
export type MessageRole = 'user' | 'assistant' | 'system'
export type ConversationStatus = 'active' | 'resolved' | 'escalated'
export type BusinessPlan = 'free' | 'pro' | 'enterprise'
