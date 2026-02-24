'use client'

import { formatDistanceToNow, format } from 'date-fns'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isCustomer = message.role === 'user'
  const isAgent = message.role === 'assistant'
  const isHuman = message.role === 'system' // Placeholder for human messages

  const messageTime = format(new Date(message.created_at), 'HH:mm')

  return (
    <div className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isCustomer
            ? 'bg-zinc-800/50 text-zinc-100 border border-zinc-700/30'
            : isAgent
            ? 'bg-purple-600/20 text-purple-100 border border-purple-500/30'
            : 'bg-blue-600/20 text-blue-100 border border-blue-500/30'
        }`}
      >
        <p className="text-sm break-words">{message.content}</p>
        <div className="text-xs mt-1 opacity-70">{messageTime}</div>
      </div>
    </div>
  )
}
