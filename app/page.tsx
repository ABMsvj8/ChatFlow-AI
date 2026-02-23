'use client'

import Link from 'next/link'
import { ArrowRight, MessageSquare, Zap, Globe } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-black text-zinc-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight">ChatFlow AI</div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-zinc-300 hover:text-zinc-50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signin"
              className="px-4 py-2 rounded-lg bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Content */}
          <div className="text-center space-y-8 mb-20">
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-medium text-zinc-400">AI-Powered Communication</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
              <span className="block">AI agents that</span>
              <span className="block bg-gradient-to-r from-emerald-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                sell, support, and
              </span>
              <span className="block">communicate like real humans</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
              ChatFlow AI helps businesses automate customer conversations while maintaining that personal touch. Deploy intelligent agents that understand context, emotion, and intent.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-white text-zinc-900 font-semibold text-base hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-50 font-semibold text-base transition-all backdrop-blur-sm"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-32">
            {/* Feature 1 */}
            <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors backdrop-blur-sm group">
              <div className="h-12 w-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Natural Conversations</h3>
              <p className="text-sm text-zinc-400">
                AI agents that understand context and respond with genuine empathy, not robotic scripts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors backdrop-blur-sm group">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Instant Results</h3>
              <p className="text-sm text-zinc-400">
                Deploy in minutes. Handle customer inquiries 24/7 without additional hiring or training costs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors backdrop-blur-sm group">
              <div className="h-12 w-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Omnichannel Ready</h3>
              <p className="text-sm text-zinc-400">
                Works across email, chat, social media, and voice. One platform for all your customer interactions.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-between">
          <div className="text-sm text-zinc-500">© 2025 ChatFlow AI. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
