
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OTPVerificationProps {
  email: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

export default function OTPVerification({ email, onVerificationComplete, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60); // Start with 60 second countdown

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      });

      if (error) {
        console.error("OTP verification error:", error);
        toast({
          title: "Verification Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Email verified successfully!",
        });
        onVerificationComplete();
      }
    } catch (error) {
      console.error("Unexpected error during OTP verification:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during verification",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        console.error("Resend OTP error:", error);
        toast({
          title: "Resend Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "OTP Sent",
          description: "A new OTP has been sent to your email",
        });
        setCountdown(60);
        setOtp(""); // Clear the current OTP input
      }
    } catch (error) {
      console.error("Unexpected error during OTP resend:", error);
      toast({
        title: "Error",
        description: "Failed to resend OTP",
        variant: "destructive",
      });
    }
    
    setResendLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-orange-700">
          Verify Your Email
        </CardTitle>
        <CardDescription className="text-center">
          We've sent a 6-digit verification code to<br/>
          <strong>{email}</strong>
          <br/>
          <span className="text-sm text-gray-500 mt-2 block">
            Check your inbox and spam folder for the verification email
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              className="text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-700" 
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify Code"}
          </Button>
        </form>
        
        <div className="mt-4 text-center space-y-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleResendOTP}
            disabled={resendLoading || countdown > 0}
            className="text-sm"
          >
            {resendLoading ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
          </Button>
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="text-sm"
            >
              Back to Registration
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
