'use client'

import React from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <div className="flex h-screen bg-black">
      {/* Main Content — full width for now */}
      <main className="w-full min-h-screen bg-black">{children}</main>
    </div>
  )
}
