'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Zap, Filter, MessageCircle, Clock, Tag, Plus, Trash2, Edit, Play, Pause, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface AutomationRule {
  id: string
  name: string
  description: string
  enabled: boolean
  trigger: string
  action: string
  conditions: string[]
  createdAt: string
  executionCount: number
}

export default function AutomationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')
        return
      }

      setUser(session.user)
      
      // Mock rules data
      setRules([
        {
          id: '1',
          name: 'Follow-up After Purchase',
          description: 'Send thank you message and ask for review',
          enabled: true,
          trigger: 'New purchase completed',
          action: 'Send follow-up message',
          conditions: ['Customer is new', 'Order value > $100'],
          createdAt: '2 days ago',
          executionCount: 24,
        },
        {
          id: '2',
          name: 'Abandoned Cart Reminder',
          description: 'Remind customers about items left in cart',
          enabled: true,
          trigger: 'Cart abandoned for 1 hour',
          action: 'Send reminder message',
          conditions: ['Cart value > $50', 'Customer is logged in'],
          createdAt: '1 week ago',
          executionCount: 156,
        },
        {
          id: '3',
          name: 'High-Value Lead Alert',
          description: 'Notify sales team about high-potential leads',
          enabled: false,
          trigger: 'Lead expresses interest in enterprise plan',
          action: 'Create task in CRM',
          conditions: ['Lead score > 80', 'Company size > 100'],
          createdAt: '3 days ago',
          executionCount: 0,
        },
        {
          id: '4',
          name: 'Customer Satisfaction Check',
          description: 'Ask for feedback after support interaction',
          enabled: true,
          trigger: 'Support ticket closed',
          action: 'Send satisfaction survey',
          conditions: ['Ticket resolved', 'Customer was active'],
          createdAt: '2 weeks ago',
          executionCount: 89,
        },
      ])

      setLoading(false)
    }

    loadUser()
  }, [supabase, router])

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ))
  }

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId))
  }

  const createNewRule = () => {
    // TODO: Implement rule creation
    setShowCreateForm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-8">
        <div className="text-gray-600">Loading automation rules...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      {/* Back Button */}
      <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Automation Rules</h1>
            <p className="text-gray-600">Create rules to automate agent behavior based on triggers</p>
          </div>
          <button
            onClick={createNewRule}
            className="flex items-center gap-2 px-6 py-3 rounded-lg btn-primary-gradient text-white font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Rule
          </button>
        </div>
      </div>

      <div className="max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-gray-200 bg-white p-5 brand-gradient-border">
            <div className="text-2xl font-bold text-gray-900 mb-1">{rules.length}</div>
            <div className="text-sm text-gray-600">Total Rules</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 brand-gradient-border">
            <div className="text-2xl font-bold text-gray-900 mb-1">{rules.filter(r => r.enabled).length}</div>
            <div className="text-sm text-gray-600">Active Rules</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 brand-gradient-border">
            <div className="text-2xl font-bold text-gray-900 mb-1">{rules.reduce((sum, rule) => sum + rule.executionCount, 0)}</div>
            <div className="text-sm text-gray-600">Total Executions</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 brand-gradient-border">
            <div className="text-2xl font-bold text-gray-900 mb-1">24h</div>
            <div className="text-sm text-gray-600">Response Time</div>
          </div>
        </div>

        {/* Rule Builder Demo */}
        <div className="mb-10 rounded-xl border border-gray-200 bg-white p-6 brand-gradient-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-gray-800" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Visual Rule Builder</h2>
              <p className="text-gray-600 text-sm">Drag and drop to create automation workflows</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Trigger Section */}
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-pink-100 flex items-center justify-center">
                  <Filter className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">When</h3>
                  <p className="text-sm text-gray-600">Trigger event</p>
                </div>
              </div>
              <div className="space-y-2">
                {['New message received', 'Purchase completed', 'Lead created', 'Support ticket closed'].map((trigger, idx) => (
                  <div key={idx} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-700">
                    {trigger}
                  </div>
                ))}
              </div>
            </div>

            {/* Condition Section */}
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">If</h3>
                  <p className="text-sm text-gray-600">Conditions</p>
                </div>
              </div>
              <div className="space-y-2">
                {['Customer is new', 'Order value > $100', 'Lead score > 50', 'Time is business hours'].map((condition, idx) => (
                  <div key={idx} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-700">
                    {condition}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Section */}
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Then</h3>
                  <p className="text-sm text-gray-600">Take action</p>
                </div>
              </div>
              <div className="space-y-2">
                {['Send message', 'Create task', 'Assign to agent', 'Update CRM'].map((action, idx) => (
                  <div key={idx} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-700">
                    {action}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 border border-gray-300 text-gray-800 font-medium hover:from-pink-100 hover:to-purple-100 transition-all">
              Test Rule
            </button>
          </div>
        </div>

        {/* Rules List */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Active Rules</h2>
          
          {rules.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center brand-gradient-border">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 mb-4">
                <Zap className="w-8 h-8 text-gray-800" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No automation rules yet</h3>
              <p className="text-gray-600 max-w-sm mx-auto mb-6">
                Create your first rule to automate repetitive tasks and save time
              </p>
              <button
                onClick={createNewRule}
                className="px-6 py-3 rounded-lg btn-primary-gradient text-white font-medium hover:shadow-lg transition-all"
              >
                Create Your First Rule
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="rounded-xl border border-gray-200 bg-white p-6 brand-gradient-border">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleRule(rule.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${rule.enabled ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rule.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-gray-900">{rule.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${rule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {rule.enabled ? 'Active' : 'Paused'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{rule.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => deleteRule(rule.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Rule Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Trigger</h4>
                      <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex items-center gap-2">
                          <Filter className="w-3 h-3 text-gray-500" />
                          <span className="text-sm text-gray-700">{rule.trigger}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Action</h4>
                      <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-3 h-3 text-gray-500" />
                          <span className="text-sm text-gray-700">{rule.action}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Conditions</h4>
                      <div className="space-y-1">
                        {rule.conditions.map((condition, idx) => (
                          <div key={idx} className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <Tag className="w-3 h-3 text-gray-500" />
                              <span className="text-sm text-gray-700">{condition}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rule Footer */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Created {rule.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        <span>{rule.executionCount} executions</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium transition-all">
                      View Execution Log
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Templates */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Rule Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Welcome Series', desc: '3-part welcome sequence for new customers' },
              { name: 'Cart Recovery', desc: 'Recover abandoned carts with timed reminders' },
              { name: 'Customer Win-back', desc: 'Re-engage inactive customers with offers' },
              { name: 'Feedback Collection', desc: 'Automatically request reviews and feedback' },
            ].map((template, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-all">
                <h3 className="font-bold text-gray-900 mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{template.desc}</p>
                <button className="flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700 font-medium">
                  Use Template <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}