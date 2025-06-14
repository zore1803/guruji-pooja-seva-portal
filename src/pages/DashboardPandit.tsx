
import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

type Profile = {
  id: string;
  name: string;
  email: string;
  user_type: string;
  profile_image_url?: string | null;
};

type Service = {
  id: number;
  name: string;
  description: string;
};

type Booking = {
  id: string;
  customer_id: string;
  service_id: number;
  tentative_date: string | null;
  status: string;
  customer_profile?: Profile | null;
  service?: Service | null;
};

export default function DashboardPandit() {
  const { user } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch Pandit Profile
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
      setProfile(data);
    });
  }, [user]);

  // Fetch pending bookings assigned to this pandit (status: pending)
  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      setLoading(true);

      // Get all bookings for this pandit with status=pending
      const { data: bookingsData, error } = await supabase
        .from("bookings")
        .select("*, profiles:customer_id (*), services:service_id (*)")
        .eq("pandit_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        setPendingBookings([]);
        setLoading(false);
        return;
      }

      // Remap results to add customer_profile and service objects
      const mapped = bookingsData.map((row: any) => ({
        id: row.id,
        customer_id: row.customer_id,
        service_id: row.service_id,
        tentative_date: row.tentative_date,
        status: row.status,
        customer_profile: row.profiles,
        service: row.services,
      })) as Booking[];

      setPendingBookings(mapped);
      setLoading(false);
    };

    fetchBookings();
  }, [user, updatingId]);

  // Handle Accept/Reject actions on a booking
  const handleBookingAction = async (bookingId: string, action: "accept" | "reject") => {
    setUpdatingId(bookingId);
    await supabase
      .from("bookings")
      .update({ status: action === "accept" ? "confirmed" : "cancelled" })
      .eq("id", bookingId);
    setUpdatingId(null); // triggers refetch
  };

  if (!user || !profile) {
    return <div className="flex items-center justify-center py-10">Loading...</div>;
  }

  return (
    <div className="pt-8 px-5 flex-col md:flex-row flex items-start gap-8">
      <div className="w-[190px] flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-2">
          <AvatarImage src={profile.profile_image_url || undefined} alt={profile.name} />
          <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="font-semibold">{profile.name}</span>
        <span className="text-xs text-gray-500">Pandit</span>
      </div>
      <div className="flex-1 max-w-3xl">
        <h1 className="text-2xl font-bold mb-2">Pandit Dashboard</h1>
        <p className="mb-4">Manage your pooja booking requests below.</p>
        {loading ? (
          <div className="py-6">Fetching bookings...</div>
        ) : (
          <>
            {pendingBookings.length === 0 ? (
              <div className="text-gray-500 mt-8">No pending booking requests assigned to you.</div>
            ) : (
              <div className="space-y-5">
                {pendingBookings.map(booking => (
                  <div key={booking.id} className="rounded-lg border p-4 flex items-center gap-5 shadow-sm bg-white">
                    {/* Customer Avatar and name */}
                    <Avatar>
                      <AvatarImage src={booking.customer_profile?.profile_image_url || undefined} alt={booking.customer_profile?.name || "Customer"} />
                      <AvatarFallback>{booking.customer_profile?.name?.charAt(0)?.toUpperCase() ?? "C"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-base font-semibold">{booking.customer_profile?.name}</div>
                      <div className="text-sm text-gray-500 mb-1">{booking.customer_profile?.email}</div>
                      <div className="text-sm">
                        <span className="font-medium">Service:</span> {booking.service?.name || "Unknown Service"}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Date:</span>{" "}
                        {booking.tentative_date || <span className="italic text-gray-400">Not specified</span>}
                      </div>
                      <div className="text-xs text-orange-700 mt-1">{/* Show error or status if needed */}</div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[110px]">
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={updatingId === booking.id}
                        onClick={() => handleBookingAction(booking.id, "accept")}
                      >
                        <Check className="mr-1 h-4 w-4" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={updatingId === booking.id}
                        onClick={() => handleBookingAction(booking.id, "reject")}
                      >
                        <X className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
