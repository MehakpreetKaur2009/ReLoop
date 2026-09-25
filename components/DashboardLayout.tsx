/**
 * ReLoop Dashboard Layout
 * Persistent header + role-based dashboard content
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { HeaderBar } from "./HeaderBar";
import { SubscriptionModal } from "./SubscriptionModal";
import MallDashboard from "@/pages/MallDashboard";
import TruckDashboard from "@/pages/TruckDashboard";
import { RotateCcw, ArrowRight } from "lucide-react";

export default function DashboardLayout() {
  const [, navigate] = useLocation();
  const { user } = useApp();
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <HeaderBar onSubscriptionClick={() => setSubscriptionOpen(true)} />
      <main>
        {user.role === "mall" ? <MallDashboard /> : user.role === "truck" ? <TruckDashboard /> : (
          <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#92400E]/5 flex items-center justify-center mb-4">
              <RotateCcw className="w-8 h-8 text-[#92400E]/30" />
            </div>
            <p className="text-lg font-bold text-[#1E293B] mb-2">No Role Selected</p>
            <p className="text-sm text-[#64748B] mb-6 max-w-xs">
              Please select your role to access the ReLoop dashboard and start closing the loop.
            </p>
            <Button onClick={() => navigate("/role-select")} className="bg-[#059669] hover:bg-[#047857] text-white font-semibold shadow-lg shadow-[#059669]/15">
              Select Your Role
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </main>
      <SubscriptionModal
        open={subscriptionOpen}
        onOpenChange={setSubscriptionOpen}
      />
    </div>
  );
}
