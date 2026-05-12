/*
  # Create form submissions table

  1. New Tables
    - `submissions`
      - `id` (uuid, primary key)
      - `type` (text) - 'newsletter' or 'inquiry'
      - `email` (text)
      - `name` (text, nullable)
      - `phone` (text, nullable)
      - `project_type` (text, nullable)
      - `space_size` (text, nullable)
      - `message` (text, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Allow anonymous inserts (public form submissions)
    - No reads for anon (admin only via service role)
*/

CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  email text NOT NULL,
  name text,
  phone text,
  project_type text,
  space_size text,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a submission"
  ON submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
