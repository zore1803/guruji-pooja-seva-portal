
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

      toast({
        title: "Success",
        description: "Admin login successful",
      });

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
      // Use the database function to create admin user safely
      const { error } = await supabase.rpc('create_admin_user_safe');
      
      if (error) {
        console.error("Error creating admin user:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Admin user setup completed. You can now log in with admin@gmail.com / admin123",
      });
    } catch (error) {
      console.error("Error in createAdminUser:", error);
      toast({
        title: "Error",
        description: "Failed to create admin user",
        variant: "destructive",
      });
    }
  };

  return {
    adminLogin,
    createAdminUser,
    loading,
  };
}
