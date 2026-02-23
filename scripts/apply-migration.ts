import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cqmltwfbxaqdsqqmddrv.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const migrationSQL = `
-- Fix: Reference auth.users instead of local users table
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_owner_id_fkey;

ALTER TABLE businesses ADD CONSTRAINT businesses_owner_id_fkey
  FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS businesses_insert ON businesses;
CREATE POLICY businesses_insert ON businesses
  FOR INSERT WITH CHECK (
    owner_id = auth.uid()
  );
`;

async function applyMigration() {
  try {
    const { error } = await supabase.rpc('exec', {
      sql: migrationSQL,
    });

    if (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }

    console.log('Migration applied successfully');
  } catch (e) {
    console.error('Error applying migration:', e);
    process.exit(1);
  }
}

applyMigration();
