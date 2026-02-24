'use client'

import { Hand, RotateCcw, CheckCircle2, LogIn } from 'lucide-react'

interface ActionBarProps {
  status: 'active' | 'resolved' | 'escalated'
  onTakeOver: () => void
  onHandBack: () => void
  onResolve: () => void
  isHumanTakeover: boolean
}

export default function ActionBar({
  status,
  onTakeOver,
  onHandBack,
  onResolve,
  isHumanTakeover,
}: ActionBarProps) {
  const isResolved = status === 'resolved'

  return (
    <div className="p-4 border-t border-zinc-800/50 bg-zinc-900/20 space-y-2">
      <div className="flex gap-2">
        {!isHumanTakeover && !isResolved && (
          <button
            onClick={onTakeOver}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all"
          >
            <LogIn className="w-4 h-4" />
            Take Over
          </button>
        )}

        {isHumanTakeover && !isResolved && (
          <button
            onClick={onHandBack}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Hand Back to Agent
          </button>
        )}

        {!isResolved && (
          <button
            onClick={onResolve}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Resolve
          </button>
        )}

        {isResolved && (
          <div className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg bg-zinc-800/30 text-zinc-400 text-sm font-medium">
            ✓ Conversation Resolved
          </div>
        )}
      </div>
    </div>
  )
}
