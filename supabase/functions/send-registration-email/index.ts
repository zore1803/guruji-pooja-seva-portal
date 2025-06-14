
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req: Request): Promise<Response> => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { email, name } = body as { email: string; name: string };

    if (!email) {
      return new Response(JSON.stringify({ error: "Missing email" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const result = await resend.emails.send({
      from: "E-Guruji <no-reply@eguruji.com>",
      to: [email],
      subject: "Welcome to E-Guruji!",
      html: `
        <div style="font-family: Arial,sans-serif;font-size:16px;">
          <h2>Welcome, ${name || "Devotee"}!</h2>
          <p>You have successfully registered at <b>E-Guruji</b>.</p>
          <p>Thank you for joining us. You can now explore our services and book Pujas as per your need.</p>
          <p><b>E-Guruji Team</b></p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
