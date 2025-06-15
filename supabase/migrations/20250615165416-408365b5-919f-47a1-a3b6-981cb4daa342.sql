
-- Create table to store newsletter subscribers
CREATE TABLE public.subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Allow anyone to insert (public subscription)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all to insert subscribers" ON public.subscribers
  FOR INSERT
  WITH CHECK (true);
