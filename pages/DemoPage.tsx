/**
 * Demo Page - Shows both role dashboards for testing
 */
import { useLocation } from "wouter";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";

export default function DemoPage() {
  const [, navigate] = useLocation();
  const { updateProfile } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-6 gap-4">
      <h1 className="text-xl font-bold text-[#1E293B]">Demo Mode</h1>
      <p className="text-sm text-[#64748B] text-center">Choose which dashboard to preview:</p>
      <div className="flex gap-3 mt-4">
        <Button
          onClick={() => {
            updateProfile({ role: "mall" });
            navigate("/dashboard");
          }}
          className="bg-[#92400E] hover:bg-[#78350F] text-white"
        >
          Mall Dashboard
        </Button>
        <Button
          onClick={() => {
            updateProfile({ role: "truck" });
            navigate("/dashboard");
          }}
          className="bg-[#059669] hover:bg-[#047857] text-white"
        >
          Truck Dashboard
        </Button>
      </div>
    </div>
  );
}
