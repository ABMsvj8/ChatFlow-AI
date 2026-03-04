'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Zap,
  MessageSquare,
  Link2,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Instagram,
  Facebook,
  MessageCircle,
  Smartphone,
} from 'lucide-react'
import Link from 'next/link'

interface User {
  email?: string
  id?: string
}

interface ConnectedAccount {
  id: string
  platform: string
  platform_account_id: string
  metadata: Record<string, any>
  created_at: string
}

interface Agent {
  id: string
  name: string
  is_active: boolean
  created_at: string
}

function DashboardContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createClient()

  // Navigation items
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Agents', icon: Zap, href: '/agents' },
    { label: 'Conversations', icon: MessageSquare, href: '/conversations' },
    { label: 'Platforms', icon: Link2, href: '/platforms' },
    { label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ]

  const isActive = (href: string) => pathname === href

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
        email: session.user?.email,
        id: session.user?.id,
      })

      // Get user's business
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', session.user?.id)
        .limit(1)
        .single()

      // Check if business exists
      if (businessError && businessError.code === 'PGRST116') {
        // No business found - redirect to onboarding
        router.push('/onboarding')
        return
      }

      if (business && 'id' in business) {
        const bid = (business as { id: string }).id
        setBusinessId(bid)
        // Load connected platforms
        const { data: accounts } = await supabase
          .from('connected_platforms')
          .select('*')
          .eq('business_id', bid)

        if (accounts && Array.isArray(accounts)) {
          setConnectedAccounts(accounts as ConnectedAccount[])
        }

        // Load agents
        const { data: agentsList } = await supabase
          .from('agents')
          .select('id, name, is_active, created_at')
          .eq('business_id', bid)
          .order('created_at', { ascending: false })

        if (agentsList && Array.isArray(agentsList)) {
          setAgents(agentsList as Agent[])
        }
      }

      // Check for success/error messages in URL
      const errorParam = searchParams.get('error')
      const connectedParam = searchParams.get('connected')

      if (errorParam) {
        setError(errorParam)
      }
      if (connectedParam) {
        setSuccess(`${connectedParam} connected successfully!`)
        // Refresh connected accounts
        setTimeout(() => window.location.href = '/dashboard', 2000)
      }

      setLoading(false)
    }

    checkSession()
  }, [router, supabase, searchParams])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  // Platform cards data
  const platformsList = [
    {
      name: 'Instagram',
      icon: Instagram,
      connected: connectedAccounts.some((a) => a.platform === 'instagram'),
      account: connectedAccounts.find((a) => a.platform === 'instagram')?.metadata?.username,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      connected: connectedAccounts.some((a) => a.platform === 'facebook'),
      account: connectedAccounts.find((a) => a.platform === 'facebook')?.metadata?.page_name,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      connected: connectedAccounts.some((a) => a.platform === 'whatsapp'),
      account: connectedAccounts.find((a) => a.platform === 'whatsapp')?.metadata?.phone_number,
    },
    {
      name: 'TikTok',
      icon: Smartphone,
      connected: connectedAccounts.some((a) => a.platform === 'tiktok'),
      account: connectedAccounts.find((a) => a.platform === 'tiktok')?.metadata?.username,
    },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 bg-white flex flex-col shadow-sm">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">⚡</span>
              </div>
              <span className="text-gray-900 font-bold text-sm">ChatFlow AI</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    active
                      ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-gray-900 border border-gray-200 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <div className="px-4 py-2">
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-[#FAFAF9]">
          <div className="p-8">
            {/* Error/Success Messages */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Connection failed</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-800 font-medium">Success!</p>
                  <p className="text-green-600 text-sm mt-1">{success}</p>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-1 text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back to ChatFlow AI</p>
            </div>

            {/* SECTION 1: Stats Bar */}
            <div className="mb-8">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Total Conversations', value: '0' },
                  { label: 'Response Rate', value: '—' },
                  { label: 'Avg Response Time', value: '—' },
                  { label: 'Satisfaction Score', value: '—' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all brand-gradient-border"
                  >
                    <p className="text-gray-600 text-xs font-medium mb-2">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: Your AI Agents */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Your AI Agents</h2>
                {agents.length > 0 && (
                  <Link
                    href="/onboarding/agent"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg btn-primary-gradient font-medium text-xs transition-all hover:shadow-md"
                  >
                    New Agent ✨
                  </Link>
                )}
              </div>
              {agents.length === 0 ? (
                <div className="p-12 rounded-lg border border-gray-200 bg-white text-center brand-gradient-border">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg brand-glow-purple mb-4">
                    <Zap className="w-8 h-8 text-gray-800" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">No agents yet</h3>
                  <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
                    Your AI agent handles every incoming DM automatically.
                  </p>
                  <Link
                    href="/onboarding/agent"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg btn-primary-gradient font-medium text-sm transition-all hover:shadow-lg"
                  >
                    Create Your First Agent ✨
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="p-5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all flex flex-col"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-5 h-5 text-gray-800" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-gray-900 truncate">{agent.name}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {agent.is_active ? '🟢 Active' : '🔴 Inactive'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-auto pt-3">
                        <Link
                          href={`/dashboard/agents/${agent.id}/edit`}
                          className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 text-gray-700 text-xs font-medium transition-all border border-gray-300 text-center brand-gradient-border"
                        >
                          Edit
                        </Link>
                        <button className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-all border border-gray-300">
                          More
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 3: Connected Platforms */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Connected Platforms</h2>
              <div className="grid grid-cols-4 gap-4">
                {platformsList.map((platform, i) => {
                  const Icon = platform.icon
                  return (
                    <div
                      key={i}
                      className="p-5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all flex flex-col"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Icon className="w-6 h-6 text-gray-600" />
                        {platform.connected && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            Connected
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm mb-2">{platform.name}</h3>
                      {platform.connected ? (
                        <p className="text-xs text-gray-600 mb-3 flex-1">
                          Connected as <span className="text-zinc-300">{platform.account || 'Account'}</span>
                        </p>
                      ) : (
                        <p className="text-xs text-gray-600 mb-3 flex-1">Not connected yet</p>
                      )}
                      {platform.name === 'Instagram' ? (
                        <Link
                          href="/api/auth/instagram/customers"
                          className="w-full px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-xs font-medium transition-all border border-purple-500/30 text-center"
                        >
                          {platform.connected ? 'Manage' : 'Connect'}
                        </Link>
                      ) : platform.name === 'Facebook' ? (
                        <Link
                          href="/api/auth/facebook/customers"
                          className="w-full px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-xs font-medium transition-all border border-purple-500/30 text-center"
                        >
                          {platform.connected ? 'Manage' : 'Connect'}
                        </Link>
                      ) : platform.name === 'WhatsApp' ? (
                        <Link
                          href="/api/auth/whatsapp/customers"
                          className="w-full px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-xs font-medium transition-all border border-purple-500/30 text-center"
                        >
                          {platform.connected ? 'Manage' : 'Connect'}
                        </Link>
                      ) : (
                        <button className="w-full px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-xs font-medium transition-all border border-purple-500/30 disabled:opacity-50">
                          {platform.connected ? 'Manage' : 'Coming Soon'}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* SECTION 4: Recent Conversations */}
            <div>
              <h2 className="text-xl font-bold mb-4">Recent Conversations</h2>
              <div className="p-12 rounded-lg border border-gray-200 bg-white text-center brand-gradient-border">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                <p className="text-gray-600 text-sm">
                  Connect a platform and create an agent to get started.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-white"><div className="text-gray-600">Loading...</div></div>}>
      <DashboardContent />
    </Suspense>
  )
}
