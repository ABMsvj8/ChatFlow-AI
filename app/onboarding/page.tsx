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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#FAFAF9] via-white to-white px-4">
      <div className="w-full max-w-md">
        <div className="space-y-8">
          {/* Logo/Brand */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">⚡</span>
              </div>
              <span className="text-gray-900 font-bold text-2xl">ChatFlow AI</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-lg p-8 brand-gradient-border">
            {/* Headline */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to ChatFlow AI
              </h1>
              <p className="text-gray-600">
                What's your business called?
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Name Input */}
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 transition-all disabled:bg-gray-100 disabled:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500/20"
                  autoFocus
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Get Started Button */}
              <button
                type="submit"
                disabled={loading || !businessName.trim()}
                className="w-full rounded-lg btn-primary-gradient py-3 px-4 font-semibold text-white transition-all hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
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
            <p className="mt-6 text-center text-xs text-gray-500">
              This will create your business profile and take you to the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
