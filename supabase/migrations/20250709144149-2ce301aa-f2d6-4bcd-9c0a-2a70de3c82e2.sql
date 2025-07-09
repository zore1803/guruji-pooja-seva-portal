
-- First, let's create separate profile tables for customers and pandits to avoid conflicts
CREATE TABLE public.customer_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  state text,
  city text,
  profile_image_url text,
  is_verified boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.pandit_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  expertise text,
  address text,
  aadhar_number text,
  state text,
  work_locations text[] DEFAULT '{}',
  profile_image_url text,
  is_verified boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandit_profiles ENABLE ROW LEVEL SECURITY;

-- Customer profiles policies
CREATE POLICY "Users can view own customer profile" ON public.customer_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own customer profile" ON public.customer_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own customer profile" ON public.customer_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Pandit profiles policies
CREATE POLICY "Users can view own pandit profile" ON public.pandit_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own pandit profile" ON public.pandit_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own pandit profile" ON public.pandit_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin policies for both tables
CREATE POLICY "Admins can view all customer profiles" ON public.customer_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can view all pandit profiles" ON public.pandit_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Update the bookings table to reference the correct profile tables
ALTER TABLE public.bookings ADD COLUMN customer_name text;
ALTER TABLE public.bookings ADD COLUMN customer_phone text;
ALTER TABLE public.bookings ADD COLUMN customer_email text;

-- Create a better function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS trigger AS $$
BEGIN
  -- Create basic profile entry
  INSERT INTO public.profiles (id, name, email, user_type, profile_image_url, is_verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email_confirmed_at IS NOT NULL AND NEW.email IS NOT NULL AND NEW.email != '' AND NEW.email LIKE '%@%' AND SUBSTRING(NEW.email FROM 1 FOR POSITION('@' IN NEW.email) - 1) OR ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer')::user_type,
    COALESCE(NEW.raw_user_meta_data->>'profile_image_url', ''),
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
  );

  -- Create specific profile based on user type
  IF COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer') = 'customer' THEN
    INSERT INTO public.customer_profiles (
      id, name, email, phone, address, state, profile_image_url, is_verified
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', ''),
      COALESCE(NEW.email, ''),
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      COALESCE(NEW.raw_user_meta_data->>'address', ''),
      COALESCE(NEW.raw_user_meta_data->>'state', ''),
      COALESCE(NEW.raw_user_meta_data->>'profile_image_url', ''),
      COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
    );
  ELSIF COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer') = 'pandit' THEN
    INSERT INTO public.pandit_profiles (
      id, name, email, phone, expertise, address, aadhar_number, state, work_locations, profile_image_url, is_verified
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', ''),
      COALESCE(NEW.email, ''),
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      COALESCE(NEW.raw_user_meta_data->>'expertise', ''),
      COALESCE(NEW.raw_user_meta_data->>'address', ''),
      COALESCE(NEW.raw_user_meta_data->>'aadhar_number', ''),
      COALESCE(NEW.raw_user_meta_data->>'state', ''),
      COALESCE(
        CASE 
          WHEN NEW.raw_user_meta_data->>'work_locations' IS NOT NULL 
          THEN ARRAY(SELECT json_array_elements_text((NEW.raw_user_meta_data->>'work_locations')::json))
          ELSE '{}'::text[]
        END, 
        '{}'::text[]
      ),
      COALESCE(NEW.raw_user_meta_data->>'profile_image_url', ''),
      COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
    );
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Replace the existing trigger
DROP TRIGGER IF EXISTS handle_new_user_profile ON auth.users;
CREATE TRIGGER handle_new_user_registration
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_registration();

-- Update bookings policies to work with the new structure
DROP POLICY IF EXISTS "Customers can insert bookings" ON public.bookings;
CREATE POLICY "Customers can insert bookings" ON public.bookings
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (SELECT 1 FROM public.customer_profiles WHERE id = auth.uid())
  );
