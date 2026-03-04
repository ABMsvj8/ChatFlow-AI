'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Zap, Users, ShoppingBag, Calendar, MessageCircle, Star, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface AgentTemplate {
  id: string
  name: string
  description: string
  icon: any
  category: string
  useCase: string
  popularity: number
  estimatedSetup: string
  features: string[]
}

export default function TemplatesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const supabase = createClient()

  const categories = [
    { id: 'all', name: 'All Templates', count: 12 },
    { id: 'sales', name: 'Sales', count: 4 },
    { id: 'support', name: 'Customer Support', count: 3 },
    { id: 'booking', name: 'Appointment Booking', count: 2 },
    { id: 'lead-gen', name: 'Lead Generation', count: 3 },
  ]

  const templates: AgentTemplate[] = [
    {
      id: 'sales-closer',
      name: 'Sales Closer',
      description: 'AI agent specialized in converting leads into paying customers',
      icon: ShoppingBag,
      category: 'sales',
      useCase: 'E-commerce, SaaS, Consulting',
      popularity: 95,
      estimatedSetup: '5 minutes',
      features: ['Lead qualification', 'Price negotiation', 'Objection handling', 'Closing techniques'],
    },
    {
      id: 'customer-support',
      name: '24/7 Support Agent',
      description: 'Handle customer inquiries and resolve issues automatically',
      icon: Users,
      category: 'support',
      useCase: 'Customer service, FAQs, Technical support',
      popularity: 88,
      estimatedSetup: '10 minutes',
      features: ['FAQ answering', 'Ticket creation', 'Escalation rules', 'Satisfaction tracking'],
    },
    {
      id: 'appointment-setter',
      name: 'Appointment Setter',
      description: 'Schedule meetings and manage calendars automatically',
      icon: Calendar,
      category: 'booking',
      useCase: 'Consultants, Agencies, Service businesses',
      popularity: 76,
      estimatedSetup: '8 minutes',
      features: ['Calendar integration', 'Time zone detection', 'Reminder system', 'Rescheduling'],
    },
    {
      id: 'lead-qualifier',
      name: 'Lead Qualifier',
      description: 'Qualify incoming leads and route them to the right team',
      icon: MessageCircle,
      category: 'lead-gen',
      useCase: 'B2B companies, Marketing agencies',
      popularity: 82,
      estimatedSetup: '7 minutes',
      features: ['Lead scoring', 'Data collection', 'Follow-up scheduling', 'CRM integration'],
    },
    {
      id: 'ecommerce-assistant',
      name: 'E-commerce Assistant',
      description: 'Handle product inquiries, order status, and returns',
      icon: ShoppingBag,
      category: 'sales',
      useCase: 'Online stores, Retail brands',
      popularity: 91,
      estimatedSetup: '12 minutes',
      features: ['Product recommendations', 'Order tracking', 'Return processing', 'Upselling'],
    },
    {
      id: 'faq-bot',
      name: 'FAQ Bot',
      description: 'Answer common questions instantly with your knowledge base',
      icon: MessageCircle,
      category: 'support',
      useCase: 'Documentation, Onboarding, Product education',
      popularity: 79,
      estimatedSetup: '6 minutes',
      features: ['Knowledge base integration', 'Contextual answers', 'Feedback collection', 'Learning system'],
    },
  ]

  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')
        return
      }

      setUser(session.user)
      setLoading(false)
    }

    loadUser()
  }, [supabase, router])

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory)

  const handleUseTemplate = (templateId: string) => {
    // TODO: Create agent from template
    router.push(`/dashboard/agents/new?template=${templateId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-8">
        <div className="text-gray-600">Loading templates...</div>
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
        <h1 className="text-3xl font-bold mb-1">Agent Templates</h1>
        <p className="text-gray-600">Get started quickly with pre-built AI agent templates</p>
      </div>

      <div className="max-w-6xl">
        {/* Hero Section */}
        <div className="mb-10 rounded-xl border border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50 p-8 brand-gradient-border">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center">
                  <Zap className="w-6 h-6 text-gray-800" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Jumpstart Your AI Agent</h2>
                  <p className="text-gray-600">Select a template to deploy in minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Quick setup</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>Proven use cases</span>
                </div>
              </div>
            </div>
            <button className="px-6 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 font-medium hover:bg-gray-50 transition-all">
              Custom Agent
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category.id
                  ? 'btn-primary-gradient text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const Icon = template.icon
              return (
                <div key={template.id} className="rounded-xl border border-gray-200 bg-white p-6 brand-gradient-border hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-gray-800" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{template.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{template.useCase}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span>{template.popularity}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-5">{template.description}</p>

                  <div className="mb-5">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features</h4>
                    <ul className="space-y-1">
                      {template.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {template.estimatedSetup} setup
                      </span>
                    </div>
                    <button
                      onClick={() => handleUseTemplate(template.id)}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 text-gray-800 text-sm font-medium hover:from-pink-100 hover:to-purple-100 transition-all"
                    >
                      Use Template
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Custom Agent CTA */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 brand-gradient-border">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 mb-4">
              <Zap className="w-8 h-8 text-gray-800" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Don't see what you need?</h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-6">
              Create a custom AI agent from scratch with our intuitive builder
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/agents/new"
                className="px-6 py-3 rounded-lg btn-primary-gradient text-white font-medium hover:shadow-lg transition-all"
              >
                Create Custom Agent
              </Link>
              <Link
                href="/help"
                className="px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-all border border-gray-300"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}