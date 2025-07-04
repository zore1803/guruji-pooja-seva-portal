import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CheckCircle, X, Calendar } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  email: string;
  expertise?: string;
}

export interface Booking {
  id: string;
  created_by?: string;
  pandit_id?: string | null;
  service_id: number | null;
  tentative_date: string | null;
  status: string | null;
  location: string | null;
  address: string | null;
  created_at: string;
  assigned_at?: string | null;
  customer_profile?: Profile | null;
  service?: { name: string } | null;
  assigned_pandit?: Profile | null;
  invoice_url?: string | null;
}

interface BookingsTableProps {
  bookings: Booking[];
  loading: boolean;
  role: 'customer' | 'pandit' | 'admin';
  onAcceptBooking?: (bookingId: string) => void;
  onRejectBooking?: (bookingId: string) => void;
  showActions?: boolean;
}

export default function BookingsTable({ 
  bookings, 
  loading, 
  role, 
  onAcceptBooking, 
  onRejectBooking,
  showActions = false 
}: BookingsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-orange-100 text-orange-800";
      case "assigned": return "bg-blue-100 text-blue-800";
      case "confirmed": return "bg-green-100 text-green-800";
      case "completed": return "bg-purple-100 text-purple-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No bookings found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {role === 'pandit' && <TableHead>Customer</TableHead>}
              {role === 'customer' && <TableHead>Service</TableHead>}
              {role === 'admin' && (
                <>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                </>
              )}
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              {role === 'customer' && <TableHead>Assigned Pandit</TableHead>}
              {role === 'pandit' && <TableHead>Assigned At</TableHead>}
              {role === 'admin' && <TableHead>Created</TableHead>}
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-gray-50 transition-colors">
                {role === 'pandit' && (
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.customer_profile?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{booking.customer_profile?.email || 'No email'}</div>
                    </div>
                  </TableCell>
                )}
                {role === 'customer' && (
                  <TableCell className="font-medium">
                    {booking.service?.name || "Unknown Service"}
                  </TableCell>
                )}
                {role === 'admin' && (
                  <>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.customer_profile?.name}</div>
                        <div className="text-sm text-gray-500">{booking.customer_profile?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.service?.name || "Unknown Service"}</TableCell>
                  </>
                )}
                <TableCell>
                  {booking.tentative_date ? format(new Date(booking.tentative_date), "PPP") : "Not set"}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm">{booking.location || "Not specified"}</div>
                    <div className="text-xs text-gray-500">{booking.address || ""}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status || "pending")}`}>
                    {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || "Pending"}
                  </span>
                </TableCell>
                {role === 'customer' && (
                  <TableCell>
                    {booking.assigned_pandit ? (
                      <div className="text-sm">
                        <div className="font-medium">{booking.assigned_pandit.name}</div>
                        <div className="text-gray-500 text-xs">{booking.assigned_pandit.expertise || "Pandit"}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Not assigned</span>
                    )}
                  </TableCell>
                )}
                {role === 'pandit' && (
                  <TableCell>
                    {booking.assigned_at ? format(new Date(booking.assigned_at), "PPp") : "--"}
                  </TableCell>
                )}
                {role === 'admin' && (
                  <TableCell>
                    <div className="text-xs text-gray-500">
                      {format(new Date(booking.created_at), "PPp")}
                    </div>
                  </TableCell>
                )}
                {showActions && (
                  <TableCell>
                    {booking.status === "assigned" && onAcceptBooking && onRejectBooking && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => onAcceptBooking(booking.id)}
                          className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-transform"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onRejectBooking(booking.id)}
                          className="hover:scale-105 transition-transform"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                    {booking.status === "confirmed" && (
                      <span className="text-green-600 text-sm font-medium">Accepted</span>
                    )}
                    {booking.status === "completed" && (
                      <span className="text-purple-600 text-sm font-medium">Completed</span>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}