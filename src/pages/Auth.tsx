
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import OTPVerification from "@/components/OTPVerification";
import { Camera, Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INDIAN_STATES, STATE_CITIES } from "@/data/states";
import { Checkbox } from "@/components/ui/checkbox";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, userType, loading: sessionLoading } = useSession();
  const { adminLogin, loading: adminLoading } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [authError, setAuthError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    expertise: "",
    address: "",
    aadhar_number: "",
    state: "",
    work_locations: [] as string[],
  });

  // Photo upload states
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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
      // If we already have the userType from the hook, use it directly
      if (userType) {
        navigateBasedOnUserType(userType);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .single();

      if (profile) {
        navigateBasedOnUserType(profile.user_type);
      } else if (role === "pandit") {
        navigate("/dashboard-pandit", { replace: true });
      } else {
        navigate("/dashboard-customer", { replace: true });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      let fallbackPath = "/dashboard-customer";
      if (role === "pandit") {
        fallbackPath = "/dashboard-pandit";
      }
      navigate(fallbackPath, { replace: true });
    }
  };

  const navigateBasedOnUserType = (userType: string) => {
    let redirectPath = "/dashboard-customer";
    
    switch (userType) {
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
    
    navigate(redirectPath, { replace: true });
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
      state: "",
      work_locations: [],
    });
    setShowOTPVerification(false);
    setPendingEmail("");
    setProfileImage(null);
    setPreviewUrl(null);
    setAuthError("");
  }, [role]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setProfileImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setPreviewUrl(null);
  };

  const uploadProfileImage = async (userId: string): Promise<string | null> => {
    if (!profileImage) return null;

    setUploading(true);
    try {
      const fileExt = profileImage.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, profileImage, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "admin") return;
    
    setLoading(true);
    setAuthError("");
    
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
            state: formData.state,
            work_locations: formData.work_locations,
          }),
        },
      },
    };

    const { data: authData, error } = await supabase.auth.signUp(signUpData);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setAuthError(error.message);
      setLoading(false);
      return;
    }

    // If user is created and we have a profile image, upload it
    if (authData.user && profileImage) {
      const profileImageUrl = await uploadProfileImage(authData.user.id);
      
      if (profileImageUrl) {
        // Update the user's profile with the image URL
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ profile_image_url: profileImageUrl })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Profile image update error:', profileError);
        }
      }
    }

    setPendingEmail(formData.email);
    setShowOTPVerification(true);
    toast({
      title: "Verification Required",
      description: "Please check your email for the verification code",
    });
    
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    if (role === "admin") {
      const result = await adminLogin(formData.email, formData.password);
      if (result.success) {
        navigate("/dashboard-admin", { replace: true });
      }
      return;
    }

    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setAuthError(error.message);
      setLoading(false);
      return;
    }

    // Validate user role matches the selected portal
    if (data.user) {
      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (profile && profile.user_type !== role) {
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: `This account is registered as a ${profile.user_type}, not a ${role}. Please use the correct portal.`,
            variant: "destructive",
          });
          setAuthError(`This account is registered as a ${profile.user_type}, not a ${role}. Please use the correct portal.`);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Error validating user type:", err);
        // If we can't validate, sign out to be safe
        await supabase.auth.signOut();
        toast({
          title: "Authentication Error",
          description: "There was an error validating your account. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }
    
    setLoading(false);
    // If successful, useEffect will handle redirect
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-orange-200/30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-amber-200/20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-yellow-200/25 animate-pulse delay-500"></div>
      </div>
      
      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-white/95 shadow-2xl border-0 animate-fade-in hover:shadow-3xl transition-all duration-300">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mb-2 animate-scale-in">
            <span className="text-2xl font-bold text-white">
              {role === "admin" ? "A" : role === "pandit" ? "P" : "C"}
            </span>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {role === "admin" ? "Admin Portal" : role === "pandit" ? "Pandit Portal" : "Customer Portal"}
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            {role === "admin" 
              ? "🔐 Administrator access to E-GURUJI system"
              : `🙏 Welcome to your ${role} portal`
            }
          </CardDescription>
          {authError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 text-sm">
              {authError}
            </div>
          )}
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
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200" 
                disabled={adminLoading}
              >
                {adminLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "🔐 Admin Access"
                )}
              </Button>
            </form>
          ) : (
            // Regular user login/signup
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-orange-100/50 p-1 rounded-lg">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 rounded-md"
                >
                  🔑 Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 rounded-md"
                >
                  ✨ Sign Up
                </TabsTrigger>
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
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing in...
                      </div>
                    ) : (
                      "✨ Sign In"
                    )}
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
                   
                   <div className="space-y-2">
                     <Label htmlFor="state">State</Label>
                     <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                       <SelectTrigger>
                         <SelectValue placeholder="Select your state" />
                       </SelectTrigger>
                       <SelectContent>
                         {INDIAN_STATES.map((state) => (
                           <SelectItem key={state} value={state}>
                             {state}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
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
                       
                       <div className="space-y-2">
                         <Label htmlFor="pandit_state">State</Label>
                         <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value, work_locations: [] })}>
                           <SelectTrigger>
                             <SelectValue placeholder="Select your state" />
                           </SelectTrigger>
                           <SelectContent>
                             {INDIAN_STATES.map((state) => (
                               <SelectItem key={state} value={state}>
                                 {state}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>
                       
                       {formData.state && (
                         <div className="space-y-2">
                           <Label>Available Work Locations (Select 3-4 cities)</Label>
                           <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                             {STATE_CITIES[formData.state]?.map((city) => (
                               <div key={city} className="flex items-center space-x-2">
                                 <Checkbox
                                   id={city}
                                   checked={formData.work_locations.includes(city)}
                                   onCheckedChange={(checked) => {
                                     if (checked) {
                                       if (formData.work_locations.length < 4) {
                                         setFormData({
                                           ...formData,
                                           work_locations: [...formData.work_locations, city]
                                         });
                                       }
                                     } else {
                                       setFormData({
                                         ...formData,
                                         work_locations: formData.work_locations.filter(loc => loc !== city)
                                       });
                                     }
                                   }}
                                   disabled={!formData.work_locations.includes(city) && formData.work_locations.length >= 4}
                                 />
                                 <Label htmlFor={city} className="text-sm">{city}</Label>
                               </div>
                             ))}
                           </div>
                           <p className="text-xs text-gray-500">
                             Selected: {formData.work_locations.length}/4 cities
                           </p>
                         </div>
                       )}
                    </>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200" 
                    disabled={loading || uploading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating account...
                      </div>
                    ) : uploading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading photo...
                      </div>
                    ) : (
                      "🚀 Create Account"
                    )}
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
