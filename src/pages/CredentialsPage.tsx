
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
      // Convert service ID to integer for database lookup
      const serviceIdAsNumber = parseInt(id, 10);
      if (isNaN(serviceIdAsNumber)) {
        throw new Error("Invalid service ID");
      }

      // Verify service exists using integer ID
      const { data: existingService, error: serviceError } = await supabase
        .from("services")
        .select("id, name")
        .eq("id", serviceIdAsNumber)
        .single();

      if (serviceError || !existingService) {
        console.error('[Service lookup error]:', serviceError);
        throw new Error("Service not found");
      }

      // Create booking with customer details from profile
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          service_id: serviceIdAsNumber,
          tentative_date: format(data.fromDate, "yyyy-MM-dd"),
          created_by: user.id,
          address: data.address,
          location: `${data.city}, ${data.state}`,
          status: "pending",
          customer_name: profile?.name || user.email?.split('@')[0] || 'User',
          customer_email: user.email || '',
          customer_phone: profile?.phone || ''
        })
        .select()
        .single();

      if (bookingError) {
        console.error('[Booking creation error]:', bookingError);
        throw new Error("Failed to create booking");
      }

      console.log('[Booking DEBUG] Saved to Supabase successfully', booking);

      toast({
        title: "🕉️ Sacred Booking Confirmed",
        description: (
          <div className="text-left space-y-1">
            <div><b>Service:</b> {existingService.name}</div>
            <div><b>Date:</b> {format(data.fromDate, "PPP")}</div>
            <div><b>Location:</b> {data.city}, {data.state}</div>
            <div><b>Address:</b> {data.address}</div>
            <div className="text-sm text-green-600 mt-2">✨ Your request has been sent to available pandits in your area</div>
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
    <>
      <ProfileSummary profile={profile} loading={loadingProfile} />
      <CredentialsForm onSubmit={handleSubmit} loading={loading} serviceId={id} />
    </>
  );
}
