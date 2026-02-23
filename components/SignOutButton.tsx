'use client'

import React from 'react'
import { signOut } from '@/app/dashboard/actions'

export function SignOutButton(): React.ReactElement {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="w-full text-left text-xs font-medium text-zinc-400 hover:text-white transition-colors py-2"
      >
        Sign Out
      </button>
    </form>
  )
}
