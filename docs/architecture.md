# ChatFlow AI — V2 Architecture

> **Status:** Draft  
> **Author:** Peter Steinberg  
> **Date:** 2026-02-22  
> **Version:** 2.0.0

---

## Table of Contents

1. [Database Schema](#1-database-schema)
2. [API Route Structure](#2-api-route-structure)
3. [OAuth Integration Approach](#3-oauth-integration-approach)
4. [AI Conversation Engine Design](#4-ai-conversation-engine-design)
5. [Webhook Architecture](#5-webhook-architecture)

---

## 1. Database Schema

All tables live in Supabase (PostgreSQL). Row-Level Security (RLS) is **mandatory** on every table. No table ships to production without RLS enabled and policies defined.

---

### `users`

Mirrors Supabase Auth `auth.users` — created via trigger on `auth.users` insert.

```sql
CREATE TABLE public.users (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL UNIQUE,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
```

**RLS:**
- `SELECT`: user can only read their own row (`auth.uid() = id`)
- `UPDATE`: user can only update their own row
- `INSERT`/`DELETE`: handled by trigger/auth system only — no direct user insert

---

### `businesses`

A business is the top-level tenant. A user can own or be a member of multiple businesses (future: membership table).

```sql
CREATE TABLE public.businesses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  plan        text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
```

**RLS:**
- `SELECT`: `owner_id = auth.uid()` (expand to membership table later)
- `INSERT`: `owner_id = auth.uid()`
- `UPDATE`/`DELETE`: `owner_id = auth.uid()`

---

### `connected_accounts`

Stores OAuth tokens for each social platform connection. **Tokens are encrypted at rest** using Supabase Vault (pg_sodium) before insert — never stored plaintext.

```sql
CREATE TABLE public.connected_accounts (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id           uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  platform              text NOT NULL CHECK (platform IN ('instagram','facebook','whatsapp','tiktok')),
  platform_account_id   text NOT NULL,
  access_token          text NOT NULL,          -- encrypted via pg_sodium / Vault
  refresh_token         text,                   -- encrypted via pg_sodium / Vault
  token_expires_at      timestamptz,
  metadata              jsonb NOT NULL DEFAULT '{}',
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE(business_id, platform, platform_account_id)
);
```

**RLS:**
- `ALL`: business must be owned by `auth.uid()` — join-based policy:
  ```sql
  EXISTS (
    SELECT 1 FROM businesses b
    WHERE b.id = connected_accounts.business_id
      AND b.owner_id = auth.uid()
  )
  ```
- Webhook/server routes use `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS, used only server-side)

---

### `agents`

An AI agent belongs to a business. It carries the system prompt, model selection, and parameters. Multiple agents per business are supported (e.g., one per platform, one per persona).

```sql
CREATE TABLE public.agents (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id    uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name           text NOT NULL,
  system_prompt  text NOT NULL,
  ai_provider    text NOT NULL DEFAULT 'anthropic' CHECK (ai_provider IN ('anthropic','openai')),
  ai_model       text NOT NULL DEFAULT 'claude-3-5-sonnet-20241022',
  temperature    numeric NOT NULL DEFAULT 0.7 CHECK (temperature BETWEEN 0 AND 2),
  max_tokens     integer NOT NULL DEFAULT 1024,
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
```

**RLS:**
- Same join-based policy as `connected_accounts` (via `businesses.owner_id`)

---

### `conversations`

One conversation per unique (connected_account, platform_user). Tracks status so agents can hand off to human support.

```sql
CREATE TABLE public.conversations (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id               uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  agent_id                  uuid NOT NULL REFERENCES public.agents(id),
  connected_account_id      uuid NOT NULL REFERENCES public.connected_accounts(id),
  platform_conversation_id  text NOT NULL,   -- thread/room id from the platform
  platform_user_id          text NOT NULL,   -- sender id on the platform
  platform_user_name        text,
  status                    text NOT NULL DEFAULT 'active'
                              CHECK (status IN ('active','resolved','escalated')),
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now(),
  UNIQUE(connected_account_id, platform_conversation_id)
);
```

**RLS:**
- Join via `businesses.owner_id = auth.uid()`
- Service role used by webhook handlers

---

### `messages`

Append-only log of every message in a conversation (user messages + AI responses).

```sql
CREATE TABLE public.messages (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id       uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role                  text NOT NULL CHECK (role IN ('user','assistant','system')),
  content               text NOT NULL,
  platform_message_id   text,          -- original platform message id (for dedup)
  metadata              jsonb NOT NULL DEFAULT '{}',
  created_at            timestamptz NOT NULL DEFAULT now()
);
```

**RLS:**
- Join via `conversations → businesses → owner_id = auth.uid()`
- No UPDATE or DELETE — messages are immutable
- Service role writes AI responses from server-side handlers

---

## 2. API Route Structure

All route handlers live under `app/api/`. Each file exports typed `GET`/`POST`/`PATCH`/`DELETE` handlers.

```
app/api/
├── auth/
│   ├── callback/
│   │   └── route.ts          # Supabase OAuth callback (exchange code → session)
│   └── signout/
│       └── route.ts          # Server-side signout (clear cookies)
│
├── businesses/
│   ├── route.ts              # GET (list), POST (create)
│   └── [id]/
│       └── route.ts          # GET, PATCH, DELETE
│
├── connected-accounts/
│   ├── route.ts              # GET (list by business)
│   └── [id]/
│       ├── route.ts          # GET, DELETE
│       └── refresh/
│           └── route.ts      # POST — force token refresh
│
├── agents/
│   ├── route.ts              # GET, POST
│   └── [id]/
│       └── route.ts          # GET, PATCH, DELETE
│
├── conversations/
│   ├── route.ts              # GET (list with filters)
│   └── [id]/
│       ├── route.ts          # GET, PATCH (status change)
│       └── messages/
│           └── route.ts      # GET (paginated history)
│
├── oauth/
│   ├── instagram/
│   │   ├── connect/route.ts  # GET — redirect to Instagram OAuth
│   │   └── callback/route.ts # GET — exchange code, store tokens
│   ├── facebook/
│   │   ├── connect/route.ts
│   │   └── callback/route.ts
│   ├── whatsapp/
│   │   ├── connect/route.ts
│   │   └── callback/route.ts
│   └── tiktok/
│       ├── connect/route.ts
│       └── callback/route.ts
│
└── webhooks/
    ├── instagram/
    │   └── route.ts          # GET (verify), POST (inbound DMs)
    ├── facebook/
    │   └── route.ts          # GET (verify), POST
    ├── whatsapp/
    │   └── route.ts          # GET (verify), POST
    └── tiktok/
        └── route.ts          # GET (verify), POST
```

### Route Conventions

- All handlers return `NextResponse.json()` with explicit HTTP status codes
- Auth-protected routes call `createClient()` (server) + `supabase.auth.getUser()` at the top — 401 if no session
- Webhook routes bypass auth middleware and implement HMAC signature verification instead
- No business logic in route files — delegate to `lib/` service functions

---

## 3. OAuth Integration Approach

### Flow Overview

Each platform follows the standard Authorization Code Flow with PKCE where supported.

```
User clicks "Connect [Platform]"
  → GET /api/oauth/{platform}/connect
    → Generate state param (stored in encrypted cookie)
    → Redirect to platform authorization URL
  → User authorizes on platform
  → Platform redirects to /api/oauth/{platform}/callback?code=...&state=...
    → Validate state param (CSRF protection)
    → Exchange code for access_token + refresh_token
    → Encrypt tokens with pg_sodium / Supabase Vault
    → Upsert row in connected_accounts
    → Subscribe webhooks for the connected account
    → Redirect to dashboard
```

### Platform-Specific Notes

#### Instagram / Facebook
- Both use the **Meta Graph API** OAuth flow (`graph.facebook.com/oauth/authorize`)
- Instagram requires a Facebook Page linked to the Instagram Business/Creator account
- Long-lived tokens issued by Meta are valid 60 days — refresh 10 days before expiry
- System user tokens (for WhatsApp Business) are permanent but must be generated manually in Meta Business Manager; stored same way

#### WhatsApp (Meta Cloud API)
- Uses Meta's same OAuth app but requires `whatsapp_business_messaging` permission
- Phone Number ID is needed per number; stored in `connected_accounts.metadata`
- Webhook subscription is per phone number, verified via `WHATSAPP_VERIFY_TOKEN`

#### TikTok
- Uses TikTok for Business API (`business-api.tiktok.com/portal/auth`)
- Scopes: `dm.list`, `dm.send`, `user.info.basic`
- Short-lived access tokens (24h) — always use refresh token flow
- PKCE required

### Token Storage

```
connected_accounts.access_token  →  encrypted with Vault (pg_sodium)
connected_accounts.refresh_token →  encrypted with Vault (pg_sodium)
connected_accounts.token_expires_at → UTC timestamp for refresh scheduling
```

### Token Refresh Logic

```
lib/oauth/refresh.ts
```

- Cron job (Supabase Edge Function scheduled every 6h) queries `connected_accounts` where `token_expires_at < now() + interval '10 days'`
- Calls platform refresh endpoint, updates tokens in DB
- On refresh failure: marks account as `needs_reauth` in metadata, sends notification to business owner
- API routes that use a token always check `token_expires_at` and refresh inline if within 1h of expiry (belt-and-suspenders)

---

## 4. AI Conversation Engine Design

### Abstraction Layer

The engine lives in `lib/ai/` and exposes a single interface regardless of provider:

```typescript
// lib/ai/types.ts
export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AICompletionRequest {
  provider: 'anthropic' | 'openai'
  model: string
  systemPrompt: string
  messages: AIMessage[]
  temperature: number
  maxTokens: number
}

export interface AICompletionResponse {
  content: string
  inputTokens: number
  outputTokens: number
  model: string
}

export interface AIProvider {
  complete(request: AICompletionRequest): Promise<AICompletionResponse>
}
```

Provider implementations:

```
lib/ai/
├── types.ts              # Interfaces above
├── index.ts              # getProvider(agent) → AIProvider factory
├── providers/
│   ├── anthropic.ts      # Implements AIProvider using Anthropic SDK
│   └── openai.ts         # Implements AIProvider using OpenAI SDK
└── engine.ts             # Core: buildContext() + runCompletion() + storeResult()
```

Swapping providers requires only changing `agent.ai_provider` in the DB — zero business logic changes.

### Context Management

```typescript
// lib/ai/engine.ts
export async function buildContext(conversationId: string): Promise<AIMessage[]>
```

- Fetches the last **N messages** from `messages` table (default N=20, configurable per agent)
- Prepends the agent's `system_prompt` as a `system` role message
- Applies a **token budget**: counts approximate tokens in history, trims oldest messages to stay under `agent.max_tokens * 0.6` (leaving headroom for the response)
- Returns ordered `AIMessage[]` ready for the provider

### Conversation Storage

```typescript
// lib/ai/engine.ts
export async function handleInboundMessage(params: {
  conversationId: string
  agentId: string
  inboundContent: string
  platformMessageId: string
}): Promise<AICompletionResponse>
```

Flow:
1. Insert inbound message (`role: 'user'`) into `messages`
2. `buildContext()` → fetch history
3. `getProvider(agent).complete()` → AI response
4. Insert AI response (`role: 'assistant'`) into `messages`
5. Return response for delivery back to platform

All DB writes use the **service role client** (server-side only).

---

## 5. Webhook Architecture

### Inbound Message Flow

```
Platform DM sent by user
  ↓
Platform delivers POST to /api/webhooks/{platform}
  ↓
[1] HMAC / signature verification
  ↓ (reject 401 if invalid)
[2] Parse payload → extract: platform_user_id, message content, platform_message_id
  ↓
[3] Dedup check — has this platform_message_id been processed? (messages table lookup)
  ↓ (skip if duplicate)
[4] Look up connected_account by platform_account_id
  ↓
[5] Upsert conversation (get or create by connected_account_id + platform_conversation_id)
  ↓
[6] Look up active agent for this business
  ↓
[7] lib/ai/engine.handleInboundMessage() → AI response
  ↓
[8] Deliver response via platform API (send DM back)
  ↓
[9] Return 200 OK to platform (must be fast — platforms time out at ~5s)
```

### Signature Verification

Each platform uses a different scheme — all implemented in `lib/webhooks/verify.ts`:

| Platform | Method |
|---|---|
| Instagram / Facebook | `X-Hub-Signature-256: sha256=<hmac>` using App Secret |
| WhatsApp | Same as Meta above |
| TikTok | `X-TikTok-Signature: sha256=<hmac>` using client secret |

Verification happens **before** any DB access. Invalid signatures return `401` immediately.

### Handling Platform Timeouts

Platforms (especially Meta) expect a `200 OK` within 5 seconds. AI completions may take longer.

**Strategy: Immediate ACK + Background Processing**

```
POST /api/webhooks/{platform}
  → Verify signature (sync, <10ms)
  → Enqueue job (Supabase Edge Function / queue) — immediate
  → Return 200 OK to platform

Background job (Supabase Edge Function or Vercel background function):
  → Parse event
  → Dedup check
  → Look up conversation + agent
  → Run AI completion
  → Send reply via platform API
```

This decouples the acknowledgment from the AI processing, ensuring platforms never time out.

### Webhook Registration

Each platform requires the webhook endpoint to be registered and verified:

- **Meta (Instagram/Facebook/WhatsApp):** GET request to endpoint with `hub.challenge` — route handler echoes it back. Registered once per Meta app in the developer dashboard.
- **TikTok:** Similar GET challenge mechanism.
- Registration happens automatically when a user connects an account (`/api/oauth/{platform}/callback` triggers webhook subscription via platform API).

### Scaling Considerations

- Each webhook route is stateless and idempotent
- Dedup by `platform_message_id` prevents double-processing on platform retries
- Rate limits per connected account tracked in `connected_accounts.metadata`
- Future: move to a dedicated queue (Upstash QStash or Inngest) for retries + observability

---

*Document maintained by Peter Steinberg. Update after each architecture decision.*
