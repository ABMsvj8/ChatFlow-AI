'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Instagram, Facebook, MessageCircle, Smartphone, Zap, Check, Link } from 'lucide-react'
import Link from 'next/link'

interface Platform {
  id: string
  name: string
  icon: any
  connected: boolean
  description: string
}

export default function IntegrationsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [connecting, setConnecting] = useState<string | null>(null)

  const supabase = createClient()

  const platforms: Platform[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      connected: false,
      description: 'Connect your Instagram Business account to handle DMs automatically',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      connected: false,
      description: 'Connect Facebook Pages to manage Messenger conversations',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      connected: false,
      description: 'Connect WhatsApp Business API for automated messaging',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: Smartphone,
      connected: false,
      description: 'Connect TikTok Business to handle comments and messages',
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

      // TODO: Load actual platform connections from database
      setLoading(false)
    }

    loadUser()
  }, [supabase, router])

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId)
    
    // Simulate API call
    setTimeout(() => {
      // TODO: Actual OAuth flow
      alert(`Connecting to ${platformId}... In a real app, this would redirect to OAuth`)
      setConnecting(null)
    }, 1000)
  }

  const handleDisconnect = async (platformId: string) => {
    // TODO: Actual disconnect API
    alert(`Disconnecting from ${platformId}...`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-8">
        <div className="text-gray-600">Loading integrations...</div>
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
        <h1 className="text-3xl font-bold mb-1">Integrations</h1>
        <p className="text-gray-600">Connect your platforms to automate conversations</p>
      </div>

      <div className="max-w-3xl">
        {/* Connected Platforms */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-gray-800" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Connected Platforms</h2>
              <p className="text-gray-600 text-sm">Platforms currently connected to your agents</p>
            </div>
          </div>

          {platforms.filter(p => p.connected).length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center brand-gradient-border">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 mb-4">
                <Link className="w-8 h-8 text-gray-800" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No platforms connected yet</h3>
              <p className="text-gray-600 max-w-sm mx-auto mb-6">
                Connect your first platform to start automating conversations
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platforms.filter(p => p.connected).map((platform) => {
                const Icon = platform.icon
                return (
                  <div key={platform.id} className="rounded-xl border border-gray-200 bg-white p-5 brand-gradient-border">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gray-800" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{platform.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <Check className="w-3 h-3" />
                            Connected
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{platform.description}</p>
                    <button
                      onClick={() => handleDisconnect(platform.id)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm font-medium hover:bg-gray-50 transition-all"
                    >
                      Disconnect
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Available Platforms */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Available Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platforms.map((platform) => {
              const Icon = platform.icon
              return (
                <div key={platform.id} className="rounded-xl border border-gray-200 bg-white p-5 brand-gradient-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-800" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{platform.name}</h3>
                        <div className="text-xs text-gray-500">{platform.connected ? 'Connected' : 'Not connected'}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{platform.description}</p>
                  <button
                    onClick={() => handleConnect(platform.id)}
                    disabled={connecting === platform.id}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${platform.connected
                      ? 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
                      : 'btn-primary-gradient hover:shadow-lg text-white'
                    }`}
                  >
                    {connecting === platform.id ? 'Connecting...' : platform.connected ? 'Reconnect' : 'Connect'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* API Documentation */}
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 brand-gradient-border">
          <h2 className="text-xl font-bold text-gray-900 mb-4">API Access</h2>
          <p className="text-gray-600 mb-4">
            Need programmatic access? Use our REST API to build custom integrations.
          </p>
          <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm font-medium hover:bg-gray-50 transition-all">
            View API Documentation
          </button>
        </div>
      </div>
    </div>
  )
}