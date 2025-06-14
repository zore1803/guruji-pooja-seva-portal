
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Load secrets
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { booking_id } = await req.json();

    // 1. Fetch booking details, service, customer profile, pandit profile
    const headers = {
      apiKey: supabaseServiceRole,
      Authorization: `Bearer ${supabaseServiceRole}`,
      "Content-Type": "application/json",
    };

    // Get booking row
    const bookingRes = await fetch(`${supabaseUrl}/rest/v1/bookings?id=eq.${booking_id}&select=*`, {
      headers,
    });
    const [booking] = await bookingRes.json();
    if (!booking) throw new Error("Booking not found");

    // Get service row
    let service = null;
    if (booking.service_id) {
      const serviceRes = await fetch(`${supabaseUrl}/rest/v1/services?id=eq.${booking.service_id}&select=*`, { headers });
      [service] = await serviceRes.json();
    }

    // Get profiles for customer and pandit
    const customerId = booking.customer_id;
    const panditId = booking.pandit_id;

    // Fetch customer profile
    let customer = null;
    if (customerId) {
      const customerRes = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${customerId}&select=*`, { headers });
      [customer] = await customerRes.json();
    }

    // Fetch pandit profile
    let pandit = null;
    if (panditId) {
      const panditRes = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${panditId}&select=*`, { headers });
      [pandit] = await panditRes.json();
    }

    // Check for emails to send
    const emailsToSend: Array<{ to: string; html: string; role: string; name: string }> = [];

    // Prepare email to customer
    if (customer?.email) {
      emailsToSend.push({
        to: customer.email,
        name: customer.name,
        role: "customer",
        html: `
          <div style="font-family: Arial,sans-serif;font-size:16px;">
            <h2>Thank you for your booking, ${customer.name}!</h2>
            <p>Your booking${service ? ` for <b>${service.name}</b>` : ""} has been placed successfully.</p>
            <p>Booking Details:</p>
            <ul>
              <li><b>Booking ID:</b> ${booking.id}</li>
              ${
                service
                  ? `<li><b>Service:</b> ${service.name}</li>
                     <li><b>Description:</b> ${service.description}</li>
                     <li><b>Price:</b> ₹${(service.price / 100).toFixed(2)}</li>`
                  : ""
              }
              ${booking.tentative_date ? `<li><b>Date:</b> ${booking.tentative_date}</li>` : ""}
              ${pandit && pandit.name ? `<li><b>Pandit:</b> ${pandit.name}</li>` : ""}
            </ul>
            <p>We will keep you informed about confirmation and further updates.</p>
            <hr />
            <p><b>E-Guruji Team</b></p>
          </div>
        `,
      });
    }

    // Prepare email to pandit (only if pandit assigned at creation)
    if (pandit?.email) {
      emailsToSend.push({
        to: pandit.email,
        name: pandit.name,
        role: "pandit",
        html: `
          <div style="font-family: Arial,sans-serif;font-size:16px;">
            <h2>New Booking Assigned: ${pandit.name}</h2>
            <p>You have been assigned a new booking${service ? ` for <b>${service.name}</b>` : ""}.</p>
            <p>Booking Details:</p>
            <ul>
              <li><b>Booking ID:</b> ${booking.id}</li>
              ${
                service
                  ? `<li><b>Service:</b> ${service.name}</li>
                     <li><b>Description:</b> ${service.description}</li>
                     <li><b>Price:</b> ₹${(service.price / 100).toFixed(2)}</li>`
                  : ""
              }
              ${booking.tentative_date ? `<li><b>Date:</b> ${booking.tentative_date}</li>` : ""}
              ${customer && customer.name ? `<li><b>Customer:</b> ${customer.name}</li>` : ""}
              ${customer && customer.email ? `<li><b>Customer Email:</b> ${customer.email}</li>` : ""}
            </ul>
            <p>Please move ahead with contacting the customer and confirming the details.</p>
            <hr />
            <p><b>E-Guruji Team</b></p>
          </div>
        `,
      });
    }

    // Send emails via resend
    for (const mail of emailsToSend) {
      const result = await resend.emails.send({
        from: "E-Guruji <no-reply@eguruji.com>",
        to: [mail.to],
        subject: mail.role === "pandit" ? "E-Guruji: New Booking Assigned" : "E-Guruji: Booking Confirmation",
        html: mail.html,
      });
      console.log(`Email sent to ${mail.role} (${mail.to}):`, result);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("send-booking-notification error", error);
    return new Response(JSON.stringify({ error: error.message || String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
