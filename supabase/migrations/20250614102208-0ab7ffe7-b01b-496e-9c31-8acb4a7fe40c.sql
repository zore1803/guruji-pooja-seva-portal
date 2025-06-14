
-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Customers can see their own bookings
CREATE POLICY "Customers can view their own bookings"
  ON public.bookings
  FOR SELECT
  USING (customer_id = auth.uid());

-- Customers can insert their own bookings
CREATE POLICY "Customers can create their own bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (customer_id = auth.uid());

-- Customers can update only their own pending bookings (if necessary in the future)
CREATE POLICY "Customers can update their own bookings"
  ON public.bookings
  FOR UPDATE
  USING (customer_id = auth.uid());
