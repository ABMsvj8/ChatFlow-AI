import {
  Brain,
  Layers,
  Target,
  Check,
  ArrowRight,
  Zap,
  MessageSquare,
  BarChart3,
} from 'lucide-react'
import LandingClient from '@/components/LandingClient'
import ConversationWidget from '@/components/ConversationWidget'
import { SignupButton } from '@/components/SignupButton'
import PricingSection from '@/components/PricingSection'

/* ─── Platform SVG Icons ──────────────────────────────────────────────────── */
function InstagramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

function MessengerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z" />
    </svg>
  )
}

/* ─── Old Way Flow Diagram ───────────────────────────────────────────────── */
function OldWayDiagram() {
  return (
    <div className="space-y-2 opacity-60">
      {['User sends message', 'Keyword match?', 'Pre-written reply #1', 'Pre-written reply #2', 'Dead end ☠'].map(
        (label, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="w-full text-center text-xs text-[#71717a] px-4 py-2.5 border border-[#27272a]"
              style={{ background: '#0a0a0a' }}
            >
              {label}
            </div>
            {i < 4 && (
              <div className="w-px h-3 bg-[#27272a]" />
            )}
          </div>
        )
      )}
    </div>
  )
}

/* ─── ChatFlow Way Conversation ──────────────────────────────────────────── */
function ChatFlowWay() {
  const messages = [
    { role: 'user', text: 'Do you have anything under $500?' },
    { role: 'agent', text: 'Based on your history, the Pro plan at $499 fits perfectly. Want me to apply your loyalty discount?' },
    { role: 'user', text: 'yes please' },
    { role: 'agent', text: 'Done — 15% off applied. Booking you for a demo at 2pm Thursday.' },
  ]
  return (
    <div className="space-y-2">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className="text-xs px-3 py-2 max-w-[85%]"
            style={
              msg.role === 'agent'
                ? {
                    background: 'rgba(124,58,237,0.1)',
                    border: '1px solid rgba(124,58,237,0.2)',
                    color: '#e4e4e7',
                  }
                : { background: '#1c1c1e', color: '#a1a1aa' }
            }
          >
            {msg.text}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 mt-3 text-xs text-[#06b6d4]">
        <Zap className="w-3 h-3" />
        <span>Context-aware · Memory active · Deal closed</span>
      </div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function Home() {
  const features = [
    {
      num: '01',
      icon: <Brain className="w-6 h-6 text-[#7c3aed]" />,
      title: 'DM Intent Engine',
      sub: 'Knows what they mean, not just what they type',
      body: "Knows if they're a buyer, a browser, or just curious — and responds accordingly.",
    },
    {
      num: '02',
      icon: <Layers className="w-6 h-6 text-[#7c3aed]" />,
      title: 'Context Memory',
      sub: 'Remembers every conversation. Picks up exactly where you left off.',
      body: "Remembers every DM. Picks up exactly where the conversation left off, every time.",
    },
    {
      num: '03',
      icon: <Target className="w-6 h-6 text-[#7c3aed]" />,
      title: 'Books Like Your Best Setter',
      sub: "Doesn't just respond. Closes, books, converts.",
      body: "Qualifies. Handles objections. Books the call. Closes the sale. Without you lifting a finger.",
    },
  ]

  const metrics = [
    { value: '10,000+', label: 'Businesses Running 24/7' },
    { value: '2M+', label: 'DMs Handled Monthly' },
    { value: '40%', label: 'More Leads Converted' },
    { value: '< 5 min', label: 'setup time' },
  ]

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/mo',
      desc: 'Get started in minutes.',
      featured: false,
      features: [
        'Up to 3 active agents',
        '500 conversations/month',
        'Instagram + Facebook',
        'Community support',
      ],
    },
    {
      name: 'Starter',
      price: '$49',
      period: '/mo',
      desc: 'For growing businesses.',
      featured: false,
      features: [
        'Up to 10 active agents',
        '5,000 conversations/month',
        'All platforms included',
        'Email support',
        'Basic analytics',
      ],
    },
    {
      name: 'Growth',
      price: '$99',
      period: '/mo',
      desc: 'The unfair advantage.',
      featured: true,
      features: [
        'Unlimited active agents',
        '25,000 conversations/month',
        'All platforms + priority routing',
        'Priority email & chat support',
        'Advanced analytics + CRM sync',
        'Custom intent training',
      ],
    },
    {
      name: 'Agency',
      price: '$249',
      period: '/mo',
      desc: 'For teams that scale.',
      featured: false,
      features: [
        'Everything in Growth',
        '100,000 conversations/month',
        'White-label option',
        'Dedicated account manager',
        'API access + webhooks',
        'Custom SLA',
      ],
    },
  ]

  const footerLinks = {
    Product: ['Platform', 'Pricing', 'Changelog', 'Status'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'],
    Connect: ['Twitter / X', 'LinkedIn', 'Discord', 'Contact'],
  }

  return (
    <div className="bg-black text-[#fafafa] min-h-screen overflow-x-hidden">
      {/* Client: NavBar + AuthModals */}
      <LandingClient />

      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center overflow-hidden noise-overlay mesh-bg"
      >
        {/* Gradient orbs */}
        <div
          className="mesh-orb-1 absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
          }}
        />
        <div
          className="mesh-orb-2 absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div>
              {/* Label */}
              <div className="fade-up fade-up-delay-1 mb-6">
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#7c3aed]">
                  AI-POWERED DM AUTOMATION
                </span>
              </div>

              {/* Headline */}
              <h1 className="fade-up fade-up-delay-2 font-black leading-none tracking-tight mb-6">
                <span
                  className="block text-[#fafafa]"
                  style={{ fontSize: 'clamp(48px, 6vw, 84px)' }}
                >
                  Your setters can&apos;t work
                </span>
                <span
                  className="block text-[#fafafa]"
                  style={{ fontSize: 'clamp(48px, 6vw, 84px)' }}
                >
                  24/7. Your AI can.
                </span>
              </h1>

              {/* Subhead */}
              <p className="fade-up fade-up-delay-3 text-[#71717a] text-lg font-medium leading-relaxed mb-10 max-w-lg">
                ChatFlow deploys AI agents directly into your Instagram, Facebook, WhatsApp, and TikTok DMs — qualifying leads, booking calls, and closing sales around the clock. No setters. No missed leads. No ManyChat.
              </p>

              {/* CTAs */}
              <div className="fade-up fade-up-delay-4 flex flex-wrap items-center gap-4">
                <SignupButton
                  mode="signup"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] transition-colors duration-200"
                >
                  Start building free →
                </SignupButton>
                <SignupButton
                  mode="signup"
                  className="text-sm font-semibold text-[#06b6d4] hover:text-[#22d3ee] transition-colors duration-200 flex items-center gap-1"
                >
                  See it in action
                  <ArrowRight className="w-4 h-4" />
                </SignupButton>
              </div>

              {/* Trust signals */}
              <div className="fade-up fade-up-delay-5 mt-8 flex items-center gap-6 text-xs text-[#52525b]">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#22c55e]" /> No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#22c55e]" /> Live in 5 minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#22c55e]" /> Cancel anytime
                </span>
              </div>
            </div>

            {/* Right: animated conversation widget */}
            <div className="fade-up fade-up-delay-3 lg:flex lg:justify-end">
              <ConversationWidget />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SOCIAL PROOF BAR ──────────────────────────────────────────── */}
      <div className="border-y border-[#18181b] py-6 overflow-hidden">
        <p className="text-center text-xs font-semibold tracking-[0.15em] uppercase text-[#52525b] mb-6">
          Works inside every platform your customers already use
        </p>
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #000, transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #000, transparent)' }} />

          <div className="marquee-track flex items-center gap-16 w-max">
            {/* Duplicate for seamless loop */}
            {[...Array(2)].map((_, dupeIdx) => (
              <div key={dupeIdx} className="flex items-center gap-16">
                {[
                  { Icon: InstagramIcon, label: 'Instagram' },
                  { Icon: FacebookIcon, label: 'Facebook' },
                  { Icon: WhatsAppIcon, label: 'WhatsApp' },
                  { Icon: TikTokIcon, label: 'TikTok' },
                  { Icon: MessengerIcon, label: 'Messenger' },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 text-[#52525b] hover:text-[#71717a] transition-colors">
                    <Icon />
                    <span className="text-sm font-medium whitespace-nowrap">{label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. PROBLEM / SOLUTION ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <h2 className="font-black text-[#fafafa] leading-tight mb-4" style={{ fontSize: 'clamp(36px, 4vw, 60px)' }}>
            Setters sleep.{' '}
            <span className="text-[#7c3aed]">Leads don&apos;t wait.</span>
          </h2>
          <p className="text-[#71717a] text-lg max-w-xl mx-auto">
            The difference between a bot that frustrates and an agent that closes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Old way */}
          <div className="p-8 border border-[#18181b]" style={{ background: '#050505' }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#71717a]">
                The old way
              </span>
            </div>
            <p className="font-black text-2xl text-[#fafafa] mb-6">
              A setter misses a DM at 11pm. The lead goes cold. You pay $4,000/month for 8-hour coverage and hope for the best.
            </p>
            <OldWayDiagram />
            <p className="text-xs text-[#52525b] mt-4 italic">
              *Customer leaves. Lead lost. Revenue gone.
            </p>
          </div>

          {/* ChatFlow way */}
          <div
            className="p-8 border"
            style={{
              background: '#050505',
              borderColor: 'rgba(124,58,237,0.2)',
              boxShadow: '0 0 0 1px rgba(124,58,237,0.1), inset 0 1px 0 rgba(124,58,237,0.05)',
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#7c3aed]">
                The ChatFlow way
              </span>
            </div>
            <p className="font-black text-2xl text-[#fafafa] mb-6">
              An AI agent responds in seconds, qualifies the lead, handles objections, and books the call — whether it&apos;s 2pm or 2am.
            </p>
            <ChatFlowWay />
          </div>
        </div>
      </section>

      {/* ── 4. FEATURES ────────────────────────────────────────────────────── */}
      <section id="platform" className="max-w-7xl mx-auto px-6 pb-28">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#7c3aed] mb-4 block">
            Platform
          </span>
          <h2 className="font-black text-[#fafafa] leading-tight" style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
            Built to close, not just converse.
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {features.map((feat, i) => (
            <div
              key={i}
              className="card-glow p-8 flex flex-col group hover:border-[#27272a] transition-colors"
              style={{ background: '#060606' }}
            >
              <div className="flex items-start justify-between mb-8">
                <span
                  className="font-black text-5xl leading-none"
                  style={{ color: 'rgba(124,58,237,0.2)' }}
                >
                  {feat.num}
                </span>
                <div
                  className="p-2 border border-[#27272a]"
                  style={{ background: 'rgba(124,58,237,0.08)' }}
                >
                  {feat.icon}
                </div>
              </div>
              <h3 className="font-black text-xl text-[#fafafa] mb-2">{feat.title}</h3>
              <p className="text-sm font-semibold text-[#7c3aed] mb-3">{feat.sub}</p>
              <p className="text-sm text-[#71717a] leading-relaxed flex-1">{feat.body}</p>
              <div className="mt-6 flex items-center justify-end text-[#52525b] group-hover:text-[#7c3aed] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. METRICS ─────────────────────────────────────────────────────── */}
      <div className="border-y border-[#18181b] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
            {metrics.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col items-center py-8 ${
                  i < metrics.length - 1 ? 'lg:border-r border-[#18181b]' : ''
                } ${i % 2 === 0 && i < 2 ? 'border-r border-[#18181b] lg:border-r-0' : ''}`}
              >
                <span className="font-black text-[#fafafa] mb-2" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}>
                  {m.value}
                </span>
                <span className="text-xs font-medium text-[#71717a] text-center">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. PRICING ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#7c3aed] mb-4 block">
            Pricing
          </span>
          <h2 className="font-black text-[#fafafa] leading-tight mb-4" style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
            Start free. Scale fast.
          </h2>
          <p className="text-[#71717a] text-lg max-w-md mx-auto">
            No lock-ins. No hidden fees. Just AI that works.
          </p>
        </div>

        <PricingSection plans={plans} />
      </section>

      {/* ── 7. FINAL CTA ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-28">
        <div className="gradient-border relative p-px">
          <div
            className="relative px-12 py-20 text-center"
            style={{ background: '#000' }}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 60% 60% at 50% 100%, rgba(124,58,237,0.12) 0%, transparent 70%)',
              }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <MessageSquare className="w-5 h-5 text-[#7c3aed]" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#7c3aed]">
                  Ready to start?
                </span>
              </div>
              <h2
                className="font-black text-[#fafafa] leading-tight mb-4"
                style={{ fontSize: 'clamp(32px, 4vw, 60px)' }}
              >
                Stop paying setters. Start printing leads.
              </h2>
              <p className="text-[#71717a] text-lg mb-10">
                One AI agent in your DMs. Zero missed leads. Free to start.
              </p>
              <SignupButton
                mode="signup"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] transition-colors duration-200"
              >
                Start for free →
              </SignupButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#18181b]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Logo + tagline */}
          <div className="flex items-start justify-between mb-12 flex-wrap gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#7c3aed] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white" />
                </div>
                <span className="font-black text-base text-[#fafafa]">ChatFlow</span>
              </div>
              <p className="text-xs text-[#52525b] max-w-[200px] leading-relaxed">
                Conversational AI that closes deals while you sleep.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-8">
              {(Object.entries(footerLinks) as [string, string[]][]).map(([col, links]) => (
                <div key={col}>
                  <h4 className="text-xs font-semibold tracking-widest uppercase text-[#71717a] mb-4">
                    {col}
                  </h4>
                  <ul className="space-y-2.5">
                    {links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-xs text-[#52525b] hover:text-[#fafafa] transition-colors duration-200"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#18181b] pt-8 flex items-center justify-between flex-wrap gap-4">
            <p className="text-xs text-[#52525b]">
              © 2026 ChatFlow AI. All rights reserved.
            </p>
            <p className="text-xs text-[#52525b] italic">
              Built for the founders who refuse to miss a lead.
            </p>
            <div className="flex items-center gap-4">
              <BarChart3 className="w-4 h-4 text-[#27272a]" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                <span className="text-xs text-[#52525b]">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
