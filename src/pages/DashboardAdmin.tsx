
import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, Users, Calendar, CheckCircle, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Profile = {
  id: string;
  name: string;
  email: string;
  user_type: string;
  profile_image_url?: string | null;
  expertise?: string | null;
  address?: string | null;
  is_verified?: boolean;
};

type Booking = {
  id: string;
  created_by: string;
  pandit_id: string | null;
  service_id: number;
  tentative_date: string | null;
  status: string;
  location: string | null;
  address: string | null;
  created_at: string;
  customer_profile?: Profile | null;
  service?: { name: string } | null;
  assigned_pandit?: Profile | null;
};

export default function DashboardAdmin() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
  });

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      navigate("/auth?role=admin");
      return;
    }
    
    const fetchAdminProfile = async () => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profileData || profileData.user_type !== "admin") {
        navigate("/");
        return;
      }
      
      setProfile(profileData);
    };

    fetchAdminProfile();
  }, [user, navigate]);

  // Fetch bookings data for admin overview
  useEffect(() => {
    if (!profile || profile.user_type !== "admin") return;

    const fetchData = async () => {
      setLoading(true);
      
      // Fetch all bookings with related data
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select(`
          *,
          profiles:created_by (*),
          services:service_id (*),
          assigned_pandit:pandit_id (*)
        `)
        .order("created_at", { ascending: false });

      if (bookingsData) {
        const mapped = bookingsData.map((row: any) => ({
          id: row.id,
          created_by: row.created_by,
          pandit_id: row.pandit_id,
          service_id: row.service_id,
          tentative_date: row.tentative_date,
          status: row.status,
          location: row.location,
          address: row.address,
          created_at: row.created_at,
          customer_profile: row.profiles,
          service: row.services,
          assigned_pandit: row.assigned_pandit,
        })) as Booking[];

        setBookings(mapped);
        
        // Calculate stats
        setStats({
          totalBookings: mapped.length,
          pendingBookings: mapped.filter(b => b.status === "pending").length,
          confirmedBookings: mapped.filter(b => b.status === "confirmed").length,
          completedBookings: mapped.filter(b => b.status === "completed").length,
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [profile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (!user || !profile) {
    return <div className="flex items-center justify-center py-10">Loading...</div>;
  }

  if (profile.user_type !== "admin") {
    return <div className="flex items-center justify-center py-10">Access denied</div>;
  }

  return (
    <div className="pt-8 px-5">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor bookings and system overview</p>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={profile.profile_image_url || undefined} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{profile.name}</div>
            <div className="text-sm text-gray-500">Administrator</div>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold">{stats.pendingBookings}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold">{stats.confirmedBookings}</div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold">{stats.completedBookings}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">All Bookings Overview</h2>
          <p className="text-sm text-gray-600">Monitor all bookings and their current status</p>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No bookings found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Pandit</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.customer_profile?.name}</div>
                        <div className="text-sm text-gray-500">{booking.customer_profile?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.service?.name || "Unknown Service"}</TableCell>
                    <TableCell>
                      {booking.tentative_date ? format(new Date(booking.tentative_date), "PPP") : "Not set"}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{booking.location || "Not specified"}</div>
                        <div className="text-xs text-gray-500">{booking.address || ""}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        booking.status === "pending" ? "bg-orange-100 text-orange-800" :
                        booking.status === "assigned" ? "bg-blue-100 text-blue-800" :
                        booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                        booking.status === "completed" ? "bg-purple-100 text-purple-800" :
                        booking.status === "cancelled" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || "Unknown"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {booking.assigned_pandit ? (
                        <div className="text-sm">
                          {booking.assigned_pandit.name}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">System will assign</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-gray-500">
                        {format(new Date(booking.created_at), "PPp")}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
