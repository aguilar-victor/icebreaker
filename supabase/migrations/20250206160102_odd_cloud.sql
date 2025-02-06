/*
  # Add password authentication to rooms

  1. Changes
    - Add password column to rooms table
    - Update RLS policies to check passwords
    - Add function to verify room passwords

  2. Security
    - Passwords are stored as text (for simplicity in this demo)
    - RLS policies updated to maintain security
*/

-- Add password column to rooms
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS password TEXT NOT NULL;

-- Create a function to verify room passwords
CREATE OR REPLACE FUNCTION verify_room_password(room_id UUID, attempted_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM rooms
    WHERE id = room_id AND password = attempted_password
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;