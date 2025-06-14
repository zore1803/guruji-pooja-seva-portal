
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type CompletedBooking = {
  id: string;
  customer_name: string;
  customer_email: string;
  service_name: string;
  completed_date: string | null;
  amount: number;
};

type Props = {
  panditId: string;
};

export default function PanditCompletedPoojasTable({ panditId }: Props) {
  const [records, setRecords] = useState<CompletedBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!panditId) return;
    setLoading(true);

    // Fetch completed bookings for this pandit
    async function fetchCompleted() {
      // 1. Fetch bookings (status: completed) assigned to this pandit
      const { data: bookings, error: bookingErr } = await supabase
        .from("bookings")
        .select("id, customer_id, confirmed_date, service_id, services:service_id (name), profiles:customer_id (name, email)")
        .eq("pandit_id", panditId)
        .eq("status", "completed")
        .order("confirmed_date", { ascending: false });

      if (bookingErr || !bookings) {
        setRecords([]);
        setLoading(false);
        return;
      }

      // 2. For each booking, sum paid payments for earnings
      const promises = bookings.map(async (b: any) => {
        let paymentAmount = 0;
        const { data: payments } = await supabase
          .from("payments")
          .select("amount")
          .eq("booking_id", b.id)
          .eq("status", "paid");
        if (payments && Array.isArray(payments) && payments.length > 0) {
          paymentAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        }
        return {
          id: b.id,
          customer_name: b.profiles?.name || "Unknown",
          customer_email: b.profiles?.email || "",
          service_name: b.services?.name || "Unknown Service",
          completed_date: b.confirmed_date,
          amount: paymentAmount,
        };
      });

      const withPayments = await Promise.all(promises);
      setRecords(withPayments);
      setLoading(false);
    }
    fetchCompleted();
  }, [panditId]);

  if (loading) {
    return <div className="py-6 text-gray-500">Loading completed poojas...</div>;
  }
  if (records.length === 0) {
    return <div className="py-6 text-gray-500">No completed poojas yet.</div>;
  }

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-3">Completed Poojas & Earnings Log</h2>
      <div className="rounded-md border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Earnings (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map(r => (
              <TableRow key={r.id}>
                <TableCell>
                  {r.completed_date
                    ? new Date(r.completed_date).toLocaleDateString()
                    : "-"
                  }
                </TableCell>
                <TableCell>{r.service_name}</TableCell>
                <TableCell>{r.customer_name}</TableCell>
                <TableCell>{r.customer_email}</TableCell>
                <TableCell>{r.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
