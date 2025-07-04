import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import EditPanditProfileModal from "@/components/EditPanditProfileModal";
import PanditCompletedPoojasTable from "@/components/PanditCompletedPoojasTable";
import { LogOut, Edit, CheckCircle, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { format } from "date-fns";

export default function DashboardPandit() {
  const { user, loading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [assignedBookings, setAssignedBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // Handle authentication state changes
  useEffect(() => {
    // Don't do anything while session is still loading
    if (sessionLoading) return;
    
    // If no user after session loading is complete, redirect to auth
    if (!user) {
      navigate("/auth?role=pandit", { replace: true });
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
        } else {
          console.error('Profile not found:', error);
          // Optionally redirect to profile creation or show error
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

    fetchAssignedBookings();
  }, [user, sessionLoading, initialLoad]);

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", bookingId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to accept booking",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Booking accepted successfully",
      });

      // Refresh bookings instead of full page reload
      const { data } = await supabase
        .from("bookings")
        .select(`
          *,
          profiles:created_by (*),
          services:service_id (*)
        `)
        .eq("pandit_id", user.id)
        .in("status", ["assigned", "confirmed", "completed"])
        .order("created_at", { ascending: false });

      if (data) {
        const mapped = data.map((row: any) => ({
          ...row,
          customer_profile: row.profiles,
          service: row.services,
        }));
        setAssignedBookings(mapped);
      }
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
      const { error } = await supabase
        .from("bookings")
        .update({ 
          status: "cancelled",
          pandit_id: null,
          assigned_at: null
        })
        .eq("id", bookingId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to reject booking",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Booking rejected successfully",
      });

      // Refresh bookings instead of full page reload
      const { data } = await supabase
        .from("bookings")
        .select(`
          *,
          profiles:created_by (*),
          services:service_id (*)
        `)
        .eq("pandit_id", user.id)
        .in("status", ["assigned", "confirmed", "completed"])
        .order("created_at", { ascending: false });

      if (data) {
        const mapped = data.map((row: any) => ({
          ...row,
          customer_profile: row.profiles,
          service: row.services,
        }));
        setAssignedBookings(mapped);
      }
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

  // Show profile loading state if profile is not yet loaded
  if (!profile) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8 px-5 flex-col md:flex-row flex items-start gap-8">
      <div className="w-[190px] flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-2">
          <AvatarImage src={profile.profile_image_url} alt={profile.name} />
          <AvatarFallback>{profile.name?.charAt(0)?.toUpperCase() || 'P'}</AvatarFallback>
        </Avatar>
        <span className="font-semibold">{profile.name}</span>
        <span className="text-xs text-gray-500">Pandit</span>
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
        <h1 className="text-2xl font-bold mb-2">Pandit Dashboard</h1>
        <p>Manage your assigned bookings and profile information.</p>
        
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Assigned Bookings</h2>
          {assignedBookings.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No assigned bookings found</p>
            </div>
          ) : (
            <Table>
              <TableCaption>Your assigned bookings</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.customer_profile?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{booking.customer_profile?.email || 'No email'}</div>
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
                        booking.status === "assigned" ? "bg-blue-100 text-blue-800" :
                        booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                        booking.status === "completed" ? "bg-purple-100 text-purple-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {booking.assigned_at ? format(new Date(booking.assigned_at), "PPp") : "--"}
                    </TableCell>
                    <TableCell>
                      {booking.status === "assigned" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptBooking(booking.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectBooking(booking.id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      {booking.status === "confirmed" && (
                        <span className="text-green-600 text-sm">Accepted</span>
                      )}
                      {booking.status === "completed" && (
                        <span className="text-purple-600 text-sm">Completed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="mt-8">
          <PanditCompletedPoojasTable panditId={user.id} />
        </div>
      </div>
      <EditPanditProfileModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        profile={profile}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
}
