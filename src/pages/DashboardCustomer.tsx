
import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import EditCustomerProfileModal from "@/components/EditCustomerProfileModal";
import { LogOut, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { format } from "date-fns";

// Define booking display type
type Booking = {
  id: string;
  service_id: number | null;
  tentative_date: string | null;
  status: string | null;
  invoice_url: string | null;
  created_at: string;
  // No customer_id field
};

export default function DashboardCustomer() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth?role=customer");
      return;
    }
    let isMounted = true;
    // Avoid infinite recursion by not assigning type to data directly
    async function fetchProfile() {
      let tries = 0;
      while (tries < 5) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (data) {
          if (isMounted) setProfile(data as any);
          return;
        }
        await new Promise(res => setTimeout(res, 400));
        tries += 1;
      }
      if (isMounted) setProfile(null);
    }
    fetchProfile();
    return () => { isMounted = false; };
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    setLoadingBookings(true);
    supabase
      .from("bookings")
      .select("*, services:service_id (*), assigned_pandit:pandit_id (*)")
      .eq("created_by", user.id)
      .in("status", ["pending", "assigned", "confirmed", "completed"])
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (Array.isArray(data)) {
          const mapped = data.map((row: any) => ({
            ...row,
            service: row.services,
            assigned_pandit: row.assigned_pandit,
          }));
          setBookings(mapped);
        } else {
          setBookings([]);
        }
        setLoadingBookings(false);
      });
  }, [user]);

  const handleProfileUpdated = (updated: any) => {
    setProfile(updated);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
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
      <div className="w-[190px] flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-2">
          <AvatarImage src={profile.profile_image_url} alt={profile.name} />
          <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="font-semibold">{profile.name}</span>
        <span className="text-xs text-gray-500">Customer</span>
        <div className="mt-4 flex w-full flex-col gap-2">
          <Button onClick={() => setOpenEditModal(true)} variant="outline" className="w-full flex items-center gap-2">
            <Edit className="w-4 h-4" /> Edit Profile
          </Button>
          <Button onClick={handleLogout} variant="destructive" className="w-full flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>
      <div className="flex-1 w-full">
        <h1 className="text-2xl font-bold mb-2">Customer Dashboard</h1>
        <p>Browse and book pooja services below, or manage your bookings.</p>
        <div className="flex justify-start my-4">
          <Button
            variant="default"
            onClick={() => navigate("/services")}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow"
          >
            Book Now
          </Button>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Your Bookings</h2>
          {loadingBookings ? (
            <div className="text-muted-foreground">Loading your bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-muted-foreground">No bookings found.</div>
          ) : (
            <Table>
              <TableCaption>Your booking history and current requests</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Pandit</TableHead>
                  <TableHead>Requested At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => {
                  let location = b.location || "-";
                  let address = b.address || "-";
                  
                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case "pending": return "bg-orange-100 text-orange-800";
                      case "assigned": return "bg-blue-100 text-blue-800";
                      case "confirmed": return "bg-green-100 text-green-800";
                      case "completed": return "bg-purple-100 text-purple-800";
                      case "cancelled": return "bg-red-100 text-red-800";
                      default: return "bg-gray-100 text-gray-800";
                    }
                  };

                  return (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">
                        {b.service?.name || "Unknown Service"}
                      </TableCell>
                      <TableCell>
                        {b.tentative_date ? format(new Date(b.tentative_date), "PPP") : "--"}
                      </TableCell>
                      <TableCell>{location}</TableCell>
                      <TableCell>{address}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(b.status || "pending")}`}>
                          {b.status?.charAt(0).toUpperCase() + b.status?.slice(1) || "Pending"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {b.assigned_pandit ? (
                          <div className="text-sm">
                            <div className="font-medium">{b.assigned_pandit.name}</div>
                            <div className="text-gray-500 text-xs">{b.assigned_pandit.expertise || "Pandit"}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {b.created_at ? format(new Date(b.created_at), "PPp") : "--"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      <EditCustomerProfileModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        profile={profile}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
}
