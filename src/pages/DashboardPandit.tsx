import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import EditPanditProfileModal from "@/components/EditPanditProfileModal";
import PanditCompletedPoojasTable from "@/components/PanditCompletedPoojasTable";
import { Edit, Award, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardStats from "@/components/DashboardStats";
import BookingsTable from "@/components/BookingsTable";

export default function DashboardPandit() {
  const { user, loading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [assignedBookings, setAssignedBookings] = useState<any[]>([]);
  const [localBookings, setLocalBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Handle authentication state changes
  useEffect(() => {
    if (sessionLoading) return;
    
    if (!user) {
      navigate("/auth?role=pandit", { replace: true });
      return;
    }

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
        } else {
          console.error('Profile not found:', error);
        }
      } catch (error) {
        console.error('Profile load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, sessionLoading, initialLoad]);

  // Load bookings when user is confirmed
  useEffect(() => {
    if (sessionLoading || !user || initialLoad) return;
    
    const loadLocalBookings = () => {
      try {
        const stored = localStorage.getItem('recentBookings');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Show all pending bookings for pandit to accept/reject
          const pendingBookings = parsed.filter((booking: any) => 
            booking.status === "pending"
          );
          setLocalBookings(pendingBookings);
        }
      } catch (error) {
        console.error('Error loading local bookings:', error);
      }
    };

    const fetchAssignedBookings = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            *,
            profiles:created_by (*),
            services:service_id (*)
          `)
          .eq("pandit_id", user.id)
          .in("status", ["assigned", "confirmed", "completed"])
          .order("created_at", { ascending: false });

        if (error) {
          console.error('Error fetching bookings:', error);
          return;
        }

        if (data) {
          const mapped = data.map((row: any) => ({
            ...row,
            customer_profile: row.profiles,
            service: row.services,
          }));
          setAssignedBookings(mapped);
        }
      } catch (error) {
        console.error('Booking load error:', error);
      }
    };

    loadLocalBookings();
    fetchAssignedBookings();
    
    // Set up interval to check for new local bookings
    const interval = setInterval(loadLocalBookings, 5000);
    return () => clearInterval(interval);
  }, [user, sessionLoading, initialLoad]);

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      // Update booking status in localStorage
      const stored = localStorage.getItem('recentBookings');
      if (stored) {
        const bookings = JSON.parse(stored);
        const updatedBookings = bookings.map((booking: any) =>
          booking.id === bookingId
            ? { ...booking, status: "confirmed", pandit_id: user.id, pandit_name: profile.name }
            : booking
        );
        localStorage.setItem('recentBookings', JSON.stringify(updatedBookings));
        
        // Remove from local bookings (pending list)
        setLocalBookings(prev => prev.filter(b => b.id !== bookingId));
      }

      toast({
        title: "Success",
        description: "Booking accepted successfully",
      });
    } catch (error) {
      console.error('Error accepting booking:', error);
      toast({
        title: "Error",
        description: "Failed to accept booking",
        variant: "destructive",
      });
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      // Update booking status in localStorage
      const stored = localStorage.getItem('recentBookings');
      if (stored) {
        const bookings = JSON.parse(stored);
        const updatedBookings = bookings.map((booking: any) =>
          booking.id === bookingId
            ? { ...booking, status: "rejected", rejected_by: profile.name }
            : booking
        );
        localStorage.setItem('recentBookings', JSON.stringify(updatedBookings));
        
        // Remove from local bookings (pending list)
        setLocalBookings(prev => prev.filter(b => b.id !== bookingId));
      }

      toast({
        title: "Success",
        description: "Booking rejected successfully",
      });
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast({
        title: "Error",
        description: "Failed to reject booking",
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdated = (updated: any) => {
    setProfile(updated);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate("/", { replace: true });
    }
  };

  if (sessionLoading || initialLoad || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalBookings: localBookings.length + assignedBookings.length,
    pendingBookings: localBookings.length,
    confirmedBookings: assignedBookings.filter(b => b.status === "confirmed").length,
    completedBookings: assignedBookings.filter(b => b.status === "completed").length,
  };

  // Show local bookings for pending requests and database bookings for accepted ones
  const allBookings = [...localBookings, ...assignedBookings];
  const filteredBookings = activeFilter === "all" 
    ? allBookings 
    : activeFilter === "pending" 
      ? localBookings
      : assignedBookings.filter(booking => booking.status === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="pt-8 px-5 pb-10">
        <DashboardHeader
          title="Pandit Dashboard"
          subtitle="Manage your assigned bookings and profile information"
          profile={{
            name: profile.name,
            email: user.email,
            profile_image_url: profile.profile_image_url
          }}
          role="Pandit"
          onLogout={handleLogout}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-700">
                    {profile.name?.charAt(0)?.toUpperCase() || 'P'}
                  </span>
                </div>
                <h3 className="font-semibold text-lg">{profile.name}</h3>
                <p className="text-sm text-gray-500">Pandit</p>
                {profile.expertise && (
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs text-gray-600">{profile.expertise}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    profile.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profile.is_verified ? 'Yes' : 'Pending'}
                  </span>
                </div>
                
                <Button 
                  onClick={() => setOpenEditModal(true)} 
                  variant="outline" 
                  className="w-full flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Edit className="w-4 h-4" /> 
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <DashboardStats
              stats={stats}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="px-6 py-4 border-b bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {activeFilter === "pending" ? "New Booking Requests" : 
                     activeFilter === "all" ? "All Bookings" : 
                     `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Bookings`}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {activeFilter === "pending" ? "Accept or reject new customer requests" : 
                     "Manage your bookings and customer requests"}
                  </p>
                </div>
                
                <BookingsTable
                  bookings={filteredBookings}
                  loading={false}
                  role="pandit"
                  onAcceptBooking={handleAcceptBooking}
                  onRejectBooking={handleRejectBooking}
                  showActions={activeFilter === "pending" || activeFilter === "all"}
                />
              </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800">Completed Poojas</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Your completed ceremony history
                </p>
              </div>
              <PanditCompletedPoojasTable panditId={user.id} />
            </div>
          </div>
        </div>

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