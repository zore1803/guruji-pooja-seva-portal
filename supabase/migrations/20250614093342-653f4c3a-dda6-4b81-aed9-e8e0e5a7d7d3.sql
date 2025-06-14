
-- 1. Create a PostgreSQL function to call the edge function using pg_net.
CREATE OR REPLACE FUNCTION public.notify_booking_participants()
RETURNS trigger AS $$
DECLARE
    request_id uuid;
    url text := 'https://oftrrhwbxmiwrtuzpzmu.supabase.co/functions/v1/send-booking-notification';
    body jsonb := jsonb_build_object(
      'booking_id', NEW.id::text
    );
BEGIN
    -- Requires pg_net extension enabled!
    SELECT
      net.http_post(
        url := url,
        headers := '{"Content-Type": "application/json"}',
        body := body
      )
    INTO request_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger on bookings AFTER INSERT
DROP TRIGGER IF EXISTS notify_booking_participants_trigger ON public.bookings;
CREATE TRIGGER notify_booking_participants_trigger
AFTER INSERT ON public.bookings
FOR EACH ROW
EXECUTE PROCEDURE public.notify_booking_participants();
