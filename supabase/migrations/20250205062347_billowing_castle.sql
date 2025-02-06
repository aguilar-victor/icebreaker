/*
  # Initial Schema Setup for Icebreaker Game

  1. New Tables
    - `rooms`
      - `id` (uuid, primary key)
      - `host_id` (uuid, references auth.users)
      - `guest_id` (uuid, references auth.users, nullable)
      - `status` (enum)
      - `created_at` (timestamp)
      - `current_question_index` (integer)
      - `is_guest_session` (boolean)

    - `answers`
      - `id` (uuid, primary key)
      - `room_id` (uuid, references rooms)
      - `user_id` (uuid, references auth.users)
      - `question_id` (integer)
      - `answer` (boolean)
      - `created_at` (timestamp)

    - `questions`
      - `id` (integer, primary key)
      - `text` (text)
      - `category` (enum)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for room access
    - Add policies for answer submissions
    - Add policies for question access

  3. Enums
    - room_status: waiting, answering, discussing, completed
    - question_category: personal, professional, fun
*/

-- Create enums
CREATE TYPE room_status AS ENUM ('waiting', 'answering', 'discussing', 'completed');
CREATE TYPE question_category AS ENUM ('personal', 'professional', 'fun');

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid REFERENCES auth.users,
  guest_id uuid REFERENCES auth.users,
  status room_status DEFAULT 'waiting',
  created_at timestamptz DEFAULT now(),
  current_question_index integer DEFAULT 0,
  is_guest_session boolean DEFAULT false,
  CONSTRAINT valid_question_index CHECK (current_question_index >= 0)
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users,
  question_id integer NOT NULL,
  answer boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id serial PRIMARY KEY,
  text text NOT NULL,
  category question_category NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Rooms policies
CREATE POLICY "Users can create rooms"
  ON rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_id OR is_guest_session);

CREATE POLICY "Users can view their rooms"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (auth.uid() = host_id OR auth.uid() = guest_id OR is_guest_session);

CREATE POLICY "Users can update their rooms"
  ON rooms
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id OR auth.uid() = guest_id OR is_guest_session);

-- Answers policies
CREATE POLICY "Users can insert their answers"
  ON answers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM rooms 
      WHERE rooms.id = room_id 
      AND rooms.is_guest_session = true
    )
  );

CREATE POLICY "Users can view answers in their rooms"
  ON answers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rooms 
      WHERE rooms.id = room_id 
      AND (rooms.host_id = auth.uid() OR rooms.guest_id = auth.uid() OR rooms.is_guest_session)
    )
  );

-- Questions policies
CREATE POLICY "Everyone can view questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default questions
INSERT INTO questions (text, category) VALUES
  ('Do you prefer working in a team over working alone?', 'professional'),
  ('Are you comfortable with public speaking?', 'professional'),
  ('Do you enjoy trying new cuisines?', 'personal'),
  ('Are you a morning person?', 'personal'),
  ('Do you prefer planning things in advance?', 'professional'),
  ('Would you rather lead than follow?', 'professional'),
  ('Do you enjoy outdoor activities?', 'personal'),
  ('Are you interested in learning new languages?', 'personal'),
  ('Do you like to travel spontaneously?', 'fun'),
  ('Would you try skydiving?', 'fun');