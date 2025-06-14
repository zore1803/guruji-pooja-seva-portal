
import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardPandit() {
  const { user, session } = useSession();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth?role=pandit");
      return;
    }
    supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
      setProfile(data);
    });
  }, [user, navigate]);

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
        <span className="text-xs text-gray-500">Pandit</span>
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">Pandit Dashboard</h1>
        <p>Welcome Pandit, you can manage your bookings and profile here.</p>
        {/* TODO: Add booking list and management */}
      </div>
    </div>
  );
}
