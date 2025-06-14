
import React from "react";
import CopyToClipboardButton from "@/components/CopyToClipboardButton";
import { CustomerProfile } from "@/hooks/useCustomerProfile";

type ProfileSummaryProps = {
  profile: CustomerProfile | null;
  loading?: boolean;
};

export default function ProfileSummary({ profile, loading }: ProfileSummaryProps) {
  if (loading) return <div className="mb-4 text-sm text-gray-400">Loading profile...</div>;
  if (!profile) return null;
  return (
    <div className="flex flex-col md:flex-row gap-2 mb-4 items-center justify-end">
      <span className="text-xs text-gray-600 font-semibold">{profile.name}</span>
      <span className="text-[11px] text-gray-400 font-mono select-all">
        User UUID: {profile.id}
      </span>
      <CopyToClipboardButton value={profile.id} />
    </div>
  );
}
