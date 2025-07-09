
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";

export interface PanditProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  expertise?: string | null;
  address?: string | null;
  aadhar_number?: string | null;
  state?: string | null;
  work_locations: string[];
  profile_image_url?: string | null;
  is_verified: boolean;
}

export function usePanditProfile() {
  const { user } = useSession();
  const [profile, setProfile] = useState<PanditProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    
    setLoading(true);
    supabase
      .from("pandit_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching pandit profile:', error);
        }
        setProfile(data || null);
        setLoading(false);
      });
  }, [user]);

  return { profile, loading };
}
