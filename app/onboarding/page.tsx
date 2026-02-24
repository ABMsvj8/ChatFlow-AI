'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!businessName.trim()) {
      setError('Business name is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/onboarding/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: businessName.trim(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to create business')
        setLoading(false)
        return
      }

      // Redirect to dashboard on success
      router.push('/dashboard')
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md">
        <div className="space-y-8">
          {/* Logo/Brand */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">⚡</span>
              </div>
              <span className="text-white font-bold text-2xl">ChatFlow AI</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 backdrop-blur p-8">
            {/* Headline */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-white mb-2">
                Welcome to ChatFlow AI
              </h1>
              <p className="text-zinc-400">
                What's your business called?
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Name Input */}
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-zinc-300 mb-2">
                  Business Name
                </label>
                <input
                  id="businessName"
                  type="text"
                  placeholder="e.g., Acme Corp"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  disabled={loading}
                  maxLength={255}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 transition-all disabled:bg-zinc-900/30 disabled:text-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
                  autoFocus
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-red-800/50 bg-red-950/30 p-3">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* Get Started Button */}
              <button
                type="submit"
                disabled={loading || !businessName.trim()}
                className="w-full rounded-lg bg-white py-3 px-4 font-semibold text-zinc-900 transition-all hover:bg-zinc-100 disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating business...
                  </span>
                ) : (
                  'Get Started'
                )}
              </button>
            </form>

            {/* Footer text */}
            <p className="mt-6 text-center text-xs text-zinc-500">
              This will create your business profile and take you to the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
