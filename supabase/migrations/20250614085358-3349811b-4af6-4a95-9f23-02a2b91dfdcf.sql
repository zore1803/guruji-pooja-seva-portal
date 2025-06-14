
-- Enforce secure RLS: Only allow users to insert their own profile
-- Remove any weaker "public" insert policy if you added it above

-- Drop previous permissive policy, if it exists
DROP POLICY IF EXISTS "Enable insert for all users" ON public.profiles;
DROP POLICY IF EXISTS "public insert" ON public.profiles;

-- Secure INSERT policy (recommended)
CREATE POLICY "User can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
