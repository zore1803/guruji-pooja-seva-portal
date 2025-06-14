
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

type CredentialsFormValues = {
  fromDate: Date | null;
  toDate: Date | null;
  location: string;
  address: string;
};

const defaultValues: CredentialsFormValues = {
  fromDate: null,
  toDate: null,
  location: "",
  address: "",
};

export default function CredentialsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSession();

  const form = useForm<CredentialsFormValues>({
    defaultValues,
    mode: "onTouched",
  });

  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: CredentialsFormValues) => {
    if (!user) {
      toast({
        title: "You must be logged in!",
        description: "Please log in to proceed.",
      });
      return;
    }

    if (!id) {
      toast({
        title: "Invalid Service",
        description: "No service ID found.",
      });
      return;
    }

    if (!data.fromDate || !data.toDate) {
      toast({
        title: "Date Required",
        description: "Please provide both dates.",
      });
      return;
    }

    setLoading(true);
    // Insert booking to Supabase
    const { error } = await supabase.from("bookings").insert([
      {
        service_id: Number(id),
        customer_id: user.id,
        tentative_date: format(data.fromDate, "yyyy-MM-dd"),
        // Store address info in invoice_url as temp (if required, or just leave)
        status: "pending",
        // Not inserting confirmed_date, pandit_id yet
        // Optionally, can extend table to store location/address separately. For now, add to invoice_url.
        invoice_url: JSON.stringify({
          location: data.location,
          address: data.address,
        }),
      },
    ]);

    setLoading(false);

    if (error) {
      toast({
        title: "Error submitting booking.",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Credentials Submitted",
      description: (
        <div className="text-left">
          <div><b>From:</b> {data.fromDate ? format(data.fromDate, "PPP") : "--"}</div>
          <div><b>To:</b> {data.toDate ? format(data.toDate, "PPP") : "--"}</div>
          <div><b>Location:</b> {data.location}</div>
          <div><b>Address:</b> {data.address}</div>
        </div>
      ),
    });
    setTimeout(() => {
      navigate(`/product/${id}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f8ede8] flex flex-col items-center justify-start py-10 px-2">
      <div className="bg-white max-w-xl w-full rounded-xl shadow p-8">
        <h1 className="text-2xl font-extrabold mb-6 text-orange-700 text-center">Select Dates &amp; Location</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
            <div className="flex flex-col md:flex-row gap-6">
              <FormField
                control={form.control}
                name="fromDate"
                rules={{ required: "From date is required" }}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>From Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            type="button"
                            className={
                              !field.value
                                ? "text-muted-foreground w-full justify-start"
                                : "w-full justify-start"
                            }
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                            {field.value ? format(field.value, "PPP") : <span>Pick start date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="toDate"
                rules={{ required: "To date is required" }}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>To Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            type="button"
                            className={
                              !field.value
                                ? "text-muted-foreground w-full justify-start"
                                : "w-full justify-start"
                            }
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                            {field.value ? format(field.value, "PPP") : <span>Pick end date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="location"
              rules={{ required: "Please enter the city/town/village location" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter city/town/village"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              rules={{ required: "Please enter the full address" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter full address (house no, street, etc)"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="lg"
              className="bg-orange-700 w-full text-white hover:bg-orange-800"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
