import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  profile: {
    name: string;
    email?: string;
    profile_image_url?: string | null;
  };
  role: string;
  onLogout: () => void;
  showBookButton?: boolean;
  onBookNow?: () => void;
}

export default function DashboardHeader({ 
  title, 
  subtitle, 
  profile, 
  role, 
  onLogout, 
  showBookButton = false, 
  onBookNow 
}: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
        {showBookButton && (
          <div className="flex justify-start mt-4">
            <Button
              onClick={onBookNow}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow hover:scale-105 transition-transform"
            >
              Book Now
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={profile.profile_image_url || undefined} alt={profile.name} />
          <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold">
            {profile.name?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{profile.name}</div>
          <div className="text-sm text-gray-500">{role}</div>
          {profile.email && (
            <div className="text-xs text-gray-400">{profile.email}</div>
          )}
        </div>
        <Button onClick={onLogout} variant="outline" size="sm" className="hover:scale-105 transition-transform">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}