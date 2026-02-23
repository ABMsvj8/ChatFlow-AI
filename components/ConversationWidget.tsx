'use client'

import { Calendar } from 'lucide-react'

export default function ConversationWidget() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Glow behind widget */}
      <div
        className="absolute inset-0 blur-3xl opacity-30 rounded-3xl"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(124,58,237,0.6) 0%, rgba(6,182,212,0.2) 60%, transparent 100%)',
        }}
      />

      {/* Phone frame */}
      <div
        className="relative rounded-2xl overflow-hidden border border-[#27272a]"
        style={{
          background: '#0a0a0a',
          boxShadow:
            '0 25px 50px -12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#18181b]">
          <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs font-bold text-white">
            AI
          </div>
          <div>
            <div className="text-xs font-semibold text-[#fafafa]">ChatFlow Agent</div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span className="text-[10px] text-[#71717a]">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="px-4 py-4 space-y-3 min-h-[280px]">
          {/* Customer message 1 */}
          <div className="msg-1 flex justify-end">
            <div
              className="text-xs text-[#fafafa] px-3 py-2 rounded-2xl rounded-br-sm max-w-[75%]"
              style={{ background: '#27272a' }}
            >
              Hey is this still available?
            </div>
          </div>

          {/* Typing indicator */}
          <div className="msg-typing flex justify-start">
            <div
              className="flex items-center gap-1 px-3 py-2.5 rounded-2xl rounded-bl-sm"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.2)' }}
            >
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>

          {/* Agent message 1 */}
          <div className="msg-2 flex justify-start">
            <div
              className="text-xs text-[#fafafa] px-3 py-2 rounded-2xl rounded-bl-sm max-w-[85%]"
              style={{
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.2)',
              }}
            >
              Hey! Yes it is 👋 Are you looking for the standard or premium package?
            </div>
          </div>

          {/* Customer message 2 */}
          <div className="msg-3 flex justify-end">
            <div
              className="text-xs text-[#fafafa] px-3 py-2 rounded-2xl rounded-br-sm max-w-[40%]"
              style={{ background: '#27272a' }}
            >
              premium
            </div>
          </div>

          {/* Agent message 2 */}
          <div className="msg-4 flex justify-start">
            <div
              className="text-xs text-[#fafafa] px-3 py-2 rounded-2xl rounded-bl-sm max-w-[90%]"
              style={{
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.2)',
              }}
            >
              Perfect — I can get you set up right now. What&apos;s a good time this week?
            </div>
          </div>

          {/* Booked confirmation */}
          <div className="msg-booked flex justify-center">
            <div
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full"
              style={{
                background: 'rgba(6,182,212,0.1)',
                border: '1px solid rgba(6,182,212,0.3)',
                color: '#06b6d4',
              }}
            >
              <Calendar className="w-3 h-3" />
              Booked: Tuesday 3pm ✓
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div className="px-4 py-3 border-t border-[#18181b] flex items-center gap-2">
          <div
            className="flex-1 text-xs text-[#52525b] px-3 py-2 rounded-full"
            style={{ background: '#18181b' }}
          >
            Message...
          </div>
          <div className="w-7 h-7 rounded-full bg-[#7c3aed] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats bubbles */}
      <div
        className="absolute -top-3 -right-3 text-xs font-semibold px-3 py-1.5 rounded-full fade-up fade-up-delay-5"
        style={{
          background: 'rgba(6,182,212,0.15)',
          border: '1px solid rgba(6,182,212,0.3)',
          color: '#06b6d4',
        }}
      >
        24/7 Active
      </div>
      <div
        className="absolute -bottom-3 -left-3 text-xs font-semibold px-3 py-1.5 rounded-full fade-up fade-up-delay-6"
        style={{
          background: 'rgba(124,58,237,0.15)',
          border: '1px solid rgba(124,58,237,0.3)',
          color: '#a78bfa',
        }}
      >
        Booked in 4m 32s
      </div>
    </div>
  )
}
