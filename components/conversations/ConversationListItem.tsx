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
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400"><span className="w-1.5 h-1.5 rounded-full bg-green-400" />Active</span>
      case 'resolved':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-500/20 text-zinc-400"><span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />Resolved</span>
      case 'escalated':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400"><span className="w-1.5 h-1.5 rounded-full bg-blue-400" />Handed Off</span>
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
          ? 'bg-zinc-800/40 border-l-purple-500 border-r-0'
          : 'border-l-transparent hover:bg-zinc-800/20'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="font-medium text-sm text-white truncate">
          {conversation.platform_user_name || 'Unknown Customer'}
        </div>
        {getStatusBadge(conversation.status)}
      </div>
      <div className="text-xs text-zinc-500">{relativeTime}</div>
    </button>
  )
}
