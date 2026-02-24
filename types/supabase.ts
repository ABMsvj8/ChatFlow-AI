/**
 * Supabase Database types.
 * Run `supabase gen types typescript --linked > types/supabase.ts` after
 * applying migrations to auto-generate the full typed client.
 *
 * Placeholder shapes provided below — replace after first migration.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      businesses: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          plan: 'free' | 'pro' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['businesses']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['businesses']['Insert']>
      }
      connected_accounts: {
        Row: {
          id: string
          business_id: string
          platform: 'instagram' | 'facebook' | 'whatsapp' | 'tiktok'
          platform_account_id: string
          access_token: string
          refresh_token: string | null
          token_expires_at: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['connected_accounts']['Row'],
          'created_at' | 'updated_at'
        >
        Update: Partial<Database['public']['Tables']['connected_accounts']['Insert']>
      }
      agents: {
        Row: {
          id: string
          business_id: string
          name: string
          system_prompt: string
          ai_provider: 'anthropic' | 'openai'
          ai_model: string
          temperature: number
          max_tokens: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['agents']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['agents']['Insert']>
      }
      conversations: {
        Row: {
          id: string
          business_id: string
          agent_id: string
          connected_account_id: string
          platform_conversation_id: string
          platform_user_id: string
          platform_user_name: string | null
          status: 'active' | 'resolved' | 'escalated'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          agent_id: string
          connected_account_id: string
          platform_conversation_id: string
          platform_user_id: string
          platform_user_name?: string | null
          status?: 'active' | 'resolved' | 'escalated'
        }
        Update: {
          id?: string
          business_id?: string
          agent_id?: string
          connected_account_id?: string
          platform_conversation_id?: string
          platform_user_id?: string
          platform_user_name?: string | null
          status?: 'active' | 'resolved' | 'escalated'
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          platform_message_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
