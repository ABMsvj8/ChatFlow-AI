#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('ERROR: Missing SUPABASE_URL or SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  db: {
    schema: 'public',
  },
})

async function runMigration() {
  try {
    console.log('🚀 Running database migrations...')

    const migrationFile = path.join(__dirname, '..', 'supabase', 'migrations', '20260223_create_connected_accounts.sql')
    const migrationSQL = fs.readFileSync(migrationFile, 'utf-8')

    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0)

    for (const statement of statements) {
      console.log(`⏳ Executing: ${statement.substring(0, 50)}...`)
      const { error } = await supabase.rpc('exec', {
        query: statement,
      })

      if (error) {
        console.error('❌ Error executing statement:', error)
        // Continue anyway as some statements might fail if they're trying to create existing tables
      }
    }

    console.log('✅ Database setup complete!')
  } catch (error) {
    console.error('ERROR:', error.message)
    process.exit(1)
  }
}

// Alternative: Use the supabase admin API to run raw SQL
async function runMigrationDirect() {
  try {
    console.log('🚀 Running database migrations...')

    const migrationFile = path.join(__dirname, '..', 'supabase', 'migrations', '20260223_create_connected_accounts.sql')
    const migrationSQL = fs.readFileSync(migrationFile, 'utf-8')

    // Use the admin API to execute raw SQL
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: migrationSQL,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Error:', error)
      process.exit(1)
    }

    console.log('✅ Database setup complete!')
  } catch (error) {
    console.error('ERROR:', error.message)
    console.log('\n💡 TIP: If this fails, run the SQL migration manually in Supabase Dashboard:')
    console.log('   1. Go to https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]/sql/new')
    console.log('   2. Copy the contents of: supabase/migrations/20260223_create_connected_accounts.sql')
    console.log('   3. Paste and execute')
    process.exit(1)
  }
}

runMigrationDirect()
