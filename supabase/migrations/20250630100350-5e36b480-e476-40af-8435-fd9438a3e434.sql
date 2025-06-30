
-- Update bookings table to better support the workflow
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS pandit_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS admin_notes text,
ADD COLUMN IF NOT EXISTS assigned_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS completed_at timestamp with time zone;

-- Create admin-specific policies
CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update all bookings" ON public.bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Create policy for pandits to see their assigned bookings
CREATE POLICY "Pandits can view assigned bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = pandit_id);

CREATE POLICY "Pandits can update assigned bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = pandit_id);

-- Create policy for customers to see their own bookings
CREATE POLICY "Customers can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = created_by);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Allow admins to update profiles (for verification, etc.)
CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );
