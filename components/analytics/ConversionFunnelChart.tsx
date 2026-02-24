'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ConversionFunnelData {
  started: number
  responded: number
  closed: number
}

interface ConversionFunnelChartProps {
  data: ConversionFunnelData
}

export default function ConversionFunnelChart({ data }: ConversionFunnelChartProps) {
  const chartData = [
    { name: 'Started', value: data.started },
    { name: 'Responded', value: data.responded },
    { name: 'Closed', value: data.closed },
  ]

  return (
    <div className="p-6 rounded-lg border border-zinc-800/50 bg-zinc-900/30">
      <h3 className="text-lg font-semibold text-white mb-4">Conversion Funnel</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
          <XAxis
            dataKey="name"
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
          />
          <Bar dataKey="value" fill="#a78bfa" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
