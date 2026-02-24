'use client'

import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface SparklinePoint {
  date: string
  count: number
}

interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  sparklineData?: SparklinePoint[]
  trend?: number // percentage change, positive or negative
  icon?: React.ReactNode
}

export default function StatCard({
  label,
  value,
  unit = '',
  sparklineData,
  trend,
  icon,
}: StatCardProps) {
  const isTrendPositive = trend !== undefined && trend >= 0

  return (
    <div className="p-6 rounded-lg border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 hover:border-zinc-700/50 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white">{value}</p>
            {unit && <span className="text-zinc-500 text-sm">{unit}</span>}
          </div>
        </div>
        {icon && <div className="text-purple-400">{icon}</div>}
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div className="flex items-center gap-1 mb-4 text-xs">
          {isTrendPositive ? (
            <TrendingUp className="w-3 h-3 text-green-400" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-400" />
          )}
          <span
            className={
              isTrendPositive ? 'text-green-400' : 'text-red-400'
            }
          >
            {isTrendPositive ? '+' : ''}{trend}% from last week
          </span>
        </div>
      )}

      {/* Sparkline */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #3f3f46',
                  borderRadius: '0.5rem',
                }}
                cursor={false}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#a78bfa"
                dot={false}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
