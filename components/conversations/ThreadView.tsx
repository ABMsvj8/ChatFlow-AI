'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import MessageBubble from './MessageBubble'
import ActionBar from './ActionBar'

interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

interface Conversation {
  id: string
  platform_user_name: string | null
  status: 'active' | 'resolved' | 'escalated'
  created_at: string
}

interface ThreadViewProps {
  conversationId: string
  businessId: string
}

export default function ThreadView({ conversationId, businessId }: ThreadViewProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [humanInput, setHumanInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isHumanTakeover, setIsHumanTakeover] = useState(false)
  const supabase = createClient()

  // Load conversation and messages
  useEffect(() => {
    loadConversation()
    loadMessages()
  }, [conversationId])

  const loadConversation = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single()

      if (error) {
        setError('Failed to load conversation')
        return
      }

      if (data) {
        const conv = data as unknown as Conversation
        setConversation(conv)
        setIsHumanTakeover(conv.status === 'escalated')
      }
    } catch (err) {
      setError('Failed to load conversation')
    }
  }

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) {
        setError('Failed to load messages')
        return
      }

      setMessages((data as Message[]) || [])
      setLoading(false)
    } catch (err) {
      setError('Failed to load messages')
      setLoading(false)
    }
  }

  // Subscribe to Realtime message updates
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.new) {
            setMessages((prev) => [...prev, payload.new as Message])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, supabase])

  const updateConversationStatus = async (newStatus: 'active' | 'resolved' | 'escalated') => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to update conversation')
        return false
      }

      return true
    } catch (err) {
      setError('Failed to update conversation')
      return false
    }
  }

  const handleTakeOver = async () => {
    const success = await updateConversationStatus('escalated')
    if (success) {
      setIsHumanTakeover(true)
      await loadConversation()
    }
  }

  const handleHandBack = async () => {
    const success = await updateConversationStatus('active')
    if (success) {
      setIsHumanTakeover(false)
      await loadConversation()
    }
  }

  const handleResolve = async () => {
    const success = await updateConversationStatus('resolved')
    if (success) {
      await loadConversation()
    }
  }

  const handleSendMessage = async () => {
    if (!humanInput.trim()) return

    setIsSending(true)
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: humanInput }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to send message')
        setIsSending(false)
        return
      }

      setHumanInput('')
      await loadMessages()
    } catch (err) {
      setError('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-zinc-400">Loading thread...</div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-zinc-400">Conversation not found</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800/50">
        <h2 className="text-lg font-semibold">
          {conversation.platform_user_name || 'Unknown Customer'}
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          {messages.length} message{messages.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-zinc-500 text-sm">No messages yet</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
            />
          ))
        )}
      </div>

      {/* Human Input (if in takeover mode) */}
      {isHumanTakeover && (
        <div className="p-4 border-t border-zinc-800/50 bg-blue-950/10">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={humanInput}
              onChange={(e) => setHumanInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="flex-1 px-4 py-2 rounded-lg bg-zinc-800/30 border border-zinc-700/50 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isSending}
            />
            <button
              onClick={handleSendMessage}
              disabled={isSending || !humanInput.trim()}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white text-sm font-medium transition-all"
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <ActionBar
        status={conversation.status}
        onTakeOver={handleTakeOver}
        onHandBack={handleHandBack}
        onResolve={handleResolve}
        isHumanTakeover={isHumanTakeover}
      />

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-red-950/50 border-t border-red-800/50 text-red-200 text-xs">
          {error}
        </div>
      )}
    </div>
  )
}
