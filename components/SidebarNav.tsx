'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

interface SidebarNavProps {
  navItems: NavItem[]
}

export function SidebarNav({ navItems }: SidebarNavProps): React.ReactElement {
  const pathname = usePathname()

  return (
    <nav className="space-y-2 flex-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <a
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-violet-700/20 text-violet-400'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </a>
        )
      })}
    </nav>
  )
}
