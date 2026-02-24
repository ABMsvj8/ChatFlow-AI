'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ConversationList from '@/components/conversations/ConversationList'
import ThreadView from '@/components/conversations/ThreadView'

interface Conversation {
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

function ConversationsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    searchParams.get('id')
  )
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  // Check auth and load business
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/')
        return
      }

      setUser({
        id: session.user?.id || '',
        email: session.user?.email,
      })

      // Get user's business
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', session.user?.id)
        .limit(1)
        .single()

      if (businessError && businessError.code === 'PGRST116') {
        router.push('/onboarding')
        return
      }

      if (business && 'id' in business) {
        const bid = (business as { id: string }).id
        setBusinessId(bid)
        await loadConversations(bid)
      }

      setLoading(false)
    }

    checkSession()
  }, [supabase, router])

  // Load conversations for the business
  const loadConversations = async (bid: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('business_id', bid)
        .order('updated_at', { ascending: false })

      if (error) {
        setError('Failed to load conversations')
        return
      }

      setConversations((data as Conversation[]) || [])
    } catch (err) {
      setError('Failed to load conversations')
    }
  }

  // Subscribe to Realtime updates
  useEffect(() => {
    if (!businessId) return

    const channel = supabase
      .channel(`conversations:${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `business_id=eq.${businessId}`,
        },
        (payload) => {
          // Refresh conversations on any change
          loadConversations(businessId)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [businessId, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-zinc-400">Loading conversations...</div>
      </div>
    )
  }

  if (!businessId) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-zinc-400">No business found</div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800/50">
        <h1 className="text-2xl font-bold">Conversations</h1>
        <p className="text-zinc-400 text-sm mt-1">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Conversation List */}
        <div className="w-96 border-r border-zinc-800/50 flex flex-col overflow-hidden">
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
            businessId={businessId}
          />
        </div>

        {/* Right Panel - Thread View */}
        <div className="flex-1 flex flex-col overflow-hidden bg-zinc-900/20">
          {selectedConversationId ? (
            <ThreadView conversationId={selectedConversationId} businessId={businessId} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-zinc-500 text-lg mb-2">Select a conversation to view</div>
                <p className="text-zinc-600 text-sm">
                  {conversations.length === 0
                    ? 'No conversations yet. Connect a platform and launch your agent to get started.'
                    : 'Click a conversation on the left to see the full thread.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-950/50 border-t border-red-800/50 text-red-200 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}

export default function ConversationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-black">
          <div className="text-zinc-400">Loading conversations...</div>
        </div>
      }
    >
      <ConversationsContent />
    </Suspense>
  )
}
