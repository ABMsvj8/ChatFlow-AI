-- Create users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create businesses table (if not exists)
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create connected_accounts table
CREATE TABLE IF NOT EXISTS connected_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'whatsapp', 'tiktok')),
  platform_account_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, platform, platform_account_id)
);

-- Create agents table (if not exists)
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  ai_provider TEXT NOT NULL CHECK (ai_provider IN ('anthropic', 'openai')),
  ai_model TEXT NOT NULL,
  temperature NUMERIC DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 1024,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table (if not exists)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  connected_account_id UUID NOT NULL REFERENCES connected_accounts(id) ON DELETE CASCADE,
  platform_conversation_id TEXT NOT NULL,
  platform_user_id TEXT NOT NULL,
  platform_user_name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'escalated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(connected_account_id, platform_conversation_id)
);

-- Create messages table (if not exists)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  platform_message_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users (users can only see themselves)
CREATE POLICY users_select ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY users_update ON users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for businesses (users can only see their own businesses)
CREATE POLICY businesses_select ON businesses
  FOR SELECT USING (
    owner_id = auth.uid()
  );

CREATE POLICY businesses_insert ON businesses
  FOR INSERT WITH CHECK (
    owner_id = auth.uid()
  );

CREATE POLICY businesses_update ON businesses
  FOR UPDATE USING (
    owner_id = auth.uid()
  );

-- RLS Policies for connected_accounts (users can only see connected accounts for their businesses)
CREATE POLICY connected_accounts_select ON connected_accounts
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY connected_accounts_insert ON connected_accounts
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY connected_accounts_update ON connected_accounts
  FOR UPDATE USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY connected_accounts_delete ON connected_accounts
  FOR DELETE USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

-- RLS Policies for agents
CREATE POLICY agents_select ON agents
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY agents_insert ON agents
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY agents_update ON agents
  FOR UPDATE USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

-- RLS Policies for conversations
CREATE POLICY conversations_select ON conversations
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY conversations_insert ON conversations
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

-- RLS Policies for messages (inherit from conversations)
CREATE POLICY messages_select ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE business_id IN (
        SELECT id FROM businesses WHERE owner_id = auth.uid()
      )
    )
  );

CREATE POLICY messages_insert ON messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE business_id IN (
        SELECT id FROM businesses WHERE owner_id = auth.uid()
      )
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_business_id ON connected_accounts(business_id);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_platform ON connected_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_agents_business_id ON agents(business_id);
CREATE INDEX IF NOT EXISTS idx_conversations_business_id ON conversations(business_id);
CREATE INDEX IF NOT EXISTS idx_conversations_agent_id ON conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_connected_account_id ON conversations(connected_account_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
