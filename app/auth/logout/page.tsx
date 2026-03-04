'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LogoutPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [countdown, setCountdown] = useState(3)

  const supabase = createClient()

  useEffect(() => {
    const performLogout = async () => {
      try {
        const { error } = await supabase.auth.signOut()
        
        if (error) {
          console.error('Logout error:', error)
          setStatus('error')
          return
        }

        setStatus('success')
        
        // Start countdown for redirect
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              router.push('/')
              return 0
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      } catch (err) {
        console.error('Logout error:', err)
        setStatus('error')
      }
    }

    performLogout()
  }, [supabase, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] via-white to-white p-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 mb-6">
            <LogOut className="w-10 h-10 text-gray-800 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Signing out...</h1>
          <p className="text-gray-600">Please wait while we sign you out of your account.</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] via-white to-white p-4">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center brand-gradient-border">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
              <LogOut className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Logout Failed</h1>
            <p className="text-gray-600 mb-6">
              There was an issue signing you out. Please try again.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 border border-gray-300 text-gray-800 font-medium hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 transition-all"
              >
                Try Again
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-center transition-all border border-gray-300"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] via-white to-white p-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center brand-gradient-border">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Successfully Signed Out</h1>
          <p className="text-gray-600 mb-6">
            You have been signed out of your account. You'll be redirected in {countdown} seconds...
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg btn-primary-gradient text-white font-medium hover:shadow-lg transition-all"
            >
              Go to Homepage
            </Link>
            <Link
              href="/auth/signin"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-all border border-gray-300"
            >
              <LogOut className="w-4 h-4" />
              Sign In Again
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to ChatFlow AI homepage
          </Link>
        </div>
      </div>
    </div>
  )
}