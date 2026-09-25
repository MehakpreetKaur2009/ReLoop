/**
 * ReLoop Role Selection Screen (Step 2)
 * Eco-Industrial Materialism: manifest-style cards, stamp badges, kraft aesthetics
 */
import { useLocation } from "wouter";
import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import { Store, Truck, ArrowLeft } from "lucide-react";

export default function RoleSelectScreen() {
  const [, navigate] = useLocation();
  const { setUserRole } = useApp();

  const handleSelect = (role: "mall" | "truck") => {
    setUserRole(role);
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header with back button */}
      <div className="flex items-center px-4 py-4">
        <button
          onClick={() => navigate("/")}
          className="p-2 -ml-2 rounded-lg hover:bg-[#92400E]/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#1E293B]" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-sm text-center mb-8"
        >
          <span className="stamp-badge stamp-badge-kraft mb-3">
            Step 2 of 3
          </span>
          <h1 className="text-2xl font-bold text-[#1E293B] mt-3 mb-2">
            Identify Your Role
          </h1>
          <p className="text-[#64748B] text-sm leading-relaxed">
            Select how you will participate in the circular loop today:
          </p>
        </motion.div>

        {/* Role Cards — manifest-style */}
        <div className="w-full max-w-sm space-y-4">
          {/* Mall / Retail Hub */}
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            onClick={() => handleSelect("mall")}
            className="w-full group"
          >
            <div className="manifest-card p-5 active:scale-[0.97] transition-transform duration-160 hover:shadow-lg group-hover:border-l-[#92400E]" style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}>
              {/* Manifest header */}
              <div className="flex items-center gap-2 mb-3">
                <Store className="w-4 h-4 text-[#92400E]" />
                <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
                  Waste Generator
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#92400E]/8 flex items-center justify-center flex-shrink-0 border border-[#92400E]/15">
                  <Store className="w-7 h-7 text-[#92400E]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1E293B] text-lg">Mall / Retail Hub</h3>
                  <p className="text-[#64748B] text-sm mt-0.5">Log waste, broadcast pickups</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-dashed border-[#92400E]/15">
                <span className="text-xs font-medium text-[#92400E] bg-[#92400E]/5 px-2.5 py-1 rounded border border-[#92400E]/10">
                  Cardboard · Plastic · Pallets
                </span>
              </div>
            </div>
          </motion.button>

          {/* Truck Driver */}
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            onClick={() => handleSelect("truck")}
            className="w-full group"
          >
            <div className="manifest-card-emerald p-5 active:scale-[0.97] transition-transform duration-160 hover:shadow-lg group-hover:border-l-[#059669]" style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}>
              {/* Manifest header */}
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-4 h-4 text-[#059669]" />
                <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">
                  Return Fleet
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#059669]/8 flex items-center justify-center flex-shrink-0 border border-[#059669]/15">
                  <Truck className="w-7 h-7 text-[#059669]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1E293B] text-lg">Truck Driver / Fleet</h3>
                  <p className="text-[#64748B] text-sm mt-0.5">Earn on empty return trips</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-dashed border-[#059669]/15">
                <span className="text-xs font-medium text-[#059669] bg-[#059669]/5 px-2.5 py-1 rounded border border-[#059669]/10">
                  Backhaul · Fuel Savings · Extra Revenue
                </span>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
