-- Dropping existing users table and recreating with correct Firebase integration schema
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with proper Firebase integration
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT,
  user_type TEXT DEFAULT 'cliente' CHECK (user_type IN ('cliente', 'prestador')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = firebase_uid);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = firebase_uid);

-- Create policy to allow inserting new users
CREATE POLICY "Allow user creation" ON users
  FOR INSERT WITH CHECK (true);
