
-- Drop existing problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;

-- Create a security definer function to get user role without recursion
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT user_type::text FROM public.profiles WHERE id = user_id;
$$;

-- Create new policies using the security definer function
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT 
  USING (
    public.get_user_role(auth.uid()) = 'admin' OR auth.uid() = id
  );

CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE 
  USING (
    public.get_user_role(auth.uid()) = 'admin' OR auth.uid() = id
  );

-- Also fix booking policies that might have similar issues
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;

CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT 
  USING (
    public.get_user_role(auth.uid()) = 'admin' OR 
    auth.uid() = created_by OR 
    auth.uid() = pandit_id
  );

CREATE POLICY "Admins can update all bookings" ON public.bookings
  FOR UPDATE 
  USING (
    public.get_user_role(auth.uid()) = 'admin' OR 
    auth.uid() = created_by OR 
    auth.uid() = pandit_id
  );
