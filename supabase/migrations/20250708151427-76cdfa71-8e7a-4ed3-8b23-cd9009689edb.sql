-- Add work_locations column to profiles table for pandits
ALTER TABLE public.profiles 
ADD COLUMN work_locations TEXT[];

-- Create index for better performance on work_locations queries
CREATE INDEX idx_profiles_work_locations ON public.profiles USING GIN(work_locations);

-- Update existing RLS policies to include work_locations in profile updates
-- The existing policies already allow users to update their own profiles