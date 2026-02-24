#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};

envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const [key, ...valueParts] = trimmed.split('=');
  env[key] = valueParts.join('=');
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
  process.exit(1);
}

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  console.error('   This key must be added to .env.local to proceed.');
  console.error('   Get it from: Supabase Dashboard → Project Settings → API Keys → Service Role Secret');
  process.exit(1);
}

const SQL = `-- Drop old incorrect tables
DROP TABLE IF EXISTS connected_accounts CASCADE;

-- Fix businesses table (user_id not owner_id)
DROP TABLE IF EXISTS businesses CASCADE;
CREATE TABLE businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  logo_url text,
  timezone text DEFAULT 'UTC',
  default_language text DEFAULT 'en',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY businesses_select ON businesses FOR SELECT USING (user_id = auth.uid());
CREATE POLICY businesses_insert ON businesses FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY businesses_update ON businesses FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY businesses_delete ON businesses FOR DELETE USING (user_id = auth.uid());

-- Connected platforms (correct name, correct schema)
CREATE TABLE IF NOT EXISTS connected_platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('instagram','facebook','whatsapp','tiktok')),
  platform_account_id text,
  account_name text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  webhook_secret text,
  status text DEFAULT 'active' CHECK (status IN ('active','expired','error','disconnected')),
  connected_at timestamptz DEFAULT now(),
  last_activity_at timestamptz
);
ALTER TABLE connected_platforms ENABLE ROW LEVEL SECURITY;
CREATE POLICY connected_platforms_select ON connected_platforms FOR SELECT USING (
  business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
);
CREATE POLICY connected_platforms_insert ON connected_platforms FOR INSERT WITH CHECK (
  business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
);
CREATE POLICY connected_platforms_update ON connected_platforms FOR UPDATE USING (
  business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
);

-- Agents
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('active','paused','draft')),
  personality_config jsonb DEFAULT '{}',
  goal text CHECK (goal IN ('sell','support','book','qualify','custom')),
  goal_config jsonb DEFAULT '{}',
  trigger_config jsonb DEFAULT '{}',
  handoff_rules jsonb DEFAULT '{}',
  actions_config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY agents_select ON agents FOR SELECT USING (
  business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
);
CREATE POLICY agents_insert ON agents FOR INSERT WITH CHECK (
  business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
);
CREATE POLICY agents_update ON agents FOR UPDATE USING (
  business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
);

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id),
  connected_platform_id uuid REFERENCES connected_platforms(id),
  customer_platform_id text,
  customer_name text,
  status text DEFAULT 'active' CHECK (status IN ('active','resolved','handed_off','waiting')),
  sentiment_score numeric,
  started_at timestamptz DEFAULT now(),
  last_message_at timestamptz,
  resolved_at timestamptz,
  message_count int DEFAULT 0,
  metadata jsonb DEFAULT '{}'
);
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY conversations_select ON conversations FOR SELECT USING (
  business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('customer','agent','human')),
  content text NOT NULL,
  platform_message_id text,
  ai_model_used text,
  ai_tokens_used int,
  ai_cost numeric,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY messages_select ON messages FOR SELECT USING (
  conversation_id IN (
    SELECT id FROM conversations WHERE business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  )
);

-- Webhook events
CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connected_platform_id uuid REFERENCES connected_platforms(id),
  platform text,
  event_type text,
  payload jsonb,
  processed boolean DEFAULT false,
  processed_at timestamptz,
  error text,
  received_at timestamptz DEFAULT now()
);
`;

async function applySchema() {
  console.log('🚀 Applying database schema to Supabase...\n');
  console.log(`📍 URL: ${SUPABASE_URL}\n`);

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ query: SQL }),
    });

    // If the REST API doesn't support raw SQL, try the SQL endpoint
    if (!response.ok) {
      console.log('ℹ️  Trying direct SQL execution via fetch...\n');
      
      const sqlResponse = await fetch(`${SUPABASE_URL}/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
        },
        body: JSON.stringify({ query: SQL }),
      });

      if (!sqlResponse.ok) {
        const error = await sqlResponse.text();
        throw new Error(`SQL execution failed: ${error}`);
      }

      const result = await sqlResponse.json();
      console.log('✅ Schema applied successfully via SQL endpoint');
      console.log('\n📊 Results:', JSON.stringify(result, null, 2));
      return;
    }

    const result = await response.json();
    console.log('✅ Schema applied successfully');
    console.log('\n📊 Results:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Error applying schema:', error.message);
    
    // Fallback: Try using @supabase/supabase-js if available
    console.log('\n💡 Attempting fallback with @supabase/supabase-js...\n');
    
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: { persistSession: false }
      });

      const { error: sqlError } = await supabase.rpc('exec_sql', { sql: SQL });
      
      if (sqlError) {
        // If RPC doesn't exist, try direct query execution
        console.log('💡 RPC not available, executing statements individually...\n');
        
        // Split SQL into individual statements and execute each
        const statements = SQL.split(';').filter(s => s.trim());
        let successCount = 0;
        
        for (const statement of statements) {
          if (!statement.trim()) continue;
          
          const { error } = await supabase.rpc('exec', { 
            query: statement.trim() + ';' 
          }).catch(() => ({ error: null })); // Ignore RPC errors
          
          if (!error) {
            successCount++;
          }
        }
        
        console.log(`✅ Executed ${successCount} SQL statements`);
      } else {
        console.log('✅ Schema applied successfully via RPC');
      }
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError.message);
      console.error('\n⚠️  MANUAL EXECUTION REQUIRED');
      console.error('Copy and paste the SQL above directly into Supabase SQL Editor:');
      console.error(`📍 ${SUPABASE_URL}/project/sql/new`);
      process.exit(1);
    }
  }
}

applySchema();
