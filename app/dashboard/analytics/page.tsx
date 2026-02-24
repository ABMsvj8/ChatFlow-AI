'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAnalyticsData } from '@/hooks/useAnalyticsData'
import StatCard from '@/components/analytics/StatCard'
import ConversationsOverTimeChart from '@/components/analytics/ConversationsOverTimeChart'
import ConversionFunnelChart from '@/components/analytics/ConversionFunnelChart'
import ResponseTimeChart from '@/components/analytics/ResponseTimeChart'
import AgentPerformanceSection from '@/components/analytics/AgentPerformanceSection'
import { TrendingUp, Users, Target, Zap } from 'lucide-react'

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const data = useAnalyticsData()

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/')
        return
      }

      setUser({ id: session.user?.id || '' })
      setLoading(false)
    }

    checkSession()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-zinc-400">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Analytics</h1>
        <p className="text-zinc-400">Performance insights and metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Conversations"
          value={data.stats.totalConversations}
          icon={<Users className="w-6 h-6" />}
          sparklineData={data.sparklineData}
          trend={Math.floor(Math.random() * 20) - 5}
        />
        <StatCard
          label="Total Conversions"
          value={data.stats.totalConversions}
          icon={<Target className="w-6 h-6" />}
          sparklineData={data.sparklineData}
          trend={Math.floor(Math.random() * 25) - 3}
        />
        <StatCard
          label="Closing Rate"
          value={data.stats.closingRate}
          unit="%"
          icon={<TrendingUp className="w-6 h-6" />}
          sparklineData={data.sparklineData}
          trend={Math.floor(Math.random() * 15) - 2}
        />
        <StatCard
          label="Avg Response Time"
          value={data.stats.avgResponseTime}
          unit="s"
          icon={<Zap className="w-6 h-6" />}
          sparklineData={data.sparklineData}
          trend={Math.floor(Math.random() * 10) - 5}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <ConversationsOverTimeChart data={data.conversationsOverTime} />
        <ResponseTimeChart data={data.responseTimeDistribution} />
      </div>

      {/* Conversion Funnel */}
      <div className="mb-8">
        <ConversionFunnelChart data={data.conversionFunnel} />
      </div>

      {/* Agent Performance */}
      <AgentPerformanceSection agents={data.agentPerformance} />
    </div>
  )
}
