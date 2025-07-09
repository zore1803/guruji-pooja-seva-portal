
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      // Get user profile type if user exists
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("user_type")
            .eq("id", session.user.id)
            .maybeSingle();
            
          setUserType(profile?.user_type || null);
        } catch (error) {
          console.error("Error fetching user type:", error);
          setUserType(null);
        }
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Get updated user profile type on auth change
      if (session?.user) {
        // Use setTimeout to prevent recursive auth calls
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("user_type")
              .eq("id", session.user.id)
              .maybeSingle();
              
            setUserType(profile?.user_type || null);
          } catch (error) {
            console.error("Error fetching user type on auth change:", error);
            setUserType(null);
          }
        }, 0);
      } else {
        setUserType(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, user, userType, loading };
}
