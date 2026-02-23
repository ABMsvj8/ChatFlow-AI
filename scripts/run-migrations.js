#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
  console.error('SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  db: {
    schema: 'public',
  },
});

// Read and execute migration files
const migrationDir = path.join(process.cwd(), 'supabase', 'migrations');
const migrationFiles = fs
  .readdirSync(migrationDir)
  .filter((f) => f.endsWith('.sql'))
  .sort();

async function runMigrations() {
  console.log('Running migrations...');
  
  for (const file of migrationFiles) {
    const filePath = path.join(migrationDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');
    
    console.log(`\nExecuting: ${file}`);
    
    try {
      // Execute the SQL
      const { data, error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        console.error(`Error in ${file}:`, error);
        // Try alternative approach using fetch
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'x-client-info': 'supabase-migrations/1.0',
          },
          body: JSON.stringify({ query: sql }),
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error(`Alternative method also failed:`, errorData);
          process.exit(1);
        }
      } else {
        console.log(`✓ ${file} executed successfully`);
      }
    } catch (err) {
      console.error(`Failed to execute ${file}:`, err);
      process.exit(1);
    }
  }
  
  console.log('\n✓ All migrations completed');
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
