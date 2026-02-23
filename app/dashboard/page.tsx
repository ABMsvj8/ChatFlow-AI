'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, Settings, Plus, AlertCircle, CheckCircle2 } from 'lucide-react'

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

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([])
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createClient()

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
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', session.user?.id)
        .limit(1)
        .single()

      if (business && 'id' in business) {
        const bid = (business as { id: string }).id
        setBusinessId(bid)
        // Load connected accounts
        const { data: accounts } = await supabase
          .from('connected_accounts')
          .select('*')
          .eq('business_id', bid)

        if (accounts && Array.isArray(accounts)) {
          setConnectedAccounts(accounts as ConnectedAccount[])
        }
      }

      // Check for success/error messages in URL
      const errorParam = searchParams.get('error')
      const successParam = searchParams.get('success')

      if (errorParam) {
        setError(errorParam)
      }
      if (successParam) {
        setSuccess(`${successParam} connected successfully!`)
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
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-zinc-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">⚡</span>
            </div>
            <span className="text-white font-bold text-lg">ChatFlow AI</span>
          </div>

          {/* Right section: User email + Sign out */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-50 text-sm font-medium transition-all"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-950/50 border border-red-800 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-200 font-medium">Connection failed</p>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-950/50 border border-green-800 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-200 font-medium">Success!</p>
              <p className="text-green-300 text-sm mt-1">{success}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-zinc-400">Welcome back to ChatFlow AI</p>
        </div>

        {/* Dashboard Grid */}
        <div className="space-y-8">
          {/* Connected Accounts Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Connected Accounts</h2>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-all">
                <Plus className="h-4 w-4" />
                Add Account
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Instagram Card */}
              {(() => {
                const igAccount = connectedAccounts.find((acc) => acc.platform === 'instagram')
                return (
                  <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                      <span className="text-lg">📷</span>
                    </div>
                    <h3 className="font-semibold mb-1">Instagram</h3>
                    {igAccount ? (
                      <>
                        <p className="text-sm text-green-400 mb-4">
                          ✓ Connected as @{igAccount.metadata?.username || igAccount.platform_account_id}
                        </p>
                        <button
                          onClick={() => {
                            // TODO: Add disconnect functionality
                            alert('Disconnect feature coming soon')
                          }}
                          className="w-full px-3 py-2 rounded bg-red-900/50 hover:bg-red-800/50 text-sm text-red-300 transition-colors"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-zinc-400 mb-4">Connect your Instagram Business account</p>
                        <button
                          onClick={() => router.push('/api/auth/instagram')}
                          className="w-full px-3 py-2 rounded bg-violet-600 hover:bg-violet-700 text-sm text-white transition-colors font-medium"
                        >
                          Connect
                        </button>
                      </>
                    )}
                  </div>
                )
              })()}

              {/* Facebook Card */}
              <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
                  <span className="text-lg">f</span>
                </div>
                <h3 className="font-semibold mb-1">Facebook</h3>
                <p className="text-sm text-zinc-400 mb-4">Coming soon</p>
                <button className="w-full px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 transition-colors">
                  Connect
                </button>
              </div>

              {/* WhatsApp Card */}
              <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center mb-4">
                  <span className="text-lg">💬</span>
                </div>
                <h3 className="font-semibold mb-1">WhatsApp</h3>
                <p className="text-sm text-zinc-400 mb-4">Coming soon</p>
                <button className="w-full px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 transition-colors">
                  Connect
                </button>
              </div>

              {/* TikTok Card */}
              <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-black border border-zinc-700 flex items-center justify-center mb-4">
                  <span className="text-lg">🎵</span>
                </div>
                <h3 className="font-semibold mb-1">TikTok</h3>
                <p className="text-sm text-zinc-400 mb-4">Coming soon</p>
                <button className="w-full px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 transition-colors">
                  Connect
                </button>
              </div>
            </div>
          </div>

          {/* Active Conversations Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Active Conversations</h2>
            <div className="p-12 rounded-lg border border-zinc-800 bg-zinc-950/50">
              <div className="text-center">
                <div className="h-16 w-16 rounded-lg bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">No active conversations</h3>
                <p className="text-zinc-400 text-sm max-w-md mx-auto">
                  Connect your accounts above to start receiving and managing conversations across all your channels.
                </p>
              </div>
            </div>
          </div>

          {/* AI Agents Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">AI Agents</h2>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-all">
                <Plus className="h-4 w-4" />
                Create Agent
              </button>
            </div>
            <div className="p-12 rounded-lg border border-zinc-800 bg-zinc-950/50">
              <div className="text-center">
                <div className="h-16 w-16 rounded-lg bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">No AI agents yet</h3>
                <p className="text-zinc-400 text-sm max-w-md mx-auto">
                  Create your first AI agent to start automating customer conversations. You can customize behavior, knowledge base, and tone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-black"><div className="text-zinc-400">Loading...</div></div>}>
      <DashboardContent />
    </Suspense>
  )
}
