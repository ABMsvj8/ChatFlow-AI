'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface AgentConfig {
  id: string
  business_id: string
  name: string
  system_prompt: string
  ai_model: string
  temperature: number
  max_tokens: number
}

interface FormData {
  name: string
  goal: string
  tone: string
  custom_instructions: string
  knowledge_base: string
}

export default function AgentEditorPage() {
  const router = useRouter()
  const params = useParams()
  const agentId = params.agent_id as string
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [agent, setAgent] = useState<AgentConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    goal: 'Close Sales',
    tone: 'Professional',
    custom_instructions: '',
    knowledge_base: '',
  })
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 6

  const supabase = createClient()

  // Step navigation
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Check auth and load agent
  useEffect(() => {
    const loadAgent = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/')
          return
        }

        setUser({ id: session.user?.id || '' })

        // Get user's business
        const { data: business } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', session.user?.id)
          .limit(1)
          .single()

        if (!business) {
          router.push('/onboarding')
          return
        }

        const bid = (business as any).id
        setBusinessId(bid)

        // Get agent
        const { data: agentData, error: agentError } = await supabase
          .from('agents')
          .select('*')
          .eq('id', agentId)
          .eq('business_id', bid)
          .single()

        if (agentError || !agentData) {
          setError('Agent not found')
          return
        }

        const agentConfig = agentData as unknown as AgentConfig
        setAgent(agentConfig)

        // Parse personality_config if it exists
        const personalityConfig = (agentData as any).personality_config || {}

        setFormData({
          name: agentConfig.name || '',
          goal: personalityConfig.goal || 'Close Sales',
          tone: personalityConfig.tone || 'Professional',
          custom_instructions: personalityConfig.custom_instructions || '',
          knowledge_base: personalityConfig.knowledge_base || '',
        })

        setLoading(false)
      } catch (err) {
        setError('Failed to load agent')
        setLoading(false)
      }
    }

    loadAgent()
  }, [agentId, supabase, router])

  const handleSave = async () => {
    if (!agent || !businessId) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const personalityConfig = JSON.stringify({
        goal: formData.goal,
        tone: formData.tone,
        custom_instructions: formData.custom_instructions,
        knowledge_base: formData.knowledge_base,
      })

      const { error: updateError } = await (supabase as any)
        .from('agents')
        .update({
          name: formData.name,
          personality_config: personalityConfig,
        } as any)
        .eq('id', agent.id)
        .eq('business_id', businessId)
        .eq('id', agent.id)
        .eq('business_id', businessId)

      if (updateError) {
        setError('Failed to save agent')
        setSaving(false)
        return
      }

      setSuccess('Agent saved successfully!')
      setSaving(false)

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/agents')
      }, 2000)
    } catch (err) {
      setError('Failed to save agent')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-8">
        <div className="text-gray-600">Loading agent...</div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-8">
        <div className="text-red-600">Agent not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      {/* Back Button */}
      <Link href="/dashboard/agents" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Agents
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Edit Agent</h1>
        <p className="text-gray-600">{agent.name}</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-800 font-medium">Success</p>
            <p className="text-green-700 text-sm mt-1">{success}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="max-w-2xl space-y-6">
        {/* Agent Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Agent Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
            placeholder="e.g., Sales Assistant"
            disabled={saving}
          />
        </div>

        {/* Goal */}
        <div>
          <label className="block text-sm font-medium mb-3">Agent Goal</label>
          <div className="space-y-2">
            {['Close Sales', 'Answer Questions', 'Book Appointments', 'Qualify Leads'].map((g) => (
              <label key={g} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="goal"
                  value={g}
                  checked={formData.goal === g}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  disabled={saving}
                  className="w-4 h-4"
                />
                <span className="text-sm">{g}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-medium mb-3">Personality/Tone</label>
          <div className="space-y-2">
            {['Professional', 'Balanced', 'Casual', 'Friendly'].map((t) => (
              <label key={t} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="tone"
                  value={t}
                  checked={formData.tone === t}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  disabled={saving}
                  className="w-4 h-4"
                />
                <span className="text-sm">{t}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Instructions */}
        <div>
          <label className="block text-sm font-medium mb-2">Custom Instructions</label>
          <textarea
            value={formData.custom_instructions}
            onChange={(e) => setFormData({ ...formData, custom_instructions: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
            placeholder="e.g., Always ask for phone number before ending conversation"
            rows={6}
            disabled={saving}
          />
          <p className="text-xs text-gray-500 mt-2">
            Add specific instructions to guide the agent's behavior
          </p>
        </div>

        {/* Knowledge Base */}
        <div>
          <label className="block text-sm font-medium mb-2">Knowledge Base (Optional)</label>
          <textarea
            value={formData.knowledge_base}
            onChange={(e) => setFormData({ ...formData, knowledge_base: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
            placeholder="e.g., Our prices: Basic $99/mo, Pro $299/mo. Hours: 9am-5pm EST."
            rows={6}
            disabled={saving}
          />
          <p className="text-xs text-gray-500 mt-2">
            Paste company info, FAQs, pricing, or other context the agent should know
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-6 py-3 rounded-lg btn-primary-gradient hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-500 font-medium transition-all"
          >
            {saving ? 'Saving...' : 'Save Agent'}
          </button>
          <Link
            href="/dashboard/agents"
            className="flex-1 px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-center transition-all border border-gray-300"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
}
