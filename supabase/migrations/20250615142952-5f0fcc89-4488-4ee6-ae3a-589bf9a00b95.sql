
-- Drop policies if any exist (ignore errors if table already gone)
DROP POLICY IF EXISTS "User can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "User can create own bookings" ON public.bookings;
DROP POLICY IF EXISTS "User can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customers can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customers can create their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customers can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customer can create booking" ON public.bookings;
DROP POLICY IF EXISTS "Customer sees own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Update own booking" ON public.bookings;

-- Drop the table if it exists
DROP TABLE IF EXISTS public.bookings CASCADE;

-- Create bookings table WITHOUT customer_id, use created_by for ownership
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL DEFAULT auth.uid(), -- auto-populate from logged-in user
  pandit_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  service_id INTEGER REFERENCES services(id),
  tentative_date DATE,
  confirmed_date DATE,
  status TEXT DEFAULT 'pending',  -- 'pending','confirmed','completed','cancelled'
  invoice_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Only the owner can see/select
CREATE POLICY "User can view own bookings"
  ON public.bookings
  FOR SELECT
  USING (created_by = auth.uid());

-- Only the owner can insert
CREATE POLICY "User can create own bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Only the owner can update
CREATE POLICY "User can update own bookings"
  ON public.bookings
  FOR UPDATE
  USING (created_by = auth.uid());

-- No one can delete (add if you want)

-- Existing function for auto-creating profiles (do not touch)
create or replace function public.handle_new_user_profile()
returns trigger as $$
begin
  if not exists (select 1 from public.profiles where id = new.id) then
    insert into public.profiles (id, name, email, user_type, profile_image_url, is_verified)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'name', ''),
      coalesce(new.email, ''),
      coalesce(new.raw_user_meta_data->>'user_type', 'customer'),
      coalesce(new.raw_user_meta_data->>'profile_image_url', ''),
      false
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists handle_new_user_profile on auth.users;
create trigger handle_new_user_profile
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user_profile();

