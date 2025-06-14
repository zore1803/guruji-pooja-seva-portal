
-- Allow users to insert their *own* profile row during signup
CREATE POLICY "User can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
