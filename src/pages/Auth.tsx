import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type Role = "pandit" | "customer";
const PANDIT_EXTRA_FIELDS = [
  { name: "aadhar_number", type: "text", label: "Aadhar Number (for verification)" },
  { name: "expertise", type: "text", label: "Experience (years or details)" },
  { name: "address", type: "text", label: "Address (City/Location)" }
];

export default function AuthPage() {
  const [params] = useSearchParams();
  const role = (params.get("role") as Role) || "customer";
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({
    email: "", password: "", name: "",
    aadhar_number: "", expertise: "", address: "", profile_image_file: null
  });
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const swapMode = () => setIsLogin((v) => !v);

  async function handleChange(e: any) {
    const { name, value, files } = e.target;
    if (name === "profile_image_file" && files && files[0]) {
      setForm((prev: any) => ({ ...prev, [name]: files[0] }));
      setProfilePreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      setLoading(false);
      if (error) toast({ title: "Login failed", description: error.message });
      else toast({ title: "Logged in!" }); // Session will redirect via useSession
    } else {
      try {
        let profile_image_url = "";
        if (form.profile_image_file) {
          const file = form.profile_image_file;
          const { data, error } = await supabase.storage.from("avatars").upload(`avatars/${Date.now()}_${file.name}`, file, { cacheControl: "3600", upsert: false });
          if (error) throw error;
          profile_image_url = `${supabase.storage.from("avatars").getPublicUrl(data.path).data.publicUrl}`;
        }
        // Signup
        const redirectUrl = window.location.origin + "/";
        const { data: signUpData, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: { name: form.name, profile_image_url, user_type: role }
          }
        });
        if (error) throw error;
        const userId = signUpData?.user?.id;
        if (!userId) throw new Error("Sign up succeeded, but user id missing!");

        // Insert into profiles
        await supabase.from("profiles").insert([{
          id: userId,
          name: form.name,
          email: form.email,
          user_type: role,
          profile_image_url,
          is_verified: false,
          aadhar_number: role === "pandit" ? form.aadhar_number : null,
          expertise: role === "pandit" ? form.expertise : null,
          address: role === "pandit" ? form.address : null
        }]);

        // Send email ONLY for customers
        if (role === "customer") {
          // NOTE: No need to await. Don't block user on potential email delay.
          fetch("https://oftrrhwbxmiwrtuzpzmu.supabase.co/functions/v1/send-registration-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: form.email,
              name: form.name || "", // fallback to blank
            }),
          });
        }

        toast({ title: "Registration successful", description: "Check your email for confirmation." });
        navigate(role === "pandit" ? "/dashboard-pandit" : "/dashboard-customer");
      } catch (err: any) {
        toast({ title: "Signup failed", description: err.message || String(err) });
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 py-10">
      <div className="w-full max-w-[370px] bg-white shadow rounded-lg p-6">
        <h2 className="text-center font-bold text-2xl mb-4">{isLogin ? (role === "pandit" ? "Pandit Login" : "Customer Login") : (role === "pandit" ? "Pandit Signup" : "Customer Signup")}</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <Input required name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
              <div>
                <label className="block mb-2 font-medium">Profile Image</label>
                <Input name="profile_image_file" type="file" accept="image/*" onChange={handleChange} />
                {profilePreview && <img src={profilePreview} alt="preview" className="mt-2 max-h-24 rounded" />}
              </div>
              {role === "pandit" && PANDIT_EXTRA_FIELDS.map(f => (
                <Input
                  key={f.name}
                  name={f.name}
                  type={f.type}
                  placeholder={f.label}
                  value={form[f.name]}
                  onChange={handleChange}
                  required
                />
              ))}
            </>
          )}
          <Input required name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <Input required name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
          <Button disabled={loading} type="submit" className="w-full">{loading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}</Button>
        </form>
        <div className="pt-3 text-center text-sm">
          {isLogin ? (
            <>New user? <button className="text-orange-600 underline" onClick={swapMode}>Sign up</button></>
          ) : (
            <>Already registered? <button className="text-orange-600 underline" onClick={swapMode}>Log in</button></>
          )}
        </div>
      </div>
    </div>
  );
}
