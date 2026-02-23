'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Mail, Lock, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

type ModalMode = 'signin' | 'signup' | null

interface AuthModalsProps {
  initialMode: ModalMode
  onClose: () => void
}

export default function AuthModals({ initialMode, onClose }: AuthModalsProps) {
  const [mode, setMode] = useState<ModalMode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  if (!mode) return null

  const supabase = createClient()

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setError(null)
    setSuccess(null)
  }

  const switchMode = (newMode: ModalMode) => {
    resetForm()
    setMode(newMode)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        })

        if (signUpError) {
          setError(signUpError.message)
        } else {
          setSuccess('Check your email to confirm your account.')
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          setError(signInError.message)
        } else {
          router.push('/dashboard')
          onClose()
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md"
        style={{
          background: '#000',
          border: '1px solid #18181b',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 0 1px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-[#18181b]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 bg-[#7c3aed] flex items-center justify-center">
                <div className="w-2 h-2 bg-white" />
              </div>
              <span className="text-xs font-semibold text-[#7c3aed] tracking-widest uppercase">
                ChatFlow
              </span>
            </div>
            <h2 className="text-xl font-black text-[#fafafa]">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-sm text-[#71717a] mt-1">
              {mode === 'signup'
                ? 'Start for free. No credit card required.'
                : 'Sign in to your ChatFlow account.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#71717a] hover:text-[#fafafa] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          {/* Error / Success */}
          {error && (
            <div
              className="flex items-center gap-2 p-3 text-sm"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#fca5a5',
              }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div
              className="p-3 text-sm"
              style={{
                background: 'rgba(6,182,212,0.08)',
                border: '1px solid rgba(6,182,212,0.2)',
                color: '#67e8f9',
              }}
            >
              {success}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-[#71717a] mb-2 tracking-wide uppercase">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="w-full pl-10 pr-4 py-3 text-sm text-[#fafafa] placeholder-[#52525b] bg-[#0a0a0a] border border-[#27272a] focus:border-[#7c3aed] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#71717a] mb-2 tracking-wide uppercase">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={8}
                className="w-full pl-10 pr-4 py-3 text-sm text-[#fafafa] placeholder-[#52525b] bg-[#0a0a0a] border border-[#27272a] focus:border-[#7c3aed] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
              </span>
            ) : mode === 'signup' ? (
              'Create account →'
            ) : (
              'Sign in →'
            )}
          </button>

          {/* Switch mode */}
          <p className="text-center text-xs text-[#71717a] pt-2">
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => switchMode(mode === 'signup' ? 'signin' : 'signup')}
              className="text-[#7c3aed] hover:text-[#a78bfa] transition-colors font-semibold"
            >
              {mode === 'signup' ? 'Sign in' : 'Sign up free'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
