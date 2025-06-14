
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  user_type: string;
  profile_image_url?: string | null;
  address?: string | null;
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
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setProfile(data || null);
        setLoading(false);
      });
  }, [user]);

  return { profile, loading };
}
