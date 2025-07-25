
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  state?: string | null;
  city?: string | null;
  profile_image_url?: string | null;
  is_verified: boolean;
}

export function useCustomerProfile() {
  const { user } = useSession();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    
    setLoading(true);
    supabase
      .from("customer_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching customer profile:', error);
        }
        setProfile(data || null);
        setLoading(false);
      });
  }, [user]);

  return { profile, loading };
}
