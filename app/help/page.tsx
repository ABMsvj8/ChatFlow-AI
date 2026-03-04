'use client'

import { useState } from 'react'
import { ArrowLeft, Search, Book, MessageCircle, Video, FileText, ChevronRight, HelpCircle } from 'lucide-react'
import Link from 'next/link'

interface FAQ {
  id: string
  question: string
  answer: string
}

interface Article {
  id: string
  title: string
  description: string
  icon: any
  category: string
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  
  const categories = [
    { id: 'getting-started', name: 'Getting Started', count: 5 },
    { id: 'agents', name: 'AI Agents', count: 8 },
    { id: 'integrations', name: 'Integrations', count: 6 },
    { id: 'billing', name: 'Billing & Pricing', count: 4 },
    { id: 'troubleshooting', name: 'Troubleshooting', count: 7 },
  ]

  const articles: Article[] = [
    {
      id: 'create-first-agent',
      title: 'Creating Your First AI Agent',
      description: 'Step-by-step guide to set up your first conversational AI agent',
      icon: MessageCircle,
      category: 'getting-started',
    },
    {
      id: 'connect-instagram',
      title: 'Connecting Instagram',
      description: 'How to connect your Instagram Business account and enable DMs',
      icon: Book,
      category: 'integrations',
    },
    {
      id: 'agent-personality',
      title: 'Customizing Agent Personality',
      description: 'Guide to setting tone, goals, and custom instructions',
      icon: MessageCircle,
      category: 'agents',
    },
    {
      id: 'pricing-plans',
      title: 'Understanding Pricing Plans',
      description: 'Overview of different plans and usage-based pricing',
      icon: FileText,
      category: 'billing',
    },
    {
      id: 'common-issues',
      title: 'Common Issues & Solutions',
      description: 'Troubleshooting guide for frequent problems',
      icon: HelpCircle,
      category: 'troubleshooting',
    },
    {
      id: 'webhook-setup',
      title: 'Webhook Setup Guide',
      description: 'How to set up webhooks for custom integrations',
      icon: Book,
      category: 'integrations',
    },
  ]

  const faqs: FAQ[] = [
    {
      id: 'faq-1',
      question: 'How long does it take to set up an agent?',
      answer: 'You can create a basic agent in under 5 minutes. Advanced configuration with custom prompts and knowledge base may take 15-20 minutes.',
    },
    {
      id: 'faq-2',
      question: 'What platforms do you support?',
      answer: 'Currently Instagram, Facebook Messenger, WhatsApp Business, and TikTok. More platforms coming soon.',
    },
    {
      id: 'faq-3',
      question: 'Is there a free trial?',
      answer: 'Yes! All plans start with a 14-day free trial. No credit card required.',
    },
    {
      id: 'faq-4',
      question: 'How are conversations billed?',
      answer: 'You pay per conversation (back-and-forth exchange with a customer). See pricing page for detailed breakdown.',
    },
    {
      id: 'faq-5',
      question: 'Can I use my own AI models?',
      answer: 'Currently we use OpenAI GPT-4 with our fine-tuned models. Custom model support is on our roadmap.',
    },
  ]

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      {/* Back Button */}
      <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Help & Documentation</h1>
        <p className="text-gray-600">Find guides, tutorials, and answers to common questions</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mb-10">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help articles, guides, or FAQs..."
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>
      </div>

      <div className="max-w-6xl">
        {/* Quick Start Guide */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 brand-gradient-border hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-gray-900">1</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Create an Agent</h3>
              <p className="text-gray-600 text-sm">Set up your first AI agent with goals and personality</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 brand-gradient-border hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-gray-900">2</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Connect Platforms</h3>
              <p className="text-gray-600 text-sm">Link your social media accounts for automatic messaging</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 brand-gradient-border hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-gray-900">3</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Monitor & Optimize</h3>
              <p className="text-gray-600 text-sm">Track performance and refine your agent's behavior</p>
            </div>
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Popular Articles</h2>
            <Link href="#" className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.slice(0, 4).map((article) => {
              const Icon = article.icon
              return (
                <Link
                  key={article.id}
                  href="#"
                  className="rounded-xl border border-gray-200 bg-white p-5 brand-gradient-border hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-gray-800" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{article.description}</p>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {article.category}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href="#"
                className="rounded-lg border border-gray-200 bg-white p-4 text-center hover:shadow-md transition-all"
              >
                <div className="font-bold text-gray-900 mb-1">{category.name}</div>
                <div className="text-sm text-gray-500">{category.count} articles</div>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="rounded-xl border border-gray-200 bg-white p-5 brand-gradient-border">
                <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-white mb-4">
            <MessageCircle className="w-8 h-8 text-gray-800" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Still need help?</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Our support team is here to help you get the most out of ChatFlow AI
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 font-medium hover:bg-gray-50 transition-all">
              Contact Support
            </button>
            <button className="px-6 py-3 rounded-lg btn-primary-gradient text-white font-medium hover:shadow-lg transition-all">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}