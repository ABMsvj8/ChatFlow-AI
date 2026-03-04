'use client'

import { useState, useMemo } from 'react'
import { Search, Filter } from 'lucide-react'
import ConversationListItem from './ConversationListItem'

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

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelectConversation: (id: string) => void
  businessId: string
}

type FilterStatus = 'all' | 'active' | 'resolved' | 'handed_off'

export default function ConversationList({
  conversations,
  selectedId,
  onSelectConversation,
  businessId,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  // Filter and search conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      // Filter by status
      const statusMatches =
        filterStatus === 'all' ||
        (filterStatus === 'active' && conv.status === 'active') ||
        (filterStatus === 'resolved' && conv.status === 'resolved') ||
        (filterStatus === 'handed_off' && conv.status === 'escalated')

      // Search by customer name
      const searchMatches =
        !searchQuery ||
        (conv.platform_user_name &&
          conv.platform_user_name.toLowerCase().includes(searchQuery.toLowerCase()))

      return statusMatches && searchMatches
    })
  }, [conversations, searchQuery, filterStatus])

  const filters: { label: string; value: FilterStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Handed Off', value: 'handed_off' },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                filterStatus === filter.value
                  ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-gray-900 border border-gray-300 brand-gradient-border'
                  : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center px-4">
            <div>
              <p className="text-gray-500 text-sm">
                {conversations.length === 0
                  ? 'No conversations yet'
                  : 'No conversations match your search'}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredConversations.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedId === conversation.id}
                onSelect={() => onSelectConversation(conversation.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
