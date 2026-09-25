import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck, Truck, PackageCheck, TrendingUp, Zap } from "lucide-react";

interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedPickupId?: number;
}

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
}

const typeIcons: Record<string, typeof Truck> = {
  pickup_request: Truck,
  pickup_accepted: PackageCheck,
  pickup_completed: PackageCheck,
  plan_expiring: Zap,
  system: Bell,
  esg_update: TrendingUp,
};

const typeColors: Record<string, string> = {
  pickup_request: "bg-[#059669]/10 text-[#059669]",
  pickup_accepted: "bg-[#D97706]/10 text-[#D97706]",
  pickup_completed: "bg-[#059669]/10 text-[#059669]",
  plan_expiring: "bg-[#EAB308]/10 text-[#EAB308]",
  system: "bg-[#64748B]/10 text-[#64748B]",
  esg_update: "bg-[#059669]/10 text-[#059669]",
};

function formatTimeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
}: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && unreadCount > 0) {
      // Mark all as read when opening
      onMarkAllRead();
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-[#92400E]/5 transition-colors">
          <Bell className="w-5 h-5 text-[#1E293B]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] bg-[#059669] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 animate-[pulse_2s_ease-in-out_infinite]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 mt-2 border-[#92400E]/10 shadow-xl" style={{ borderRadius: "0.75rem" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#92400E]/8">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#1E293B]">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-[#059669]/10 text-[#059669] text-[10px] font-bold">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { onMarkAllRead(); }}
              className="text-[10px] text-[#64748B] hover:text-[#059669] h-6 px-2"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#92400E]/5 flex items-center justify-center mb-3">
                <Bell className="w-5 h-5 text-[#92400E]/30" />
              </div>
              <p className="text-sm font-medium text-[#1E293B]">No notifications yet</p>
              <p className="text-xs text-[#64748B] mt-1">We'll alert you when there's activity</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const Icon = typeIcons[notif.type] || Bell;
              const colorClass = typeColors[notif.type] || typeColors.system;
              return (
                <button
                  key={notif.id}
                  onClick={() => onMarkRead(notif.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-[#92400E]/5 transition-colors hover:bg-[#92400E]/3 ${
                    !notif.read ? "bg-[#059669]/3" : ""
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold text-[#1E293B] ${!notif.read ? "" : "opacity-80"}`}>
                      {notif.title}
                    </p>
                    <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-[#94A3B8] mt-1">{formatTimeAgo(notif.createdAt)}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-[#059669] shrink-0 mt-2" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 border-t border-[#92400E]/8">
            <p className="text-[10px] text-center text-[#94A3B8]">
              Showing {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// Demo notifications for initial state
export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: "pickup_request",
    title: "New Pickup Request Available",
    message: "A mall 2.1 km away has 150 kg of cardboard ready for pickup. Detour only 3.2 km.",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 2,
    type: "pickup_accepted",
    title: "Pickup #1042 Accepted by Driver",
    message: "Your cardboard waste at Greenfield Mall has been accepted for pickup by Driver #TRK-402.",
    read: false,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    relatedPickupId: 1042,
  },
  {
    id: 3,
    type: "esg_update",
    title: "Monthly ESG Report Ready",
    message: "Your July ESG Impact Report is ready. You diverted 2.4 tons of waste this month.",
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
  },
  {
    id: 4,
    type: "plan_expiring",
    title: "Your Free Trial Ends Soon",
    message: "Your free trial ends in 10 days. Upgrade to Gold to unlock unlimited pickups and priority matching.",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
  },
];
