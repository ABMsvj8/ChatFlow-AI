import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ChatFlow AI — Conversational AI Infrastructure',
  description:
    'Deploy AI agents that close deals, book appointments, and handle support across every DM, 24/7. While you sleep.',
  openGraph: {
    title: 'ChatFlow AI — Conversational AI Infrastructure',
    description:
      'Deploy AI agents that close deals, book appointments, and handle support across every DM, 24/7.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
