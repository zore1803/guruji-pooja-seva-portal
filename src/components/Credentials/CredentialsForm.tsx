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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INDIAN_STATES, STATE_CITIES } from "@/data/states";

export type CredentialsFormValues = {
  fromDate: Date | null;
  toDate: Date | null;
  state: string;
  city: string;
  address: string;
};

const defaultValues: CredentialsFormValues = {
  fromDate: null,
  toDate: null,
  state: "",
  city: "",
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

  const watchedState = form.watch("state");

  return (
    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 min-h-screen py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-0 animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-scale-in">
              <span className="text-2xl">🕉️</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Book Your Sacred Ceremony
            </h2>
            <p className="text-gray-600 mt-2">Select dates and location for your spiritual journey</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="state"
            rules={{ required: "Please select your state" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue("city", ""); // Reset city when state changes
                }} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="city"
            rules={{ required: "Please select your city" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!watchedState}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={watchedState ? "Select city" : "Select state first"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {watchedState && STATE_CITIES[watchedState]?.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Your Sacred Booking...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>🙏</span>
                  Confirm Sacred Booking
                </div>
              )}
            </Button>
          </form>
        </Form>
        </div>
      </div>
    </div>
  );
}
