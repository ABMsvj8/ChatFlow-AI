'use client'

import { useEffect, useState } from 'react'
import NavBar from '@/components/NavBar'
import AuthModals from '@/components/AuthModals'

type ModalMode = 'signin' | 'signup' | null

// LandingClient manages global modal state via a custom DOM event.
// Server component CTAs dispatch `open-chatflow-modal` with detail { mode }.
// NavBar sign-in / get-started buttons fire the same event.
export default function LandingClient() {
  const [modalMode, setModalMode] = useState<ModalMode>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ mode: ModalMode }>).detail
      setModalMode(detail.mode)
    }
    window.addEventListener('open-chatflow-modal', handler)
    return () => window.removeEventListener('open-chatflow-modal', handler)
  }, [])

  const openModal = (mode: ModalMode) => {
    setModalMode(mode)
  }

  return (
    <>
      <NavBar
        onSignIn={() => openModal('signin')}
        onGetStarted={() => openModal('signup')}
      />
      {modalMode && (
        <AuthModals initialMode={modalMode} onClose={() => setModalMode(null)} />
      )}
    </>
  )
}
