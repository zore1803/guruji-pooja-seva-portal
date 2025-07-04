import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, Users } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
  };
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function DashboardStats({ stats, activeFilter, onFilterChange }: DashboardStatsProps) {
  const statCards = [
    {
      key: "all",
      icon: Calendar,
      value: stats.totalBookings,
      label: "Total Bookings",
      color: "text-blue-600"
    },
    {
      key: "pending",
      icon: Clock,
      value: stats.pendingBookings,
      label: "Pending",
      color: "text-orange-600"
    },
    {
      key: "confirmed",
      icon: Users,
      value: stats.confirmedBookings,
      label: "Confirmed",
      color: "text-green-600"
    },
    {
      key: "completed",
      icon: CheckCircle,
      value: stats.completedBookings,
      label: "Completed",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <Button
            key={card.key}
            variant={activeFilter === card.key ? "default" : "outline"}
            onClick={() => onFilterChange(card.key)}
            className="p-6 h-auto flex-col items-start hover:scale-105 transition-transform"
          >
            <div className="flex items-center w-full">
              <Icon className={`w-8 h-8 ${card.color}`} />
              <div className="ml-4 text-left">
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="text-sm">{card.label}</div>
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
}