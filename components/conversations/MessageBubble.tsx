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
  const isHuman = message.role === 'system'

  const messageTime = format(new Date(message.created_at), 'HH:mm')

  return (
    <div className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isCustomer
            ? 'bg-gray-100 text-gray-900 border border-gray-300'
            : isAgent
            ? 'btn-primary-gradient text-white'
            : 'bg-gray-200 text-gray-900 border border-gray-300'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          {isAgent && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-white/30 text-white/90">
              AI
            </span>
          )}
          {isHuman && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-300 text-gray-800">
              Human
            </span>
          )}
        </div>
        <p className="text-sm break-words">{message.content}</p>
        <div className={`text-xs mt-1 ${isCustomer ? 'text-gray-600' : isAgent ? 'text-white/80' : 'text-gray-600'}`}>
          {messageTime}
        </div>
      </div>
    </div>
  )
}