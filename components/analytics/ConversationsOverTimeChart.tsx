'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ConversationPoint {
  date: string
  count: number
}

interface ConversationsOverTimeChartProps {
  data: ConversationPoint[]
}

export default function ConversationsOverTimeChart({ data }: ConversationsOverTimeChartProps) {
  return (
    <div className="p-6 rounded-lg border border-zinc-800/50 bg-zinc-900/30">
      <h3 className="text-lg font-semibold text-white mb-4">Conversations Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
          <XAxis
            dataKey="date"
            stroke="#71717a"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#a1a1aa' }}
          />
          <YAxis
            stroke="#71717a"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#a1a1aa' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: '0.5rem',
            }}
            cursor={{ stroke: '#7c3aed' }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={{ fill: '#a78bfa', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
