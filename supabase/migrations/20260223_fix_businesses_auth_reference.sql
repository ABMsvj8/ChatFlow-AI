-- Fix: Reference auth.users instead of local users table
-- This migration corrects the foreign key constraint on businesses table

-- Drop the old foreign key constraint
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_owner_id_fkey;

-- Add the correct foreign key to auth.users
ALTER TABLE businesses ADD CONSTRAINT businesses_owner_id_fkey
  FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ensure RLS policies are correctly set
DROP POLICY IF EXISTS businesses_insert ON businesses;
CREATE POLICY businesses_insert ON businesses
  FOR INSERT WITH CHECK (
    owner_id = auth.uid()
  );

-- Verify that other RLS policies are in place
-- (Select and Update should already exist from the previous migration)
