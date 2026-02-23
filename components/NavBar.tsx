'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Square } from 'lucide-react'

interface NavBarProps {
  onSignIn: () => void
  onGetStarted: () => void
}

export default function NavBar({ onSignIn, onGetStarted }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [showBorder, setShowBorder] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const scrollingDown = currentY > lastScrollY.current
      lastScrollY.current = currentY

      setScrolled(currentY > 10)
      setShowBorder(scrollingDown && currentY > 80)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'backdrop-blur-md bg-black/80' : 'bg-transparent',
        showBorder ? 'border-b border-[#18181b]' : 'border-b border-transparent',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-[#7c3aed] flex items-center justify-center">
            <Square className="w-3 h-3 text-white fill-white" />
          </div>
          <span className="text-[#fafafa] font-black text-lg tracking-tight">ChatFlow</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {['Platform', 'Pricing', 'Docs'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-[#71717a] text-sm font-medium transition-opacity duration-200 hover:opacity-100 hover:text-[#fafafa]"
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSignIn}
            className="hidden sm:block text-sm font-medium text-[#71717a] hover:text-[#fafafa] transition-colors duration-200 px-3 py-1.5"
          >
            Sign in
          </button>
          <button
            onClick={onGetStarted}
            className="text-sm font-semibold bg-[#7c3aed] text-white px-4 py-2 hover:bg-[#6d28d9] transition-colors duration-200"
          >
            Get started →
          </button>
        </div>
      </div>
    </nav>
  )
}
