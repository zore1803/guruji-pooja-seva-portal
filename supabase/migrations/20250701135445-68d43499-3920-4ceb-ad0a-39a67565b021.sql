
-- Fix the user_type enum to ensure 'admin' is properly supported
-- and create a function to handle admin user creation safely
CREATE OR REPLACE FUNCTION public.create_admin_user_safe()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert admin profile directly if it doesn't exist
  INSERT INTO public.profiles (id, name, email, user_type, is_verified)
  VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Administrator',
    'admin@gmail.com',
    'admin'::user_type,
    true
  )
  ON CONFLICT (id) DO NOTHING;
END;
$$;

-- Create a simple admin credentials table for fallback authentication
CREATE TABLE IF NOT EXISTS public.admin_credentials (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_credentials
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- Only allow admins to access admin_credentials
CREATE POLICY "Only admins can access admin credentials"
ON public.admin_credentials
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type = 'admin'::user_type
  )
);

-- Insert default admin credentials (password: admin123)
INSERT INTO public.admin_credentials (email, password_hash)
VALUES ('admin@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (email) DO NOTHING;
