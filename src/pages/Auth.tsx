
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
  const { user } = useSession();
  const { adminLogin, createAdminUser, loading: adminLoading } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const role = searchParams.get("role") || "customer";

  useEffect(() => {
    if (user) {
      // Redirect based on user type
      if (role === "admin") {
        navigate("/dashboard-admin");
      } else if (role === "pandit") {
        navigate("/dashboard-pandit");
      } else {
        navigate("/dashboard-customer");
      }
    }
  }, [user, navigate, role]);

  // Clear form when role changes
  useEffect(() => {
    setFormData({
      email: "",
      password: "",
      name: "",
    });
    setShowOTPVerification(false);
    setPendingEmail("");
  }, [role]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "admin") return; // Prevent admin signup
    
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          name: formData.name,
          user_type: role,
        },
      },
    });

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
        navigate("/dashboard-admin");
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

  const handleCreateAdmin = async () => {
    await createAdminUser();
  };

  const handleOTPVerificationComplete = () => {
    setShowOTPVerification(false);
    toast({
      title: "Welcome!",
      description: "Your account has been verified successfully",
    });
    // User will be automatically redirected by the useEffect hook
  };

  const handleBackToRegistration = () => {
    setShowOTPVerification(false);
    setPendingEmail("");
  };

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
            // Admin login form
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
              <div className="text-center">
                <Button type="button" variant="outline" onClick={handleCreateAdmin} className="text-sm">
                  Create Admin User (Dev Only)
                </Button>
              </div>
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
