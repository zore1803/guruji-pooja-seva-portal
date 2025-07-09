
import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import EditCustomerProfileModal from "@/components/EditCustomerProfileModal";
import { Edit } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardStats from "@/components/DashboardStats";
import BookingsTable from "@/components/BookingsTable";
import { useCustomerProfile } from "@/hooks/useCustomerProfile";

import { Booking } from "@/components/BookingsTable";

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
  const { profile, loading: loadingProfile } = useCustomerProfile();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [localBookings, setLocalBookings] = useState<LocalStorageBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Handle authentication state changes
  useEffect(() => {
    if (sessionLoading) return;
    
    if (!user) {
      navigate("/auth?role=customer", { replace: true });
      return;
    }

    setInitialLoad(false);
  }, [user, sessionLoading, navigate]);

  // Load bookings when user is confirmed
  useEffect(() => {
    if (sessionLoading || !user || initialLoad) return;
    
    const loadBookings = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

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
    // Profile will be updated automatically by the hook
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

  if (sessionLoading || initialLoad || loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const allBookings: Booking[] = [...bookings, ...localBookings.map(lb => ({
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
  } as Booking))];

  const stats = {
    totalBookings: allBookings.length,
    pendingBookings: allBookings.filter(b => b.status === "pending").length,
    confirmedBookings: allBookings.filter(b => b.status === "confirmed").length,
    completedBookings: allBookings.filter(b => b.status === "completed").length,
  };

  const filteredBookings = activeFilter === "all" 
    ? allBookings 
    : allBookings.filter(booking => booking.status === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="pt-8 px-5 pb-10">
        <DashboardHeader
          title="Customer Dashboard"
          subtitle="Browse and book pooja services, or manage your bookings"
          profile={{
            name: profile?.name || 'User',
            email: user.email,
            profile_image_url: profile?.profile_image_url
          }}
          role="Customer"
          onLogout={handleLogout}
          showBookButton={true}
          onBookNow={() => navigate("/services")}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-700">
                    {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h3 className="font-semibold text-lg">{profile?.name || 'User'}</h3>
                <p className="text-sm text-gray-500">Customer Account</p>
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

          {/* Main Content */}
          <div className="flex-1">
            <DashboardStats
              stats={stats}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800">
                  {activeFilter === "all" ? "All Bookings" : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Bookings`}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Track your booking history and current requests
                </p>
              </div>
              
              <BookingsTable
                bookings={filteredBookings}
                loading={false}
                role="customer"
              />
            </div>
          </div>
        </div>

        <EditCustomerProfileModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          profile={profile}
          onProfileUpdated={handleProfileUpdated}
        />
      </div>
    </div>
  );
}
