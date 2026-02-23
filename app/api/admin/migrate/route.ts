import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Verify admin key
  const authHeader = request.headers.get('authorization')
  const expectedKey = process.env.ADMIN_MIGRATE_KEY || 'dev-key'
  
  if (authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Initialize Supabase admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // SQL to create tables
    const sql = `
-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS businesses_select ON businesses FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY IF NOT EXISTS businesses_insert ON businesses FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY IF NOT EXISTS businesses_update ON businesses FOR UPDATE USING (owner_id = auth.uid());

-- Connected accounts table
CREATE TABLE IF NOT EXISTS connected_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  platform text NOT NULL,
  access_token text NOT NULL,
  account_id text,
  account_name text,
  page_id text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE connected_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS connected_accounts_select ON connected_accounts FOR SELECT USING (
  business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
);
CREATE POLICY IF NOT EXISTS connected_accounts_insert ON connected_accounts FOR INSERT WITH CHECK (
  business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
);
    `

    // Execute SQL using raw query through Supabase
    let rpcData: { data: unknown; error: unknown } = { data: null, error: null }
    
    try {
      rpcData = await supabase.rpc('exec_sql', { sql })
    } catch {
      // exec_sql might not exist, try alternative method
      rpcData = { data: null, error: 'RPC not available' }
    }

    // If rpc didn't work, we'll try to verify tables exist by querying them
    // Try to get info about the businesses table
    let businessesCheck: unknown = null
    let connectedCheck: unknown = null
    
    try {
      const result = await supabase
        .from('businesses')
        .select('count')
        .limit(1)
      businessesCheck = result.data
    } catch {
      businessesCheck = null
    }

    try {
      const result = await supabase
        .from('connected_accounts')
        .select('count')
        .limit(1)
      connectedCheck = result.data
    } catch {
      connectedCheck = null
    }

    return NextResponse.json({
      message: 'Migration attempted',
      businessesTableExists: !!businessesCheck,
      connectedAccountsTableExists: !!connectedCheck,
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { error: 'Migration failed', details: String(error) },
      { status: 500 }
    )
  }
}
