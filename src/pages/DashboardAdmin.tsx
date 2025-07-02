
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

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [localBookings, setLocalBookings] = useState<LocalStorageBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
  });

  // Check if admin is logged in
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate("/auth?role=admin");
      return;
    }
  }, [navigate]);

  // Load localStorage bookings
  useEffect(() => {
    const loadLocalBookings = () => {
      try {
        const stored = localStorage.getItem('recentBookings');
        if (stored) {
          const parsed = JSON.parse(stored);
          setLocalBookings(parsed);
        }
      } catch (error) {
        console.error('Error loading local bookings:', error);
      }
    };

    loadLocalBookings();
    
    // Set up interval to check for new bookings
    const interval = setInterval(loadLocalBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch bookings data for admin overview
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
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
        
        // Combine with localStorage bookings for stats
        const allBookings = [...mapped, ...localBookings];
        setStats({
          totalBookings: allBookings.length,
          pendingBookings: allBookings.filter(b => b.status === "pending").length,
          confirmedBookings: allBookings.filter(b => b.status === "confirmed").length,
          completedBookings: allBookings.filter(b => b.status === "completed").length,
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [localBookings]);

  const handleLogout = async () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    navigate("/");
  };

  const getFilteredBookings = () => {
    const dbBookings = activeFilter === "all" ? bookings : bookings.filter(booking => booking.status === activeFilter);
    const localFilteredBookings = activeFilter === "all" ? localBookings : localBookings.filter(booking => booking.status === activeFilter);
    
    return { dbBookings, localFilteredBookings };
  };

  const adminProfile = {
    name: "Administrator",
    email: localStorage.getItem('adminEmail') || "admin@gmail.com"
  };

  const { dbBookings, localFilteredBookings } = getFilteredBookings();

  return (
    <div className="pt-8 px-5">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor bookings and system overview</p>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback>{adminProfile.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{adminProfile.name}</div>
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
        <Button 
          variant={activeFilter === "all" ? "default" : "outline"}
          onClick={() => setActiveFilter("all")}
          className="p-6 h-auto flex-col items-start"
        >
          <div className="flex items-center w-full">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div className="ml-4 text-left">
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <div className="text-sm">Total Bookings</div>
            </div>
          </div>
        </Button>
        
        <Button 
          variant={activeFilter === "pending" ? "default" : "outline"}
          onClick={() => setActiveFilter("pending")}
          className="p-6 h-auto flex-col items-start"
        >
          <div className="flex items-center w-full">
            <Clock className="w-8 h-8 text-orange-600" />
            <div className="ml-4 text-left">
              <div className="text-2xl font-bold">{stats.pendingBookings}</div>
              <div className="text-sm">Pending</div>
            </div>
          </div>
        </Button>
        
        <Button 
          variant={activeFilter === "confirmed" ? "default" : "outline"}
          onClick={() => setActiveFilter("confirmed")}
          className="p-6 h-auto flex-col items-start"
        >
          <div className="flex items-center w-full">
            <Users className="w-8 h-8 text-green-600" />
            <div className="ml-4 text-left">
              <div className="text-2xl font-bold">{stats.confirmedBookings}</div>
              <div className="text-sm">Confirmed</div>
            </div>
          </div>
        </Button>
        
        <Button 
          variant={activeFilter === "completed" ? "default" : "outline"}
          onClick={() => setActiveFilter("completed")}
          className="p-6 h-auto flex-col items-start"
        >
          <div className="flex items-center w-full">
            <CheckCircle className="w-8 h-8 text-purple-600" />
            <div className="ml-4 text-left">
              <div className="text-2xl font-bold">{stats.completedBookings}</div>
              <div className="text-sm">Completed</div>
            </div>
          </div>
        </Button>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">
            {activeFilter === "all" ? "All Bookings" : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Bookings`}
          </h2>
          <p className="text-sm text-gray-600">
            {activeFilter === "all" ? "Monitor all bookings and their current status" : `View ${activeFilter} bookings`}
          </p>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading bookings...</div>
          ) : (dbBookings.length === 0 && localFilteredBookings.length === 0) ? (
            <div className="p-8 text-center text-gray-500">No {activeFilter === "all" ? "" : activeFilter} bookings found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Database Bookings */}
                {dbBookings.map((booking) => (
                  <TableRow key={`db-${booking.id}`}>
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
                        booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                        booking.status === "completed" ? "bg-purple-100 text-purple-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || "Unknown"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Database</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-gray-500">
                        {format(new Date(booking.created_at), "PPp")}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Local Storage Bookings */}
                {localFilteredBookings.map((booking) => (
                  <TableRow key={`local-${booking.id}`} className="bg-yellow-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.customer_name}</div>
                        <div className="text-sm text-gray-500">{booking.customer_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.service_name}</TableCell>
                    <TableCell>
                      {format(new Date(booking.tentative_date), "PPP")}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{booking.location}</div>
                        <div className="text-xs text-gray-500">{booking.address}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Recent</span>
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
