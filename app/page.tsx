'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, MessageSquare, Zap, Globe, Brain, BarChart3, RefreshCw, Smartphone, Slack, Instagram, Facebook, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.1,
    },
  },
} as const

const slideInVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: 0.1,
    },
  },
} as const

const slideInRightVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: 0.1,
    },
  },
} as const

// Navbar Component
function Navbar() {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          className="text-2xl font-bold tracking-tight text-gray-900"
          whileHover={{ scale: 1.05 }}
        >
          <span className="bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            ChatFlow AI
          </span>
        </motion.div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
            Features
          </Link>
          <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
            Pricing
          </Link>
          <Link href="#compare" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
            Compare
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/signin"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg transition-colors hover:border-gray-400"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signin"
            className="px-4 py-2 text-sm font-medium text-white btn-primary-gradient rounded-lg transition-all hover:shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}

// Hero Section
function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-b from-[#FAFAF9] via-white to-white">
      {/* Animated brand gradient glow */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(236, 72, 153, 0.15), rgba(96, 165, 250, 0.1), rgba(168, 85, 247, 0.15), transparent 50%)`,
            backgroundPosition: `${mousePosition.x * 40}px ${mousePosition.y * 40}px`,
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-300 bg-gradient-to-r from-pink-50 to-purple-50 backdrop-blur-sm shadow-sm"
          >
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse" />
            <span className="text-xs font-medium text-gray-700">AI-Powered Sales Team</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-gray-900"
          >
            Your AI-Powered Sales Team.{' '}
            <span className="block bg-gradient-to-r from-pink-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Available 24/7.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            ChatFlow AI replaces rigid, script-based chatbots with intelligent agents that understand your customers, close deals, and never miss a message.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg btn-primary-gradient font-bold text-base transition-all hover:shadow-lg"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-gray-300 bg-white text-gray-800 font-bold text-base transition-all hover:border-gray-400 hover:shadow-md"
              >
                See How It Works
              </Link>
            </motion.div>
          </motion.div>

          {/* Animated Stats Bar */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 pt-12 border-t border-gray-200"
          >
            {[
              { label: '10x faster response times', value: '10x' },
              { label: '24/7 availability', value: '24/7' },
              { label: '85%+ margin at scale', value: '85%+' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-500 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Problem Section
function ProblemSection() {
  return (
    <section id="compare" className="relative py-24 px-6 bg-[#FAFAF9]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            ManyChat is Breaking Your Business
          </h2>
          <p className="text-lg text-gray-600">
            Here's what you're actually dealing with vs. what you could have
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* ManyChat (Bad) */}
          <motion.div
            variants={slideInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-8 rounded-xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow brand-gradient-border"
          >
            <h3 className="text-2xl font-bold text-red-600 mb-6">ManyChat ❌</h3>
            <ul className="space-y-4">
              {[
                'Script-based: breaks when conversations go off-script',
                'Robotic responses that feel fake',
                'No memory between conversations',
                'Complex flowcharts to maintain',
                'Customers hit dead ends constantly',
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="flex gap-3 text-gray-700"
                >
                  <span className="text-red-500 font-bold text-lg">✕</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* ChatFlow AI (Good) */}
          <motion.div
            variants={slideInRightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-8 rounded-xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow brand-gradient-border"
          >
            <h3 className="text-2xl font-bold text-emerald-600 mb-6">ChatFlow AI ✓</h3>
            <ul className="space-y-4">
              {[
                'AI understands intent naturally',
                'Human-like conversations that convert',
                'Full context across every session',
                'One setup, learns and improves',
                'Handles anything a customer throws at it',
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="flex gap-3 text-gray-700"
                >
                  <span className="text-emerald-500 font-bold text-lg">✓</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Phone Mockup Section with Animated Conversations
function PhoneMockupSection() {
  const manychatMessages = [
    { role: 'customer', text: 'Hey! Do you guys offer custom packages for small businesses?' },
    { role: 'bot', text: 'Thanks for your message! 😊 Click here to learn more: bit.ly/packages123' },
    { role: 'customer', text: 'Oh... ok' },
  ]

  const chatflowMessages = [
    { role: 'customer', text: 'Hey! Do you guys offer custom packages for small businesses?' },
    { role: 'bot', text: 'Hey! Yes we do — we work with small businesses all the time. What kind of services are you looking for? I can put together something that fits your budget.' },
    { role: 'customer', text: 'We need social media management, maybe 10 hours a month' },
    { role: 'bot', text: 'Perfect. For 10 hours/month we typically do $500-800 depending on platforms. Want me to send over a quick proposal so you can see exactly what\'s included?' },
    { role: 'customer', text: 'Yes please!' },
    { role: 'bot', text: 'Done! Check your email — and if you have questions I\'m here. 😊' },
  ]

  return (
    <section className="relative py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            See the Difference in Real Conversations
          </h2>
          <p className="text-lg text-gray-600">
            Same customer. Same question. Completely different outcome.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-center">
          {/* Left Phone - ManyChat */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-700 font-semibold">
                <span className="font-bold">❌</span>
                <span>ManyChat</span>
              </span>
            </div>

            {/* Phone Frame */}
            <div className="relative w-72 h-96 bg-white rounded-3xl border-8 border-gray-200 shadow-xl overflow-hidden flex flex-col">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-200 rounded-b-3xl z-10" />

              {/* Screen */}
              <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col justify-start pt-6">
                  <AnimatedChatMessages messages={manychatMessages} isManyChat={true} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Phone - ChatFlow AI */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                <span className="font-bold">✅</span>
                <span>ChatFlow AI</span>
              </span>
            </div>

            {/* Phone Frame */}
            <div className="relative w-72 h-96 bg-white rounded-3xl border-8 border-gray-200 shadow-xl overflow-hidden flex flex-col">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-200 rounded-b-3xl z-10" />

              {/* Screen */}
              <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col justify-start pt-6">
                  <AnimatedChatMessages messages={chatflowMessages} isManyChat={false} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Animated Chat Messages Component
function AnimatedChatMessages({ messages, isManyChat }: { messages: Array<{ role: string; text: string }>; isManyChat: boolean }) {
  const [visibleMessages, setVisibleMessages] = useState<number>(0)

  useEffect(() => {
    const totalMessages = messages.length
    const cycleTime = isManyChat ? 6000 : 12000
    const interval = setInterval(() => {
      setVisibleMessages((prev) => (prev + 1) % (totalMessages + 1))
    }, cycleTime / (totalMessages + 1))

    return () => clearInterval(interval)
  }, [messages.length, isManyChat])

  return (
    <>
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={visibleMessages > i ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`flex ${msg.role === 'customer' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
              msg.role === 'customer'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-none'
                : isManyChat
                  ? 'bg-gray-200 text-gray-800 rounded-bl-none'
                  : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-bl-none'
            }`}
          >
            {msg.text}
          </div>
        </motion.div>
      ))}

      {/* Typing Indicator */}
      {visibleMessages < messages.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-1"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className={`w-2 h-2 rounded-full ${isManyChat ? 'bg-gray-400' : 'bg-emerald-500'}`}
          />
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
            className={`w-2 h-2 rounded-full ${isManyChat ? 'bg-gray-400' : 'bg-emerald-500'}`}
          />
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
            className={`w-2 h-2 rounded-full ${isManyChat ? 'bg-gray-400' : 'bg-emerald-500'}`}
          />
        </motion.div>
      )}
    </>
  )
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: 'Intent-Driven AI',
      description: 'Understands what customers actually mean, not just keywords',
      color: 'purple',
    },
    {
      icon: Zap,
      title: 'Instant Response',
      description: 'Replies in seconds, 24/7, across every platform',
      color: 'blue',
    },
    {
      icon: ArrowRight,
      title: 'Goal-Focused Agents',
      description: 'Sell, support, book appointments, or qualify leads — you choose',
      color: 'cyan',
    },
    {
      icon: MessageSquare,
      title: 'Learns Your Business',
      description: 'Upload docs, add your website, train on your Q&A',
      color: 'emerald',
    },
    {
      icon: RefreshCw,
      title: 'Smart Handoff',
      description: 'AI detects frustration and passes to a human at the right moment',
      color: 'rose',
    },
    {
      icon: BarChart3,
      title: 'Conversation Analytics',
      description: 'See what\'s working, what\'s not, and where customers drop off',
      color: 'amber',
    },
  ]

  return (
    <section id="features" className="relative py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Everything You Need to Convert DMs into Revenue
          </h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, i) => {
            const Icon = feature.icon
            const colorClasses = {
              purple: 'border-gray-200 bg-white hover:bg-gray-50 brand-gradient-border',
              blue: 'border-gray-200 bg-white hover:bg-gray-50 brand-gradient-border',
              cyan: 'border-gray-200 bg-white hover:bg-gray-50 brand-gradient-border',
              emerald: 'border-gray-200 bg-white hover:bg-gray-50 brand-gradient-border',
              rose: 'border-gray-200 bg-white hover:bg-gray-50 brand-gradient-border',
              amber: 'border-gray-200 bg-white hover:bg-gray-50 brand-gradient-border',
            }
            const iconColors = {
              purple: 'text-pink-600',
              blue: 'text-blue-600',
              cyan: 'text-cyan-600',
              emerald: 'text-emerald-600',
              rose: 'text-rose-600',
              amber: 'text-amber-600',
            }

            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="p-8 rounded-xl border border-gray-200 bg-white hover:shadow-xl transition-all hover:-translate-y-1 brand-gradient-border"
                whileHover={{ y: -5 }}
              >
                <div className={`h-14 w-14 rounded-lg flex items-center justify-center mb-6 ${
                  feature.color === 'purple' ? 'brand-glow-purple' :
                  feature.color === 'blue' ? 'brand-glow-blue' :
                  feature.color === 'emerald' ? 'bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-200' :
                  feature.color === 'cyan' ? 'bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-200' :
                  feature.color === 'rose' ? 'bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-200' :
                  'bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200'
                }`}>
                  <Icon className="h-7 w-7 text-gray-800" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// Platforms Section
function PlatformsSection() {
  const platforms = [
    { name: 'Instagram', icon: Instagram },
    { name: 'Facebook', icon: Facebook },
    { name: 'WhatsApp', icon: MessageCircle },
    { name: 'TikTok', icon: Smartphone },
  ]

  return (
    <section className="relative py-24 px-6 bg-[#FAFAF9]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Works Where Your Customers Are
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            One AI agent, all your channels. No separate bots, no separate setups.
          </p>

          <motion.div
            className="flex flex-wrap justify-center gap-8 md:gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {platforms.map((platform, i) => {
              const Icon = platform.icon
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="h-20 w-20 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:shadow-xl transition-all brand-gradient-border">
                    <Icon className="h-10 w-10 text-gray-700" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{platform.name}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Pricing Section
function PricingSection() {
  const plans = [
    {
      name: 'STARTER',
      price: '$49',
      period: '/mo',
      features: [
        '1 AI agent',
        '500 conversations/mo',
        'Instagram + Facebook',
      ],
      highlighted: false,
    },
    {
      name: 'GROWTH',
      price: '$99',
      period: '/mo',
      features: [
        '3 AI agents',
        '2,000 conversations/mo',
        'All platforms',
        'Analytics',
      ],
      highlighted: true,
      badge: 'MOST POPULAR',
    },
    {
      name: 'PRO',
      price: '$299',
      period: '/mo',
      features: [
        'Unlimited agents',
        'Unlimited conversations',
        'Custom AI training',
        'API access',
      ],
      highlighted: false,
    },
  ]

  return (
    <section id="pricing" className="relative py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Simple Pricing. Serious Results.
          </h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className={`relative p-8 rounded-xl border transition-all ${
                plan.highlighted
                  ? 'border-gray-300 bg-white brand-gradient-border shadow-xl'
                  : 'border-gray-200 bg-white hover:shadow-lg'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold">
                    {plan.badge}
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-700">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/auth/signin"
                  className={`block w-full py-3 rounded-lg font-bold text-center transition-colors ${
                    plan.highlighted
                      ? 'btn-primary-gradient hover:shadow-lg'
                      : 'border border-gray-300 text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  Start Free
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mt-12"
        >
          All plans: <span className="text-gray-900 font-semibold">Start free, no credit card required</span>
          <br />
          Usage credits: <span className="text-gray-900 font-semibold">$20 per 1,000 additional conversations</span>
        </motion.p>
      </div>
    </section>
  )
}

// Final CTA Section
function FinalCTASection() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-r from-pink-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900">
            Stop Losing Customers to Slow Responses
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of businesses replacing chatbots with AI teammates
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg btn-primary-gradient font-bold text-base transition-all hover:shadow-lg"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Footer Component
function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">ChatFlow AI</h3>
            <p className="text-sm text-gray-600">Your AI-powered sales team. Available 24/7.</p>
          </div>
          <div />
          <div className="flex justify-end gap-6">
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-500">© 2026 ChatFlow AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Main Page Component
export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      <ProblemSection />
      <PhoneMockupSection />
      <FeaturesSection />
      <PlatformsSection />
      <PricingSection />
      <FinalCTASection />
      <Footer />
    </div>
  )
}
