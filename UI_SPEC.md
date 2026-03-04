# UI_SPEC.md — ChatFlow AI Design System & Page Specifications

## Design System (From SOUL.md)

### Colors
- **Backgrounds**: white (#FFFFFF), cream (#FAFAF9), light grey (#F5F5F4)
- **Text**: black (#0A0A0A) for headings, dark grey (#404040) for body
- **Borders**: light grey (#E5E5E5)
- **Brand accents** (ONLY for gradients, glows, highlights — NEVER as solid backgrounds):
  - Pink: rgba(236, 72, 153, 0.1) to rgba(236, 72, 153, 0.3)
  - Baby blue: rgba(96, 165, 250, 0.1) to rgba(96, 165, 250, 0.3)
  - Purple: rgba(168, 85, 247, 0.1) to rgba(168, 85, 247, 0.3)
- **Interactive elements**: Brand gradient for primary buttons (pink to purple), black for secondary
- **Status colors**: green for success, red for error, yellow for warning

### Typography
- Clean sans-serif (Inter or system font stack)
- Headings: bold, black, generous size hierarchy
- Body: regular weight, dark grey, comfortable line height

### Component Style
- Rounded corners (border-radius: 8-12px)
- Subtle shadows for elevation (no heavy drop shadows)
- Generous whitespace — don't cram elements
- Smooth transitions and hover states
- Glass morphism effects for accent cards (translucent brand colors + blur)

### Layout
- Max content width: 1280px centered
- Sidebar navigation on dashboard (collapsible on mobile)
- Cards for grouping related content
- Consistent 16px/24px/32px spacing rhythm

### Mobile
- Every page must be responsive
- Mobile-first: design for phone, then expand for desktop
- Touch-friendly tap targets (min 44px)
- Stack columns vertically on small screens

### Aesthetic Reference
Think: Linear, Vercel, Stripe dashboard. Clean, modern, tech-forward. The brand colors should feel like subtle light effects — translucent overlays, gradient borders, soft glows — not like a paint bucket.

## Pages to Overhaul (14 Total)

### 1. Landing Page (app/page.tsx)
**Current**: Dark theme with purple/black gradients
**Target**: Light theme with white/cream backgrounds, brand accents as glows
**Sections to update**:
- Navbar: white background, black text
- Hero: cream background, black headings, brand gradient accents
- Problem Section: white/grey cards, subtle borders
- Phone Mockup: light backgrounds
- Features: cards with brand accent glows
- Platforms: light backgrounds
- Pricing: light cards
- Final CTA: brand gradient overlay
- Footer: light background

### 2. Dashboard (app/dashboard/page.tsx)
**Current**: Dark sidebar, dark cards
**Target**: White sidebar, cream main area, light grey cards
**Components**:
- Sidebar navigation: white background, black text
- Stats cards: white with subtle brand gradient borders
- Charts: light background
- Recent conversations: white cards

### 3. Onboarding Flow (app/onboarding/*)
**Current**: Dark theme
**Target**: Multi-step wizard with light backgrounds, brand accent highlights
**Pages**:
- Business info form (app/onboarding/page.tsx)
- Agent creation wizard (app/onboarding/agent/page.tsx)

### 4. Conversations Inbox (app/conversations/page.tsx)
**Current**: Dark three-panel layout
**Target**: Light three-panel layout
**Panels**:
- Left: contacts list (white cards)
- Middle: conversation thread (cream background)
- Right: contact info/agent panel (white card)

### 5. AI Agent Creator Wizard (app/dashboard/agents/[agent_id]/edit/page.tsx)
**Current**: Dark multi-step form
**Target**: 6-step wizard with light backgrounds, brand accent guidance

### 6. Agent Templates Gallery
**Location**: Not yet created (needs new page)
**Target**: Grid of template cards with brand accent glows

### 7. Contacts/CRM Page
**Location**: Not yet created (needs new page)
**Target**: Table with filters, light cards

### 8. Automation Rules Page
**Location**: Not yet created (needs new page)
**Target**: Visual rule builder with light interface

### 9. Broadcasting Page
**Location**: Not yet created (needs new page)
**Target**: Message composer with audience selector

### 10. Growth Tools Page
**Location**: Not yet created (needs new page)
**Target**: Tool cards with light backgrounds

### 11. Analytics Dashboard
**Location**: app/dashboard/analytics/page.tsx (exists)
**Target**: Charts and metrics with light theme

### 12. Platforms Management Page
**Location**: Not yet created (needs new page)
**Target**: Platform connection cards

### 13. Knowledge Base Page
**Location**: Not yet created (needs new page)
**Target**: Documentation with light theme

### 14. Settings Page
**Location**: Not yet created (needs new page)
**Target**: Form sections with light cards

## Implementation Order
1. Update globals.css with new color variables
2. Landing page (highest visibility)
3. Dashboard (core user experience)
4. Onboarding flow (new user experience)
5. Conversations inbox (core product)
6. AI Agent creator wizard (core product)
7. Analytics dashboard
8. Remaining pages (8-14)

## API Endpoints Needed
**For Peter to build**:
1. Agent templates list endpoint
2. Contacts/CRM data endpoint
3. Automation rules CRUD
4. Broadcasting send endpoint
5. Growth tools data
6. Platforms management endpoints
7. Knowledge base content
8. Settings update endpoints

**Existing APIs** (confirmed in repo):
- /api/agents/* (create, respond, [id])
- /api/onboarding/business
- /api/conversations/*
- /api/auth/* (Facebook, Instagram, WhatsApp)
- /api/platforms/* (connect, callback, debug)
- /api/webhooks/instagram

## Mobile Responsiveness
Each page must be tested on:
- Mobile (320px-480px)
- Tablet (768px-1024px)
- Desktop (1024px+)

## Testing URLs
- Production: https://chatflow-ai-black.vercel.app
- Local: http://localhost:3000

## Git Branch Strategy
- Branch: `design-system-overhaul`
- One PR per major page group
- Daily updates to Elon