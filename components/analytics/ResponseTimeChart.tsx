'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ResponseTimeBucket {
  range: string
  frequency: number
}

interface ResponseTimeChartProps {
  data: ResponseTimeBucket[]
}

export default function ResponseTimeChart({ data }: ResponseTimeChartProps) {
  return (
    <div className="p-6 rounded-lg border border-zinc-800/50 bg-zinc-900/30">
      <h3 className="text-lg font-semibold text-white mb-4">Response Time Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
          <XAxis
            dataKey="range"
            stroke="#71717a"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#a1a1aa' }}
          />
          <YAxis
            stroke="#71717a"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#a1a1aa' }}
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: '0.5rem',
            }}
          />
          <Bar dataKey="frequency" fill="#ec4899" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
