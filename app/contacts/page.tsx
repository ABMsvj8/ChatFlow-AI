'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Users, Search, Filter, Mail, Phone, MessageCircle, MoreVertical, Plus, Download } from 'lucide-react'
import Link from 'next/link'

interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  platform: string
  status: 'active' | 'lead' | 'customer' | 'inactive'
  lastContact: string
  conversations: number
  value: number
}

export default function ContactsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])

  const supabase = createClient()

  const statusOptions = [
    { id: 'all', name: 'All Contacts', count: 48 },
    { id: 'active', name: 'Active', count: 24 },
    { id: 'lead', name: 'Leads', count: 12 },
    { id: 'customer', name: 'Customers', count: 8 },
    { id: 'inactive', name: 'Inactive', count: 4 },
  ]

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      phone: '+1 (555) 123-4567',
      platform: 'Instagram',
      status: 'customer',
      lastContact: '2 hours ago',
      conversations: 12,
      value: 2450,
    },
    {
      id: '2',
      name: 'Sam Wilson',
      email: 'sam@startup.com',
      phone: '+1 (555) 987-6543',
      platform: 'Facebook',
      status: 'lead',
      lastContact: '1 day ago',
      conversations: 5,
      value: 1200,
    },
    {
      id: '3',
      name: 'Taylor Smith',
      email: 'taylor@business.com',
      platform: 'WhatsApp',
      status: 'active',
      lastContact: '3 hours ago',
      conversations: 8,
      value: 1800,
    },
    {
      id: '4',
      name: 'Jordan Lee',
      email: 'jordan@consulting.com',
      phone: '+1 (555) 456-7890',
      platform: 'Instagram',
      status: 'customer',
      lastContact: '1 week ago',
      conversations: 15,
      value: 3200,
    },
    {
      id: '5',
      name: 'Casey Brown',
      email: 'casey@agency.com',
      platform: 'Facebook',
      status: 'lead',
      lastContact: '2 days ago',
      conversations: 3,
      value: 800,
    },
    {
      id: '6',
      name: 'Riley Davis',
      email: 'riley@tech.com',
      phone: '+1 (555) 321-0987',
      platform: 'Instagram',
      status: 'active',
      lastContact: '5 hours ago',
      conversations: 7,
      value: 1500,
    },
    {
      id: '7',
      name: 'Morgan Taylor',
      email: 'morgan@enterprise.com',
      platform: 'WhatsApp',
      status: 'customer',
      lastContact: '3 days ago',
      conversations: 20,
      value: 4200,
    },
    {
      id: '8',
      name: 'Drew Martinez',
      email: 'drew@consulting.com',
      phone: '+1 (555) 654-3210',
      platform: 'Instagram',
      status: 'lead',
      lastContact: '1 hour ago',
      conversations: 2,
      value: 600,
    },
  ]

  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')
        return
      }

      setUser(session.user)
      setLoading(false)
    }

    loadUser()
  }, [supabase, router])

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.phone && contact.phone.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([])
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id))
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'lead': return 'bg-blue-100 text-blue-800'
      case 'customer': return 'bg-purple-100 text-purple-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-8">
        <div className="text-gray-600">Loading contacts...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      {/* Back Button */}
      <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Contacts</h1>
            <p className="text-gray-600">Manage your leads and customer relationships</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-all border border-gray-300">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg btn-primary-gradient text-white font-medium hover:shadow-lg transition-all">
              <Plus className="w-4 h-4" />
              Add Contact
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-gray-200 bg-white p-5 brand-gradient-border">
            <div className="text-2xl font-bold text-gray-900 mb-1">48</div>
            <div className="text-sm text-gray-600">Total Contacts</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 brand-gradient-border">
            <div className="text-2xl font-bold text-gray-900 mb-1">12</div>
            <div className="text-sm text-gray-600">New This Week</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 brand-gradient-border">
            <div className="text-2xl font-bold text-gray-900 mb-1">24</div>
            <div className="text-sm text-gray-600">Active Conversations</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 brand-gradient-border">
            <div className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(14500)}</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {statusOptions.map((status) => (
                <button
                  key={status.id}
                  onClick={() => setStatusFilter(status.id)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === status.id
                    ? 'btn-primary-gradient text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.name} ({status.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden brand-gradient-border">
          {/* Table Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded"
              />
              <div className="flex-1 grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                <div className="col-span-4">Contact</div>
                <div className="col-span-2">Platform</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Last Contact</div>
                <div className="col-span-2">Value</div>
              </div>
              <div className="w-8"></div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => toggleContactSelection(contact.id)}
                    className="w-4 h-4 rounded"
                  />
                  <div className="flex-1 grid grid-cols-12 gap-4">
                    {/* Contact Info */}
                    <div className="col-span-4">
                      <div className="font-medium text-gray-900">{contact.name}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Mail className="w-3 h-3" />
                        <span>{contact.email}</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Phone className="w-3 h-3" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Platform */}
                    <div className="col-span-2 flex items-center">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded ${contact.platform === 'Instagram' ? 'bg-pink-100' : contact.platform === 'Facebook' ? 'bg-blue-100' : 'bg-green-100'}`}>
                          {contact.platform === 'Instagram' ? 'IG' : contact.platform === 'Facebook' ? 'FB' : 'WA'}
                        </div>
                        <span className="text-sm text-gray-700">{contact.platform}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                        {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{contact.conversations} conv</div>
                    </div>

                    {/* Last Contact */}
                    <div className="col-span-2 text-sm text-gray-700">
                      {contact.lastContact}
                    </div>

                    {/* Value */}
                    <div className="col-span-2 font-medium text-gray-900">
                      {formatCurrency(contact.value)}
                    </div>
                  </div>

                  {/* Actions */}
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Table Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedContacts.length} of {filteredContacts.length} contacts selected
              </div>
              <div className="flex gap-3">
                <button
                  disabled={selectedContacts.length === 0}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Message Selected
                </button>
                <button
                  disabled={selectedContacts.length === 0}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export Selected
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedContacts.length > 0 && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Bulk Actions ({selectedContacts.length} contacts selected)</h3>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 text-sm font-medium hover:bg-gray-50">
                <MessageCircle className="w-4 h-4" />
                Send Message
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 text-sm font-medium hover:bg-gray-50">
                <Mail className="w-4 h-4" />
                Add to Campaign
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 text-sm font-medium hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Apply Tag
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm font-medium hover:bg-red-200">
                Archive Selected
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 mb-4">
              <Users className="w-8 h-8 text-gray-800" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('all')
              }}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 border border-gray-300 text-gray-800 font-medium hover:from-pink-100 hover:to-purple-100"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}