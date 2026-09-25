import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/contexts/AppContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubscriptionModal } from "./SubscriptionModal";
import { NotificationDropdown, DEMO_NOTIFICATIONS } from "./NotificationDropdown";
import { Crown, MoreVertical, Edit, Moon, Sun, HelpCircle, LogOut, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface HeaderBarProps {
  onSubscriptionClick: () => void;
}

export function HeaderBar({ onSubscriptionClick }: HeaderBarProps) {
  const [, navigate] = useLocation();
  const { logout, toggleTheme, isDark, user } = useApp();
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(2);

  // Use local state for notifications (demo data)
  const handleMarkRead = (id: number) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-[3px] border-[#92400E]/15 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <img
                src="/manus-storage/reloop-logo-icon_c18a3b9c.png"
                alt="ReLoop"
                className="w-8 h-8"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#92400E] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <RotateCcw className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-[#059669]">Re</span>
              <span className="text-[#1E293B]">Loop</span>
            </span>
          </button>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5">
            {/* Bell Notification */}
            <NotificationDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkRead={handleMarkRead}
              onMarkAllRead={handleMarkAllRead}
            />

            {/* Crown / Subscription */}
            <button
              onClick={() => setSubscriptionOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#EAB308]/8 border-[1.5px] border-[#EAB308]/20 hover:bg-[#EAB308]/12 transition-colors"
            >
              <Crown className="w-4 h-4 text-[#EAB308]" />
              <span className="text-[10px] font-bold text-[#92400E] uppercase tracking-wider hidden sm:inline">
                {user.plan || "Free"}: {user.daysLeft || 10}d Left
              </span>
            </button>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-lg hover:bg-[#92400E]/5 transition-colors">
                  <MoreVertical className="w-5 h-5 text-[#1E293B]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1 border-[#92400E]/10 shadow-lg">
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="gap-2 text-[#1E293B]"
                >
                  <Edit className="w-4 h-4 text-[#92400E]" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme} className="gap-2 text-[#1E293B]">
                  {isDark ? <Sun className="w-4 h-4 text-[#EAB308]" /> : <Moon className="w-4 h-4 text-[#64748B]" />}
                  {isDark ? "Toggle Light Mode" : "Toggle Dark Mode"}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#92400E]/10" />
                <DropdownMenuItem
                  onClick={() => toast.info("Help & Support — coming soon")}
                  className="gap-2 text-[#1E293B]"
                >
                  <HelpCircle className="w-4 h-4 text-[#64748B]" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#92400E]/10" />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="gap-2 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <SubscriptionModal
        open={subscriptionOpen}
        onOpenChange={setSubscriptionOpen}
      />
    </>
  );
}
