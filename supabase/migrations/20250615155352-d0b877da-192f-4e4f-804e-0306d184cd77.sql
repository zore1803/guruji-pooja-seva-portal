
-- 1. Add created_by column, defaulting to current user's id
ALTER TABLE public.bookings ADD COLUMN created_by UUID NOT NULL DEFAULT auth.uid();

-- 2. If you have existing rows that should be assigned to a customer, you may want to backfill created_by from customer_id if data exists
UPDATE public.bookings SET created_by = customer_id WHERE customer_id IS NOT NULL;

-- 3. You may now safely DROP customer_id if it is not needed anymore (remove this line if you want to keep it)
ALTER TABLE public.bookings DROP COLUMN customer_id;

-- 4. Enable RLS if not already enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 5. Policy: Only owner can view bookings
CREATE POLICY "Only owner can view bookings"
  ON public.bookings
  FOR SELECT
  USING (created_by = auth.uid());

-- 6. Policy: Only owner can insert bookings
CREATE POLICY "Only owner can insert bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- 7. Policy: Only owner can update bookings
CREATE POLICY "Only owner can update bookings"
  ON public.bookings
  FOR UPDATE
  USING (created_by = auth.uid());

-- 8. (Optional) Allow users to delete their own bookings
-- CREATE POLICY "Only owner can delete bookings"
--   ON public.bookings
--   FOR DELETE
--   USING (created_by = auth.uid());
