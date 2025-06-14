
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
    supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
      setProfile(data);
    });
  }, [user, navigate]);

  // Fetch pending bookings for this customer
  useEffect(() => {
    if (!user) return;
    setLoadingBookings(true);
    supabase
      .from("bookings")
      .select("*")
      .eq("customer_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        setBookings(data || []);
        setLoadingBookings(false);
      });
  }, [user]);

  // Refetch profile after update
  const handleProfileUpdated = (updated: any) => {
    setProfile(updated);
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (!user || !profile) {
    return <div className="flex items-center justify-center py-10">Loading...</div>;
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
        <p>Browse and book pooja services below, or manage your upcoming bookings.</p>
        {/* Pending Bookings List */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Pending Bookings</h2>
          {loadingBookings ? (
            <div className="text-muted-foreground">Loading your bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-muted-foreground">No pending bookings found.</div>
          ) : (
            <Table>
              <TableCaption>Pending bookings you have requested</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Dates</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => {
                  let location = "-";
                  let address = "-";
                  if (b.invoice_url) {
                    try {
                      const parsed = JSON.parse(b.invoice_url);
                      location = parsed.location || "-";
                      address = parsed.address || "-";
                    } catch {}
                  }
                  return (
                    <TableRow key={b.id}>
                      <TableCell>
                        {b.tentative_date ? format(new Date(b.tentative_date), "PPP") : "--"}
                      </TableCell>
                      <TableCell>{location}</TableCell>
                      <TableCell>{address}</TableCell>
                      <TableCell>
                        <span className="inline-block px-2 rounded bg-orange-100 text-orange-800">{b.status === "pending" ? "Booking Pending" : b.status}</span>
                      </TableCell>
                      <TableCell>
                        {b.created_at ? format(new Date(b.created_at), "PPPp") : "--"}
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
