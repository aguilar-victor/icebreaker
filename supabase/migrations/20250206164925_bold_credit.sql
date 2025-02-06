/*
  # Add room password functionality
  
  1. Changes
    - Add password column to rooms table
    - Add password verification function
    - Update RLS policies for password verification
  
  2. Security
    - Password column is required and non-null
    - Verification function uses SECURITY DEFINER for safe password checks
    - RLS policies updated to include password verification
*/

-- Add password column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'rooms' AND column_name = 'password'
  ) THEN
    ALTER TABLE rooms ADD COLUMN password TEXT NOT NULL;
  END IF;
END $$;

-- Create or replace the password verification function
CREATE OR REPLACE FUNCTION verify_room_password(room_id UUID, attempted_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM rooms
    WHERE id = room_id AND password = attempted_password
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies to include password verification
DROP POLICY IF EXISTS "Users can view their rooms" ON rooms;
CREATE POLICY "Users can view their rooms"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = host_id OR 
    auth.uid() = guest_id OR 
    verify_room_password(id, current_setting('app.current_password', TRUE))
  );

DROP POLICY IF EXISTS "Users can update their rooms" ON rooms;
CREATE POLICY "Users can update their rooms"
  ON rooms
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = host_id OR 
    auth.uid() = guest_id OR 
    verify_room_password(id, current_setting('app.current_password', TRUE))
  );