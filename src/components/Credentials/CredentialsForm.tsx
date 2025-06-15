import * as React from "react";
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
import { Calendar as CalendarIcon } from "lucide-react";

export type CredentialsFormValues = {
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

type Props = {
  onSubmit: (data: CredentialsFormValues) => Promise<void> | void;
  loading: boolean;
  serviceId?: number | string; // NEW
};

export default function CredentialsForm({ onSubmit, loading, serviceId }: Props) {
  const form = useForm<CredentialsFormValues>({
    defaultValues,
    mode: "onTouched",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        {/* Service ID field, read-only */}
        {serviceId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service ID
            </label>
            <input
              type="text"
              value={serviceId}
              readOnly
              className="w-full border bg-gray-100 rounded px-3 py-2 text-sm cursor-not-allowed text-gray-500"
              tabIndex={-1}
            />
          </div>
        )}

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
                <Input placeholder="Enter city/town/village" {...field} autoComplete="off" />
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
  );
}
