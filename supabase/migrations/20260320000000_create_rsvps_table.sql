-- Create the rsvps table
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 1,
  phone TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert an RSVP
CREATE POLICY "Anyone can insert an RSVP" ON rsvps
  FOR INSERT WITH CHECK (true);

-- Policy: Only authenticated users with specific email can read all RSVPs
-- Replace 'dgoncalves@hotmail.com.br' with the actual admin email
CREATE POLICY "Admins can read all RSVPs" ON rsvps
  FOR SELECT USING (auth.jwt() ->> 'email' = 'dgoncalves@hotmail.com.br');

-- Policy: Admins can update/delete RSVPs
CREATE POLICY "Admins can update RSVPs" ON rsvps
  FOR UPDATE USING (auth.jwt() ->> 'email' = 'dgoncalves@hotmail.com.br');

CREATE POLICY "Admins can delete RSVPs" ON rsvps
  FOR DELETE USING (auth.jwt() ->> 'email' = 'dgoncalves@hotmail.com.br');
