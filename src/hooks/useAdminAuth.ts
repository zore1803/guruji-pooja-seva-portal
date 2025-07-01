
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
      // Create admin user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: "admin@gmail.com",
        password: "admin123",
        options: {
          data: {
            name: "Administrator",
            user_type: "admin",
          },
        },
      });

      if (authError) {
        console.error("Error creating admin user:", authError);
        toast({
          title: "Error",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      // If user was created, ensure profile exists
      if (authData.user) {
        // Wait a bit for the trigger to create the profile
        setTimeout(async () => {
          const { data: existingProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authData.user.id)
            .single();

          if (!existingProfile) {
            // Manually create profile if trigger didn't work
            await supabase.from("profiles").insert({
              id: authData.user.id,
              name: "Administrator",
              email: "admin@gmail.com",
              user_type: "admin",
            });
          }
        }, 2000);
      }

      toast({
        title: "Success",
        description: "Admin user created successfully. You can now log in with admin@gmail.com / admin123",
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
