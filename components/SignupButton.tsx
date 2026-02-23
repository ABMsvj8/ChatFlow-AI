'use client'

import type { ReactNode } from 'react'

interface SignupButtonProps {
  children: ReactNode
  className?: string
  mode?: 'signup' | 'signin'
}

function dispatchModalOpen(mode: 'signup' | 'signin') {
  window.dispatchEvent(
    new CustomEvent('open-chatflow-modal', { detail: { mode } })
  )
}

export function SignupButton({ children, className, mode = 'signup' }: SignupButtonProps) {
  return (
    <button
      onClick={() => dispatchModalOpen(mode)}
      className={className}
    >
      {children}
    </button>
  )
}
