// Mock analytics data provider
// In the future, this will be replaced with real Supabase queries

interface StatData {
  totalConversations: number
  totalConversions: number
  closingRate: number
  avgResponseTime: number
}

interface SparklinePoint {
  date: string
  count: number
}

interface ConversationPoint {
  date: string
  count: number
}

interface ConversionFunnelData {
  started: number
  responded: number
  closed: number
}

interface ResponseTimeBucket {
  range: string
  frequency: number
}

interface AgentPerformance {
  id: string
  name: string
  conversations: number
  conversionRate: number
}

interface AnalyticsData {
  stats: StatData
  sparklineData: SparklinePoint[]
  conversationsOverTime: ConversationPoint[]
  conversionFunnel: ConversionFunnelData
  responseTimeDistribution: ResponseTimeBucket[]
  agentPerformance: AgentPerformance[]
}

// Generate mock data with realistic variations
function generateMockData(): AnalyticsData {
  const now = new Date()
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - (6 - i))
    return date
  })

  const sparklineData = last7Days.map((date) => ({
    date: date.toISOString().split('T')[0],
    count: Math.floor(Math.random() * 15) + 8,
  }))

  const conversationsOverTime = last7Days.map((date) => ({
    date: date.toISOString().split('T')[0],
    count: Math.floor(Math.random() * 25) + 15,
  }))

  const totalConversations = conversationsOverTime.reduce((sum, d) => sum + d.count, 0)
  const totalConversions = Math.floor(totalConversations * 0.35)
  const closingRate = (totalConversions / totalConversations) * 100

  const avgResponseTime = Math.floor(Math.random() * 20) + 5

  const responseTimeDistribution: ResponseTimeBucket[] = [
    { range: '0-5s', frequency: Math.floor(Math.random() * 40) + 30 },
    { range: '5-10s', frequency: Math.floor(Math.random() * 35) + 20 },
    { range: '10-30s', frequency: Math.floor(Math.random() * 30) + 15 },
    { range: '30-60s', frequency: Math.floor(Math.random() * 20) + 10 },
    { range: '60+s', frequency: Math.floor(Math.random() * 15) + 5 },
  ]

  const agentPerformance: AgentPerformance[] = [
    {
      id: '1',
      name: 'Agent Alpha',
      conversations: Math.floor(Math.random() * 50) + 30,
      conversionRate: Math.floor(Math.random() * 40) + 25,
    },
    {
      id: '2',
      name: 'Agent Beta',
      conversations: Math.floor(Math.random() * 45) + 25,
      conversionRate: Math.floor(Math.random() * 38) + 28,
    },
    {
      id: '3',
      name: 'Agent Gamma',
      conversations: Math.floor(Math.random() * 40) + 20,
      conversionRate: Math.floor(Math.random() * 35) + 22,
    },
  ]

  return {
    stats: {
      totalConversations,
      totalConversions,
      closingRate: Math.round(closingRate * 10) / 10,
      avgResponseTime,
    },
    sparklineData,
    conversationsOverTime,
    conversionFunnel: {
      started: totalConversations,
      responded: Math.floor(totalConversations * 0.8),
      closed: totalConversions,
    },
    responseTimeDistribution,
    agentPerformance,
  }
}

export function useAnalyticsData(): AnalyticsData {
  return generateMockData()
}
