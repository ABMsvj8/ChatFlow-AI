import React from 'react'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import {
  LayoutDashboard,
  Bot,
  Link2,
  MessageSquare,
  BarChart3,
  Settings,
} from 'lucide-react'
import { SidebarNav } from '@/components/SidebarNav'

async function getSession() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handle error silently as cookies may be immutable in some cases
          }
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session
}

async function signOut() {
  'use server'

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handle error silently
          }
        },
      },
    }
  )

  await supabase.auth.signOut()

  // Use dynamic import for redirect to avoid issues
  const { redirect } = await import('next/navigation')
  redirect('/')
}

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/agents', label: 'AI Agents', icon: Bot },
  {
    href: '/dashboard/connections',
    label: 'Connections',
    icon: Link2,
  },
  {
    href: '/dashboard/conversations',
    label: 'Conversations',
    icon: MessageSquare,
  },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.ReactElement> {
  const session = await getSession()
  const userEmail = session?.user?.email || 'User'

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-60 bg-[#0A0A0A] border-r border-[#18181B] flex flex-col">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#18181B] flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-bold">⚡</span>
          </div>
          <span className="text-white font-bold text-lg">ChatFlow</span>
        </div>

        {/* Navigation */}
        <SidebarNav navItems={navItems} />

        {/* User Section */}
        <div className="border-t border-[#18181B] px-6 py-4 space-y-3">
          <div className="text-xs text-zinc-400">{userEmail}</div>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full text-left text-xs font-medium text-zinc-400 hover:text-white transition-colors py-2"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-60 min-h-screen bg-black p-8">{children}</main>
    </div>
  )
}
