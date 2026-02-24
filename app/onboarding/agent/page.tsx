'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

type Message = {
  role: 'genie' | 'user'
  content: string
}

type AgentConfig = {
  businessDescription: string
  goal: string
  tone: string
  customInstructions: string
  name: string
}

const GOAL_OPTIONS = [
  { label: '💰 Close Sales', value: 'sell' },
  { label: '💬 Answer Questions', value: 'support' },
  { label: '📅 Book Appointments', value: 'book' },
  { label: '🎯 Qualify Leads', value: 'qualify' },
]

const TONE_OPTIONS = [
  { label: 'Professional', value: 'professional' },
  { label: 'Balanced', value: 'balanced' },
  { label: 'Casual', value: 'casual' },
  { label: 'Friendly', value: 'friendly' },
]

export default function AgentGeniePage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [step, setStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [isLaunching, setIsLaunching] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [config, setConfig] = useState<AgentConfig>({
    businessDescription: '',
    goal: '',
    tone: '',
    customInstructions: '',
    name: '',
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const addGenieMessage = (content: string, delay = 800) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { role: 'genie', content }])
    }, delay)
  }

  useEffect(() => {
    setTimeout(() => {
      setMessages([{ role: 'genie', content: "Hey! I'm your Agent Genie 🧞 I'll set up your AI agent in just a few questions. First — what does your business do? Give me a quick description." }])
      setStep(1)
    }, 500)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleTextSubmit = () => {
    if (!input.trim()) return
    const userInput = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userInput }])

    if (step === 1) {
      setConfig(prev => ({ ...prev, businessDescription: userInput }))
      addGenieMessage("Love it! What's the main thing you want your agent to do?")
      setStep(2)
    } else if (step === 4) {
      setConfig(prev => ({ ...prev, customInstructions: userInput }))
      addGenieMessage("Perfect! What should we call your agent?")
      setStep(5)
    } else if (step === 5) {
      setConfig(prev => ({ ...prev, name: userInput }))
      handleLaunch({ ...config, name: userInput })
    }
  }

  const handleGoalSelect = (goal: string, label: string) => {
    setConfig(prev => ({ ...prev, goal }))
    setMessages(prev => [...prev, { role: 'user', content: label }])
    addGenieMessage("What tone should your agent use with customers?")
    setStep(3)
  }

  const handleToneSelect = (tone: string, label: string) => {
    setConfig(prev => ({ ...prev, tone }))
    setMessages(prev => [...prev, { role: 'user', content: label }])
    addGenieMessage("Any specific instructions? e.g. 'Always ask for their phone number' or 'Never offer discounts without approval'. Type skip to continue.")
    setStep(4)
  }

  const handleSkip = () => {
    setMessages(prev => [...prev, { role: 'user', content: 'Skip' }])
    addGenieMessage("Perfect! What should we call your agent?")
    setStep(5)
  }

  const handleLaunch = async (finalConfig: AgentConfig) => {
    setIsLaunching(true)
    addGenieMessage("🚀 Building your agent...", 200)

    try {
      const res = await fetch('/api/agents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalConfig),
      })
      if (res.ok) {
        setTimeout(() => {
          setIsLaunching(false)
          setIsComplete(true)
          addGenieMessage(`✅ Done! Your agent "${finalConfig.name}" is live and ready to handle conversations. Taking you to your dashboard...`, 500)
          setTimeout(() => router.push('/dashboard'), 3000)
        }, 2000)
      } else {
        setIsLaunching(false)
        addGenieMessage("Hmm, something went wrong saving the agent. Let's try again.")
      }
    } catch {
      setIsLaunching(false)
      addGenieMessage("Connection error. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl flex flex-col h-[85vh]">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">✨ Agent Genie</h1>
          <p className="text-zinc-400 text-sm mt-1">Your AI agent setup wizard</p>
          {step > 0 && !isComplete && (
            <div className="flex justify-center gap-1 mt-3">
              {[1,2,3,4,5].map(s => (
                <div key={s} className={`h-1 w-8 rounded-full transition-all ${step >= s ? 'bg-purple-600' : 'bg-zinc-800'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 px-2 pb-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                  msg.role === 'genie'
                    ? 'bg-purple-600/20 border border-purple-600/30 text-white'
                    : 'bg-zinc-800 text-white'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-purple-600/20 border border-purple-600/30 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <motion.div key={i} className="w-2 h-2 bg-purple-400 rounded-full"
                      animate={{ y: [0,-4,0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Goal options */}
          {step === 2 && !isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-2">
              {GOAL_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => handleGoalSelect(opt.value, opt.label)}
                  className="p-3 bg-zinc-900 border border-zinc-700 hover:border-purple-600 hover:bg-purple-600/10 rounded-xl text-white text-sm transition-all">
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Tone options */}
          {step === 3 && !isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-2">
              {TONE_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => handleToneSelect(opt.value, opt.label)}
                  className="p-3 bg-zinc-900 border border-zinc-700 hover:border-purple-600 hover:bg-purple-600/10 rounded-xl text-white text-sm transition-all">
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {(step === 1 || step === 4 || step === 5) && !isLaunching && !isComplete && (
          <div className="flex gap-2 pt-2">
            {step === 4 && (
              <button onClick={handleSkip}
                className="px-4 py-3 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-400 text-sm rounded-xl transition-all">
                Skip
              </button>
            )}
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTextSubmit()}
              placeholder={step === 5 ? "Agent name..." : "Type your answer..."}
              className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-purple-600 text-white px-4 py-3 rounded-xl outline-none text-sm transition-all"
              autoFocus
            />
            <button onClick={handleTextSubmit}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-all">
              {step === 5 ? '🚀 Launch' : 'Send'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
