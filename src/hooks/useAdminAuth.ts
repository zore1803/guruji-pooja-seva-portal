
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useAdminAuth() {
  const [loading, setLoading] = useState(false);

  const adminLogin = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Check hardcoded admin credentials
      if (email === "admin@gmail.com" && password === "admin123") {
        // Create a mock admin session by setting a flag in localStorage
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminEmail', email);
        
        toast({
          title: "Success",
          description: "Admin login successful",
        });

        return { success: true, data: { user: { email, id: 'admin-user' } } };
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid admin credentials",
          variant: "destructive",
        });
        return { success: false, error: new Error("Invalid credentials") };
      }
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

  return {
    adminLogin,
    loading,
  };
}
