/*
  # Create Drama Content Tables
  
  1. New Tables
    - `dramas`
      - `id` (text, primary key) - Drama ID
      - `title` (text) - Drama title
      - `description` (text) - Drama description
      - `poster` (text) - Poster image URL
      - `rating` (numeric) - Rating score
      - `views` (integer) - View count
      - `episodes` (integer) - Total episodes
      - `year` (integer) - Release year
      - `genres` (jsonb) - Array of genres
      - `actors` (jsonb) - Array of actors
      - `source` (text) - Data source (melongo/dramaraborox)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `drama_episodes`
      - `id` (uuid, primary key)
      - `drama_id` (text, foreign key)
      - `episode_number` (integer)
      - `title` (text)
      - `video_url` (text)
      - `thumbnail` (text)
      - `duration` (text)
      - `created_at` (timestamptz)
    
    - `drama_trending`
      - `id` (uuid, primary key)
      - `drama_id` (text, foreign key)
      - `rank` (integer)
      - `source` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
*/

-- Create dramas table
CREATE TABLE IF NOT EXISTS dramas (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text DEFAULT '',
  poster text DEFAULT '',
  rating numeric DEFAULT 0,
  views integer DEFAULT 0,
  total_episodes integer DEFAULT 0,
  year integer DEFAULT 2025,
  genres jsonb DEFAULT '[]'::jsonb,
  actors jsonb DEFAULT '[]'::jsonb,
  source text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create episodes table
CREATE TABLE IF NOT EXISTS drama_episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drama_id text NOT NULL REFERENCES dramas(id) ON DELETE CASCADE,
  episode_number integer NOT NULL,
  title text DEFAULT '',
  video_url text DEFAULT '',
  thumbnail text DEFAULT '',
  duration text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(drama_id, episode_number)
);

-- Create trending table
CREATE TABLE IF NOT EXISTS drama_trending (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drama_id text NOT NULL REFERENCES dramas(id) ON DELETE CASCADE,
  rank integer NOT NULL,
  source text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(drama_id, source)
);

-- Enable RLS
ALTER TABLE dramas ENABLE ROW LEVEL SECURITY;
ALTER TABLE drama_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE drama_trending ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can read dramas"
  ON dramas FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can read episodes"
  ON drama_episodes FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can read trending"
  ON drama_trending FOR SELECT
  TO anon
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_dramas_source ON dramas(source);
CREATE INDEX IF NOT EXISTS idx_dramas_created_at ON dramas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_drama_episodes_drama_id ON drama_episodes(drama_id);
CREATE INDEX IF NOT EXISTS idx_drama_trending_source ON drama_trending(source, rank);
