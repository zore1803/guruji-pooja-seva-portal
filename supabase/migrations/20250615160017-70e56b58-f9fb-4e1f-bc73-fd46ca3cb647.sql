
-- Remove pandit_id column from bookings table
ALTER TABLE public.bookings DROP COLUMN IF EXISTS pandit_id;
