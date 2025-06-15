
-- Add address and location columns to bookings
ALTER TABLE public.bookings ADD COLUMN address TEXT;
ALTER TABLE public.bookings ADD COLUMN location TEXT;
