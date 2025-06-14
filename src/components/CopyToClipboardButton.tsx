
import { Button } from "@/components/ui/button";
import { Clipboard, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

type Props = {
  value: string;
  size?: "sm" | "default";
  className?: string;
};

export default function CopyToClipboardButton({ value, size = "sm", className }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast({ title: "Copied!", description: `Copied: ${value}` });
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      className={className + " px-2 py-0 h-7"}
      onClick={handleCopy}
      aria-label="Copy UUID"
    >
      {copied ? <Check size={15} className="text-green-600" /> : <Clipboard size={15} />}
    </Button>
  );
}
