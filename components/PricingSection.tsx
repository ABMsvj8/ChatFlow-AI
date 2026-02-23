'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { SignupButton } from '@/components/SignupButton'

interface Plan {
  name: string
  price: string
  period: string
  desc: string
  featured: boolean
  features: string[]
}

interface PricingSectionProps {
  plans: Plan[]
}

export default function PricingSection({ plans }: PricingSectionProps) {
  const [annual, setAnnual] = useState(false)

  return (
    <div>
      {/* Annual toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <span className={`text-sm font-medium ${!annual ? 'text-[#fafafa]' : 'text-[#71717a]'}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className="relative w-12 h-6 transition-colors duration-200"
          style={{ background: annual ? '#7c3aed' : '#18181b' }}
          aria-label="Toggle annual billing"
        >
          <div
            className="absolute top-1 w-4 h-4 bg-white transition-transform duration-200"
            style={{ transform: annual ? 'translateX(28px)' : 'translateX(4px)' }}
          />
        </button>
        <span className={`text-sm font-medium ${annual ? 'text-[#fafafa]' : 'text-[#71717a]'}`}>
          Annual
          <span className="ml-2 text-xs text-[#06b6d4] font-semibold">Save 20%</span>
        </span>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col p-6 transition-transform duration-200 ${
              plan.featured ? '-translate-y-2' : ''
            }`}
            style={
              plan.featured
                ? {
                    background: '#070709',
                    boxShadow:
                      '0 0 0 1px rgba(124,58,237,0.5), 0 0 30px rgba(124,58,237,0.12), inset 0 1px 0 rgba(124,58,237,0.1)',
                  }
                : {
                    background: '#060606',
                    boxShadow: '0 0 0 1px #18181b, inset 0 1px 0 rgba(255,255,255,0.02)',
                  }
            }
          >
            {/* Most Popular badge */}
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="text-[10px] font-semibold tracking-widest uppercase px-3 py-1 text-white bg-[#7c3aed]">
                  Most Popular
                </span>
              </div>
            )}

            {/* Header */}
            <div className="mb-6">
              <h3 className="font-black text-[#fafafa] text-lg mb-1">{plan.name}</h3>
              <p className="text-xs text-[#71717a]">{plan.desc}</p>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-end gap-1">
                <span className="font-black text-[#fafafa]" style={{ fontSize: 'clamp(32px, 3vw, 44px)' }}>
                  {plan.price === '$0'
                    ? '$0'
                    : annual
                      ? `$${Math.round(parseInt(plan.price.replace('$', '')) * 0.8)}`
                      : plan.price}
                </span>
                <span className="text-sm text-[#71717a] mb-1.5">{plan.period}</span>
              </div>
              {annual && plan.price !== '$0' && (
                <p className="text-xs text-[#06b6d4] mt-1">
                  Billed annually
                </p>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-3 flex-1 mb-8">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#06b6d4] flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-[#a1a1aa] leading-relaxed">{feat}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <SignupButton
              mode="signup"
              className={`w-full py-3 text-sm font-semibold transition-colors duration-200 ${
                plan.featured
                  ? 'bg-[#7c3aed] text-white hover:bg-[#6d28d9]'
                  : 'border border-[#27272a] text-[#fafafa] hover:border-[#3f3f46] hover:bg-[#0a0a0a]'
              }`}
            >
              {plan.name === 'Free' ? 'Get started free' : `Start ${plan.name}`} →
            </SignupButton>
          </div>
        ))}
      </div>
    </div>
  )
}
