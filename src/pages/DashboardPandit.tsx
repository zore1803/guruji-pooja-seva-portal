import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X, LogOut, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import EditPanditProfileModal from "@/components/EditPanditProfileModal";
import PanditCompletedPoojasTable from "@/components/PanditCompletedPoojasTable";
import CopyToClipboardButton from "@/components/CopyToClipboardButton";

type Profile = {
  id: string;
  name: string;
  email: string;
  user_type: string;
  profile_image_url?: string | null;
  expertise?: string | null;
  address?: string | null;
};

type Service = {
  id: number;
  name: string;
  description: string;
};

type Booking = {
  id: string;
  // removed pandit_id
  service_id: number;
  tentative_date: string | null;
  status: string;
  customer_profile?: Profile | null;
  service?: Service | null;
};

type Payment = {
  id: string;
  booking_id: string;
  amount: number;
  status: string;
};

export default function DashboardPandit() {
  const { user } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [acceptedCount, setAcceptedCount] = useState<number>(0);
  const [earnings, setEarnings] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  // Fetch Pandit Profile
  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    async function fetchProfile() {
      let tries = 0;
      while (tries < 5) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (data) {
          if (isMounted) setProfile(data);
          return;
        }
        await new Promise(res => setTimeout(res, 400));
        tries += 1;
      }
      if (isMounted) setProfile(null);
    }
    fetchProfile();
    return () => { isMounted = false; };
  }, [user]);

  // Fetch summary (accepted bookings + earnings)
  useEffect(() => {
    if (!user) return;
    async function fetchInfo() {
      // Count accepted bookings assigned to this pandit
      const { data: acceptedBookings } = await supabase
        .from("bookings")
        .select("*")
        .eq("pandit_id", user.id)
        .eq("status", "confirmed");
      
      setAcceptedCount(acceptedBookings?.length || 0);
      
      // Fetch earnings - this should be calculated from completed bookings
      const { data: completedBookings } = await supabase
        .from("bookings")
        .select("*, services!inner(*)")
        .eq("pandit_id", user.id)
        .eq("status", "completed");
      
      let earningTotal = 0;
      if (completedBookings && Array.isArray(completedBookings)) {
        earningTotal = completedBookings.reduce((sum, booking: any) => {
          return sum + (booking.services?.price || 0);
        }, 0);
      }
      setEarnings(earningTotal);
    }
    fetchInfo();
  }, [user, updatingId]);

  // Fetch pending bookings assigned to this pandit
  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      setLoading(true);

      // Fetch bookings assigned to this pandit
      const { data: bookingsData, error } = await supabase
        .from("bookings")
        .select("*, profiles:created_by (*), services:service_id (*)")
        .eq("pandit_id", user.id)
        .in("status", ["assigned", "pending"])
        .order("created_at", { ascending: false });

      if (error) {
        setPendingBookings([]);
        setLoading(false);
        return;
      }

      const mapped = bookingsData.map((row: any) => ({
        id: row.id,
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

  // Accept/Reject - update booking status
  const handleBookingAction = async (bookingId: string, action: "accept" | "reject") => {
    setUpdatingId(bookingId);
    const newStatus = action === "accept" ? "confirmed" : "cancelled";
    
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", bookingId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Booking ${action}ed successfully`,
      });
    }
    
    setUpdatingId(null);
    
    // Refresh the bookings list
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleProfileUpdated = (updated: Profile) => {
    setProfile(updated);
    toast({ title: "Profile updated" });
  };

  if (!user) {
    return <div className="flex items-center justify-center py-10">Loading...</div>;
  }
  if (!profile) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-500 animate-pulse">
        Creating your profile...
      </div>
    );
  }

  return (
    <div className="pt-8 px-5 flex-col md:flex-row flex items-start gap-8">
      <div className="w-[210px] flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-2">
          <AvatarImage src={profile.profile_image_url || undefined} alt={profile.name} />
          <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="font-semibold">{profile.name}</span>
        <span className="text-xs text-gray-500">Pandit</span>
        <div className="flex items-center gap-1 mt-2">
          <span className="text-[11px] text-gray-400 font-mono select-all">UUID: {profile.id}</span>
          <CopyToClipboardButton value={profile.id} />
        </div>
        <div className="mt-4 flex w-full flex-col gap-2">
          <Button onClick={() => setOpenEditModal(true)} variant="outline" className="w-full flex items-center gap-2">
            <Edit className="w-4 h-4" /> Edit Profile
          </Button>
          <Button onClick={handleLogout} variant="destructive" className="w-full flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>
      <div className="flex-1 max-w-3xl">
        <h1 className="text-2xl font-bold mb-2">Pandit Dashboard</h1>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-col bg-green-50 border border-green-200 rounded-lg px-4 py-3 w-[175px] items-start justify-center shadow">
            <span className="text-xs font-medium text-green-950 mb-1">Accepted Poojas</span>
            <span className="text-2xl font-bold text-green-700">{acceptedCount}</span>
          </div>
          <div className="flex flex-col bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 w-[175px] items-start justify-center shadow">
            <span className="text-xs font-medium text-blue-950 mb-1">Earnings</span>
            <span className="text-2xl font-bold text-blue-700">₹{earnings}</span>
          </div>
        </div>
        <p className="mb-4">Manage your assigned pooja booking requests below.</p>
        {loading ? (
          <div className="py-6">Fetching bookings...</div>
        ) : (
          <>
            {pendingBookings.length === 0 ? (
              <div className="text-gray-500 mt-8">
                No pending booking requests assigned to you.
              </div>
            ) : (
              <div className="space-y-5">
                {pendingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-lg border p-4 flex items-center gap-5 shadow-sm bg-white"
                  >
                    <Avatar>
                      <AvatarImage
                        src={
                          booking.customer_profile?.profile_image_url || undefined
                        }
                        alt={
                          booking.customer_profile?.name || "Customer"
                        }
                      />
                      <AvatarFallback>
                        {booking.customer_profile?.name
                          ?.charAt(0)
                          ?.toUpperCase() ?? "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-base font-semibold">
                        {booking.customer_profile?.name}
                      </div>
                      <div className="text-sm text-gray-500 mb-1">
                        {booking.customer_profile?.email}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Service:</span>{" "}
                        {booking.service?.name || "Unknown Service"}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Date:</span>{" "}
                        {booking.tentative_date ? format(new Date(booking.tentative_date), "PPP") : (
                          <span className="italic text-gray-400">
                            Not specified
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-orange-700 mt-1">
                        Status: {booking.status === "assigned" ? "Assigned to you" : "Pending"}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[110px]">
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={updatingId === booking.id}
                        onClick={() =>
                          handleBookingAction(booking.id, "accept")
                        }
                      >
                        <Check className="mr-1 h-4 w-4" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={updatingId === booking.id}
                        onClick={() =>
                          handleBookingAction(booking.id, "reject")
                        }
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
        <PanditCompletedPoojasTable panditId={user.id} />

        <EditPanditProfileModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          profile={profile}
          onProfileUpdated={handleProfileUpdated}
        />
      </div>
    </div>
  );
}
