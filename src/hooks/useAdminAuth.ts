
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useAdminAuth() {
  const [loading, setLoading] = useState(false);

  const adminLogin = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }

      // Check if user is admin
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", data.user.id)
          .single();

        if (!profile || profile.user_type !== "admin") {
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "Admin access required",
            variant: "destructive",
          });
          return { success: false, error: new Error("Not an admin user") };
        }
      }

      return { success: true, data };
    } catch (error) {
      console.error("Admin login error:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const createAdminUser = async () => {
    try {
      // First, sign up the admin user with a stronger password
      const { data, error } = await supabase.auth.signUp({
        email: "admin@gmail.com",
        password: "admin123", // Updated to meet minimum requirements
        options: {
          data: {
            name: "Administrator",
            user_type: "admin",
          },
        },
      });

      if (error) {
        console.error("Error creating admin user:", error);
        return;
      }

      // If successful, manually create the profile
      if (data.user) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          name: "Administrator",
          email: "admin@gmail.com",
          user_type: "admin",
        });
      }
    } catch (error) {
      console.error("Error in createAdminUser:", error);
    }
  };

  return {
    adminLogin,
    createAdminUser,
    loading,
  };
}
