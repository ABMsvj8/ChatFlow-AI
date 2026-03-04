'use client'

import { formatDistanceToNow } from 'date-fns'

interface Conversation {
  id: string
  platform_user_name: string | null
  status: 'active' | 'resolved' | 'escalated'
  updated_at: string
}

interface ConversationListItemProps {
  conversation: Conversation
  isSelected: boolean
  onSelect: () => void
}

export default function ConversationListItem({
  conversation,
  isSelected,
  onSelect,
}: ConversationListItemProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><span className="w-1.5 h-1.5 rounded-full bg-green-600" />Active</span>
      case 'resolved':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><span className="w-1.5 h-1.5 rounded-full bg-gray-600" />Resolved</span>
      case 'escalated':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><span className="w-1.5 h-1.5 rounded-full bg-blue-600" />Handed Off</span>
      default:
        return null
    }
  }

  const relativeTime = formatDistanceToNow(new Date(conversation.updated_at), {
    addSuffix: true,
  })

  return (
    <button
      onClick={onSelect}
      className={`w-full px-4 py-3 text-left transition-all border-l-2 ${
        isSelected
          ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-l-pink-500 border-r-0 brand-gradient-border'
          : 'border-l-transparent hover:bg-gray-100'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="font-medium text-sm text-gray-900 truncate">
          {conversation.platform_user_name || 'Unknown Customer'}
        </div>
        {getStatusBadge(conversation.status)}
      </div>
      <div className="text-xs text-gray-500">{relativeTime}</div>
    </button>
  )
}
