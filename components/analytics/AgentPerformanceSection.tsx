'use client'

import { BarChart3 } from 'lucide-react'

interface AgentPerformance {
  id: string
  name: string
  conversations: number
  conversionRate: number
}

interface AgentPerformanceSectionProps {
  agents: AgentPerformance[]
}

export default function AgentPerformanceSection({ agents }: AgentPerformanceSectionProps) {
  if (agents.length === 0) {
    return (
      <div className="p-8 rounded-lg border border-zinc-800/50 bg-zinc-900/30 text-center">
        <BarChart3 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No agents yet</h3>
        <p className="text-zinc-400 text-sm">
          Create an agent to start tracking performance.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-lg border border-zinc-800/50 bg-zinc-900/30">
      <h3 className="text-lg font-semibold text-white mb-6">Agent Performance</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800/50">
              <th className="px-4 py-3 text-left text-zinc-400 font-medium">Agent</th>
              <th className="px-4 py-3 text-right text-zinc-400 font-medium">Conversations</th>
              <th className="px-4 py-3 text-right text-zinc-400 font-medium">Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-all">
                <td className="px-4 py-3 text-white font-medium">{agent.name}</td>
                <td className="px-4 py-3 text-right text-zinc-300">{agent.conversations}</td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-600/20 text-purple-400 border border-purple-500/30">
                    {agent.conversionRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
