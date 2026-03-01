/*
  # Create School Website Tables

  1. New Tables
    - `contact_queries`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `message` (text, required)
      - `created_at` (timestamp with timezone)
    
    - `admission_enquiries`
      - `id` (uuid, primary key)
      - `student_name` (text, required)
      - `parent_name` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `class_applying_for` (text, required)
      - `created_at` (timestamp with timezone)
    
    - `donation_interests`
      - `id` (uuid, primary key)
      - `full_name` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `donation_type` (text, required)
      - `message` (text)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on all tables
    - Add policies to allow public insert operations (forms are public)
    - Add policies for authenticated users to view all submissions
*/

-- Create contact_queries table
CREATE TABLE IF NOT EXISTS contact_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact queries"
  ON contact_queries
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact queries"
  ON contact_queries
  FOR SELECT
  TO authenticated
  USING (true);

-- Create admission_enquiries table
CREATE TABLE IF NOT EXISTS admission_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  parent_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  class_applying_for text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admission_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit admission enquiries"
  ON admission_enquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view admission enquiries"
  ON admission_enquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Create donation_interests table
CREATE TABLE IF NOT EXISTS donation_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  donation_type text NOT NULL,
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE donation_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit donation interests"
  ON donation_interests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view donation interests"
  ON donation_interests
  FOR SELECT
  TO authenticated
  USING (true);