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

type Booking = {
  id: string;
  service_id: number | null;
  tentative_date: string | null;
  status: string | null;
  invoice_url: string | null;
  created_at: string;
  location: string | null;
  address: string | null;
  service?: { name: string } | null;
  assigned_pandit?: { name: string; expertise?: string } | null;
};

type LocalStorageBooking = {
  id: string;
  service_name: string;
  service_id: number;
  customer_name: string;
  customer_email: string;
  tentative_date: string;
  to_date: string;
  location: string;
  address: string;
  status: string;
  created_at: string;
};

export default function DashboardCustomer() {
  const { user, loading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [localBookings, setLocalBookings] = useState<LocalStorageBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // Handle authentication state changes
  useEffect(() => {
    // Don't do anything while session is still loading
    if (sessionLoading) return;
    
    // If no user after session loading is complete, redirect to auth
    if (!user) {
      navigate("/auth?role=customer", { replace: true });
      return;
    }

    // User is authenticated, proceed with loading profile and data
    setInitialLoad(false);
  }, [user, sessionLoading, navigate]);

  // Load profile when user is confirmed
  useEffect(() => {
    if (sessionLoading || !user || initialLoad) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile(data);
        } else if (!error || error.code === 'PGRST116') {
          // Create profile if it doesn't exist
          const { data: newProfile } = await supabase
            .from("profiles")
            .insert([{
              id: user.id,
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
              email: user.email || '',
              user_type: 'customer',
              is_verified: false
            }])
            .select()
            .single();

          if (newProfile) {
            setProfile(newProfile);
          }
        }
      } catch (error) {
        console.error('Profile load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, sessionLoading, initialLoad]);

  // Load bookings when user and profile are ready
  useEffect(() => {
    if (sessionLoading || !user || initialLoad) return;
    
    const loadBookings = async () => {
      try {
        const { data } = await supabase
          .from("bookings")
          .select("*, services:service_id (*), assigned_pandit:pandit_id (*)")
          .eq("created_by", user.id)
          .order("created_at", { ascending: false });

        if (data) {
          const mapped = data.map((row: any) => ({
            id: row.id,
            service_id: row.service_id,
            tentative_date: row.tentative_date,
            status: row.status,
            invoice_url: row.invoice_url,
            created_at: row.created_at,
            location: row.location,
            address: row.address,
            service: row.services,
            assigned_pandit: row.assigned_pandit,
          }));
          setBookings(mapped);
        }
      } catch (error) {
        console.error('Booking load error:', error);
      }
    };

    // Load localStorage bookings for this user
    const loadLocalBookings = () => {
      try {
        const stored = localStorage.getItem('recentBookings');
        if (stored) {
          const parsed = JSON.parse(stored);
          const userBookings = parsed.filter((booking: LocalStorageBooking) => 
            booking.customer_email === user.email
          );
          setLocalBookings(userBookings);
        }
      } catch (error) {
        console.error('Error loading local bookings:', error);
      }
    };

    loadBookings();
    loadLocalBookings();
  }, [user, sessionLoading, initialLoad]);

  const handleProfileUpdated = (updated: any) => {
    setProfile(updated);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate("/", { replace: true });
    }
  };

  // Show loading while session is loading or during initial load
  if (sessionLoading || initialLoad || loading) {
    return (
      <div className="min-h-screen bg-[#f8ede8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  const allBookings = [...bookings, ...localBookings.map(lb => ({
    id: lb.id,
    service_id: lb.service_id,
    tentative_date: lb.tentative_date,
    status: lb.status,
    invoice_url: null,
    created_at: lb.created_at,
    location: lb.location,
    address: lb.address,
    service: { name: lb.service_name },
    assigned_pandit: null,
  }))];

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
    <div className="pt-8 px-5 flex-col md:flex-row flex items-start gap-8">
      <div className="w-[190px] flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-2">
          <AvatarImage src={profile?.profile_image_url} alt={profile?.name} />
          <AvatarFallback>{profile?.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <span className="font-semibold">{profile?.name || 'User'}</span>
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
          {allBookings.length === 0 ? (
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
                {allBookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">
                      {b.service?.name || "Unknown Service"}
                    </TableCell>
                    <TableCell>
                      {b.tentative_date ? format(new Date(b.tentative_date), "PPP") : "--"}
                    </TableCell>
                    <TableCell>{b.location || "-"}</TableCell>
                    <TableCell>{b.address || "-"}</TableCell>
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
                ))}
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
