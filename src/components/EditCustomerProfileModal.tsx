
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type EditCustomerProfileModalProps = {
  open: boolean;
  onClose: () => void;
  profile: {
    id: string;
    name: string;
    address?: string | null;
    profile_image_url?: string | null;
    email: string;
  };
  onProfileUpdated: (updated: Record<string, any>) => void;
};

export default function EditCustomerProfileModal({
  open,
  onClose,
  profile,
  onProfileUpdated,
}: EditCustomerProfileModalProps) {
  const [form, setForm] = useState({
    name: profile.name,
    address: profile.address || "",
    profile_image_file: null as File | null,
    profile_image_url: profile.profile_image_url || "",
  });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(profile.profile_image_url || null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profile_image_file" && files && files[0]) {
      setForm(f => ({ ...f, profile_image_file: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let profile_image_url = form.profile_image_url;
      if (form.profile_image_file) {
        const file = form.profile_image_file;
        const { data, error } = await supabase.storage.from("avatars").upload(
          `avatars/${Date.now()}_${file.name}`,
          file,
          { cacheControl: "3600", upsert: true }
        );
        if (error) throw error;
        profile_image_url = supabase.storage.from("avatars").getPublicUrl(data.path).data.publicUrl;
      }
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name: form.name,
          address: form.address,
          profile_image_url
        })
        .eq("id", profile.id);
      if (updateError) throw updateError;
      toast({ title: "Profile updated!" });
      onProfileUpdated({
        ...profile,
        name: form.name,
        address: form.address,
        profile_image_url,
      });
      onClose();
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message || String(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v ? onClose() : undefined}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <Input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
          />
          <div>
            <label className="block mb-1 font-medium">Profile Image</label>
            <Input
              name="profile_image_file"
              type="file"
              accept="image/*"
              onChange={handleChange}
            />
            {preview && <img src={preview} alt="Preview" className="mt-2 max-h-20 rounded" />}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
