
-- 1. User Roles Enum
CREATE TYPE public.user_type AS ENUM ('pandit', 'customer');

-- 2. Users Table (auth users already exists, so we use profiles for details)
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    user_type public.user_type NOT NULL,
    profile_image_url TEXT, -- stores uploaded image URL (via storage)
    is_verified BOOLEAN DEFAULT FALSE,
    aadhar_number TEXT,        -- Extra verification for Pandit
    expertise TEXT,            -- Pandit expertise
    address TEXT,              -- Address (optional)
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Services Table (poojas etc)
CREATE TABLE public.services (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL, -- price in INR paise
    image TEXT,             -- display image URL (optional)
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Booking Table (customer selects service+date, assigned to Pandit)
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pandit_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    service_id INTEGER REFERENCES services(id),
    tentative_date DATE,
    confirmed_date DATE,
    status TEXT DEFAULT 'pending', -- 'pending','confirmed','completed','cancelled'
    invoice_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Payments Table
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER,
    method TEXT,              -- e.g., 'upi', 'credit_card'
    status TEXT DEFAULT 'pending',    -- 'pending','paid','failed'
    transaction_id TEXT,      -- payment gateway id
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Enable RLS for all relevant tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 7. POLICIES
-- Profiles: only the user can select/modify their own profile
CREATE POLICY "User can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "User can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Bookings: customer and pandit can access their relevant bookings
CREATE POLICY "Customer sees own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Pandit sees assigned bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = pandit_id);

-- Payments: customer can see own payments
CREATE POLICY "Customer sees payment" ON public.payments
  FOR SELECT USING (auth.uid() = customer_id);

-- Allow customer to insert booking
CREATE POLICY "Customer can create booking" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Allow insert payment by customer
CREATE POLICY "Allow customers to create payment" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Allow customers to update their own payment status (e.g. after UPI paid)
CREATE POLICY "Update own payment" ON public.payments
  FOR UPDATE USING (auth.uid() = customer_id);

-- Allow customer to update their booking
CREATE POLICY "Update own booking" ON public.bookings
  FOR UPDATE USING (auth.uid() = customer_id);

-- 8. Storage: Avatar/profile images (public bucket, with permissive policies)
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
