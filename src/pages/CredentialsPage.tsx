import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useCustomerProfile } from "@/hooks/useCustomerProfile";
import ProfileSummary from "@/components/Credentials/ProfileSummary";
import CredentialsForm, { CredentialsFormValues } from "@/components/Credentials/CredentialsForm";

export default function CredentialsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: sessionLoading } = useSession();
  const { profile, loading: loadingProfile } = useCustomerProfile();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!sessionLoading && !user) {
      navigate("/auth?role=customer");
    }
  }, [user, sessionLoading, navigate]);

  const handleSubmit = async (data: CredentialsFormValues) => {
    console.log('[Booking DEBUG] Starting booking submission');
    console.log('[Booking DEBUG] User:', { id: user?.id, typeof_user_id: typeof user?.id });
    console.log('[Booking DEBUG] Service ID param:', { raw_param_id: id, typeof_param_id: typeof id });

    if (!user || !user.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!id) {
      toast({
        title: "Invalid Service",
        description: "No service ID found.",
        variant: "destructive",
      });
      return;
    }

    // Keep service ID as string - it might be a UUID in the services table
    const serviceId = id;

    if (!data.fromDate || !data.toDate) {
      toast({
        title: "Date Required",
        description: "Please provide both dates.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Verify service exists - use original service ID (might be UUID)
      const { data: existingService, error: serviceError } = await supabase
        .from("services")
        .select("id, name")
        .eq("id", serviceId)
        .single();

      if (serviceError || !existingService) {
        console.error('[Service lookup error]:', serviceError);
        throw new Error("Service not found");
      }

      // Create booking with proper integer handling
      const bookingPayload = {
        created_by: user.id,
        service_id: serviceIdForBooking, // Use integer ID
        tentative_date: format(data.fromDate, "yyyy-MM-dd"),
        status: "pending",
        location: data.location,
        address: data.address,
      };

      console.log('[Booking DEBUG] Final insert payload:', bookingPayload);

      const { data: bookingResult, error: insertError } = await supabase
        .from("bookings")
        .insert([bookingPayload])
        .select('*')
        .single();

      if (insertError) {
        console.error('[BOOKING INSERT ERROR]:', insertError);
        throw insertError;
      }

      // Store booking in localStorage for cross-dashboard display
      const bookingDetails = {
        id: bookingResult.id,
        service_name: existingService.name,
        service_id: serviceIdNum,
        customer_name: profile?.name || user.email,
        customer_email: user.email,
        tentative_date: format(data.fromDate, "yyyy-MM-dd"),
        to_date: format(data.toDate, "yyyy-MM-dd"),
        location: data.location,
        address: data.address,
        status: "pending",
        created_at: new Date().toISOString(),
      };

      // Store in localStorage
      const existingBookings = JSON.parse(localStorage.getItem('recentBookings') || '[]');
      existingBookings.unshift(bookingDetails);
      // Keep only last 10 bookings
      localStorage.setItem('recentBookings', JSON.stringify(existingBookings.slice(0, 10)));

      toast({
        title: "Booking Submitted Successfully",
        description: (
          <div className="text-left">
            <div><b>Service:</b> {existingService.name}</div>
            <div><b>From:</b> {format(data.fromDate, "PPP")}</div>
            <div><b>To:</b> {format(data.toDate, "PPP")}</div>
            <div><b>Location:</b> {data.location}</div>
            <div><b>Address:</b> {data.address}</div>
          </div>
        ),
      });

      setTimeout(() => {
        navigate(`/product/${id}`);
      }, 1200);

    } catch (error: any) {
      console.error('[Booking submission error]:', error);
      toast({
        title: "Error submitting booking",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#f8ede8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8ede8] flex flex-col items-center justify-start py-10 px-2">
      <div className="bg-white max-w-xl w-full rounded-xl shadow p-8">
        <h1 className="text-2xl font-extrabold mb-6 text-orange-700 text-center">
          Select Dates &amp; Location
        </h1>
        <ProfileSummary profile={profile} loading={loadingProfile} />
        <CredentialsForm onSubmit={handleSubmit} loading={loading} serviceId={id} />
      </div>
    </div>
  );
}
