
-- Create feedback table to collect feedback from the contact page
CREATE TABLE public.feedback (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security for feedback table
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Policy: allow anyone to insert feedback (even if not logged in)
CREATE POLICY "Allow all inserts" ON public.feedback
  FOR INSERT
  WITH CHECK (true);
