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
  const { user } = useSession();
  const { profile, loading: loadingProfile } = useCustomerProfile();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: CredentialsFormValues) => {
    if (!user || !user.id) {
      toast({
        title: "You must be logged in!",
        description: "Please log in to proceed.",
      });
      return;
    }

    // Add debugging logs for user.id and id params
    console.log('SUBMIT booking:', {
      param_id: id,
      user_id: user.id,
      typeof_user_id: typeof user.id,
    });

    // Validate that id is a number (service_id)
    if (!id || isNaN(Number(id))) {
      toast({
        title: "Invalid Service",
        description: "No valid service ID found.",
      });
      return;
    }

    // Validate that user.id is a proper uuid string (basic check: 36 chars, 4 hyphens)
    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(user.id);
    if (!isUUID) {
      toast({
        title: "Invalid Session",
        description: "Session user ID is not valid. Please logout and login again.",
      });
      return;
    }

    if (!data.fromDate || !data.toDate) {
      toast({
        title: "Date Required",
        description: "Please provide both dates.",
      });
      return;
    }
    setLoading(true);

    const { data: existingService, error: serviceError } = await supabase
      .from("services")
      .select("id")
      .eq("id", Number(id))
      .maybeSingle();

    if (serviceError || !existingService) {
      setLoading(false);
      toast({
        title: "Service Not Found",
        description: "The selected service does not exist.",
      });
      return;
    }

    // More detailed log before insert
    console.log("Inserting booking with:", {
      service_id: Number(id),
      customer_id: user.id,
      tentative_date: format(data.fromDate, "yyyy-MM-dd"),
      status: "pending",
      invoice_url: { location: data.location, address: data.address }
    });

    const { error } = await supabase.from("bookings").insert([
      {
        service_id: Number(id),
        customer_id: user.id,
        tentative_date: format(data.fromDate, "yyyy-MM-dd"),
        status: "pending",
        invoice_url: JSON.stringify({
          location: data.location,
          address: data.address,
        }),
      },
    ]);
    setLoading(false);
    if (error) {
      toast({
        title: "Error submitting booking.",
        description: error.message,
      });
      // Log the error for debugging
      console.log('BOOKING INSERT ERROR:', error);
      return;
    }
    toast({
      title: "Credentials Submitted",
      description: (
        <div className="text-left">
          <div>
            <b>From:</b> {data.fromDate ? format(data.fromDate, "PPP") : "--"}
          </div>
          <div>
            <b>To:</b> {data.toDate ? format(data.toDate, "PPP") : "--"}
          </div>
          <div>
            <b>Location:</b> {data.location}
          </div>
          <div>
            <b>Address:</b> {data.address}
          </div>
        </div>
      ),
    });
    setTimeout(() => {
      navigate(`/product/${id}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f8ede8] flex flex-col items-center justify-start py-10 px-2">
      <div className="bg-white max-w-xl w-full rounded-xl shadow p-8">
        <h1 className="text-2xl font-extrabold mb-6 text-orange-700 text-center">
          Select Dates &amp; Location
        </h1>
        <ProfileSummary profile={profile} loading={loadingProfile} />
        {/* Pass serviceId prop */}
        <CredentialsForm onSubmit={handleSubmit} loading={loading} serviceId={id} />
      </div>
    </div>
  );
}
