
import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import EditCustomerProfileModal from "@/components/EditCustomerProfileModal";
import { LogOut, Edit } from "lucide-react";

export default function DashboardCustomer() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth?role=customer");
      return;
    }
    supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
      setProfile(data);
    });
  }, [user, navigate]);

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
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">Customer Dashboard</h1>
        <p>Browse and book pooja services below, or manage your upcoming bookings.</p>
        {/* TODO: Add booking list and link to services */}
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
