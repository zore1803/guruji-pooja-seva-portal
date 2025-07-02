
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import OTPVerification from "@/components/OTPVerification";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: sessionLoading } = useSession();
  const { adminLogin, loading: adminLoading } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    expertise: "",
    address: "",
    aadhar_number: "",
  });

  const role = searchParams.get("role") || "customer";

  useEffect(() => {
    if (sessionLoading) return;

    if (user) {
      redirectToDashboard();
    }

    // Check if admin is logged in via localStorage
    if (role === "admin" && localStorage.getItem('isAdmin') === 'true') {
      navigate("/dashboard-admin", { replace: true });
    }
  }, [user, navigate, role, sessionLoading]);

  const redirectToDashboard = async () => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .single();

      let redirectPath = "/dashboard-customer";

      if (profile) {
        switch (profile.user_type) {
          case "admin":
            redirectPath = "/dashboard-admin";
            break;
          case "pandit":
            redirectPath = "/dashboard-pandit";
            break;
          default:
            redirectPath = "/dashboard-customer";
            break;
        }
      } else if (role === "pandit") {
        redirectPath = "/dashboard-pandit";
      }

      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      let fallbackPath = "/dashboard-customer";
      if (role === "pandit") {
        fallbackPath = "/dashboard-pandit";
      }
      navigate(fallbackPath, { replace: true });
    }
  };

  // Clear form when role changes
  useEffect(() => {
    setFormData({
      email: "",
      password: "",
      name: "",
      expertise: "",
      address: "",
      aadhar_number: "",
    });
    setShowOTPVerification(false);
    setPendingEmail("");
  }, [role]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "admin") return;
    
    setLoading(true);
    
    const signUpData = {
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth?role=${role}`,
        data: {
          name: formData.name,
          user_type: role,
          ...(role === "pandit" && {
            expertise: formData.expertise,
            address: formData.address,
            aadhar_number: formData.aadhar_number,
          }),
        },
      },
    };

    const { error } = await supabase.auth.signUp(signUpData);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPendingEmail(formData.email);
      setShowOTPVerification(true);
      toast({
        title: "Verification Required",
        description: "Please check your email for the verification code",
      });
    }
    
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (role === "admin") {
      const result = await adminLogin(formData.email, formData.password);
      if (result.success) {
        navigate("/dashboard-admin", { replace: true });
      }
      return;
    }

    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const handleOTPVerificationComplete = () => {
    setShowOTPVerification(false);
    toast({
      title: "Welcome!",
      description: "Your account has been verified successfully",
    });
  };

  const handleBackToRegistration = () => {
    setShowOTPVerification(false);
    setPendingEmail("");
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#f8ede8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (showOTPVerification) {
    return (
      <div className="min-h-screen bg-[#f8ede8] flex items-center justify-center p-4">
        <OTPVerification
          email={pendingEmail}
          onVerificationComplete={handleOTPVerificationComplete}
          onBack={handleBackToRegistration}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8ede8] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-orange-700">
            {role === "admin" ? "Admin Login" : role === "pandit" ? "Pandit Portal" : "Customer Portal"}
          </CardTitle>
          <CardDescription className="text-center">
            {role === "admin" 
              ? "Administrator access to E-GURUJI system"
              : `Enter your credentials to access the ${role} portal`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {role === "admin" ? (
            // Admin login form - no credential hints
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="Enter admin email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="Enter admin password"
                />
              </div>
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={adminLoading}>
                {adminLoading ? "Signing in..." : "Sign In as Admin"}
              </Button>
            </form>
          ) : (
            // Regular user login/signup
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  {role === "pandit" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="expertise">Expertise/Specialization</Label>
                        <Input
                          id="expertise"
                          type="text"
                          value={formData.expertise}
                          onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                          placeholder="e.g., Vedic Rituals, Marriage Ceremonies"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Complete address"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="aadhar_number">Aadhar Number</Label>
                        <Input
                          id="aadhar_number"
                          type="text"
                          value={formData.aadhar_number}
                          onChange={(e) => setFormData({ ...formData, aadhar_number: e.target.value })}
                          placeholder="12-digit Aadhar number"
                          maxLength={12}
                          required
                        />
                      </div>
                    </>
                  )}
                  
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
