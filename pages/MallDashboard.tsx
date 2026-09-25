/**
 * ReLoop Mall / Retailer Dashboard
 * Eco-Industrial Materialism: kraft manifest cards, stamp badges, tear lines
 * Features: Trial banner, Log Waste, Live Matching, ESG Impact, Scheduled Pickups
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Trash2,
  TreePine,
  IndianRupee,
  MapPin,
  Clock,
  CalendarDays,
  Plus,
  Truck,
  AlertTriangle,
  Recycle,
  Radio,
  Check,
} from "lucide-react";

type MaterialType = "cardboard" | "plastic" | "pallets" | null;

interface TruckMatch {
  id: string;
  truckNumber: string;
  distance: number;
  eta: string;
  assigned: boolean;
}

export default function MallDashboard() {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>(null);
  const [weight, setWeight] = useState("");
  const [broadcasting, setBroadcasting] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);

  const [nearbyTrucks] = useState<TruckMatch[]>([
    { id: "1", truckNumber: "PB-10-8842", distance: 1.2, eta: "~4 min", assigned: true },
    { id: "2", truckNumber: "DL-01-4412", distance: 1.8, eta: "~6 min", assigned: false },
  ]);

  const handleBroadcast = () => {
    if (!selectedMaterial || !weight) return;
    setBroadcasting(true);
    setTimeout(() => {
      setBroadcasting(false);
      setShowMatches(true);
    }, 1500);
  };

  const addWeight = (amount: number) => {
    const current = parseInt(weight) || 0;
    setWeight(String(current + amount));
  };

  const materialIcons: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    cardboard: { icon: <Package className="w-5 h-5" />, label: "Cardboard", color: "#92400E" },
    plastic: { icon: <Trash2 className="w-5 h-5" />, label: "Plastic Wrap", color: "#64748B" },
    pallets: { icon: <TreePine className="w-5 h-5" />, label: "Wooden Pallets", color: "#D97706" },
  };

  return (
    <div className="px-4 pb-8 pt-4 space-y-5 max-w-lg mx-auto">
      {/* Trial Status Banner — kraft surface */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="surface-kraft rounded-xl p-4 flex items-start gap-3"
      >
        <AlertTriangle className="w-5 h-5 text-[#92400E] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-[#92400E]">
            Trial Status: Basic Plan
          </p>
          <p className="text-xs text-[#92400E]/70 mt-0.5">
            10 days remaining. Upgrade to Gold or Platinum for AI Route Priority.
          </p>
        </div>
      </motion.div>

      {/* Log Waste Section — manifest card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="manifest-card overflow-hidden"
      >
        <div className="p-5 pl-6">
          {/* Manifest header */}
          <div className="manifest-header">
            <Recycle className="w-4 h-4 text-[#059669]" />
            <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
              Log Waste Pickup
            </span>
            <span className="stamp-badge stamp-badge-emerald ml-auto">
              Active
            </span>
          </div>

          {/* Material Selection */}
          <div className="flex gap-2 mb-4">
            {(["cardboard", "plastic", "pallets"] as MaterialType[]).map((type) =>
              type ? (
                <button
                  key={type}
                  onClick={() => setSelectedMaterial(type)}
                  className={`flex-1 py-3 px-2 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1.5 active:scale-[0.97] ${
                    selectedMaterial === type
                      ? "border-[#92400E] bg-[#92400E]/5"
                      : "border-[#92400E]/10 bg-white hover:border-[#92400E]/20"
                  }`}
                  style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                >
                  <span className={selectedMaterial === type ? "text-[#92400E]" : "text-[#94A3B8]"}>
                    {materialIcons[type].icon}
                  </span>
                  <span className={`text-xs font-medium ${selectedMaterial === type ? "text-[#92400E]" : "text-[#94A3B8]"}`}>
                    {materialIcons[type].label}
                  </span>
                </button>
              ) : null
            )}
          </div>

          {/* Weight Input */}
          <div className="mb-4">
            <label className="text-xs font-bold text-[#1E293B] uppercase tracking-wide mb-1.5 block">
              Weight (kg)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 120"
                className="flex-1 h-11 px-4 rounded-xl border border-[#92400E]/15 bg-white text-[#1E293B] text-base font-semibold placeholder:text-gray-400 focus:border-[#059669] focus:ring-[#059669]/20 outline-none"
              />
              <div className="flex gap-1.5">
                <button
                  onClick={() => addWeight(10)}
                  className="w-11 h-11 rounded-xl bg-[#059669]/8 border border-[#059669]/15 text-[#059669] font-bold text-sm flex items-center justify-center hover:bg-[#059669]/12 active:scale-[0.95] transition-all"
                >
                  +10
                </button>
                <button
                  onClick={() => addWeight(50)}
                  className="w-11 h-11 rounded-xl bg-[#059669]/8 border border-[#059669]/15 text-[#059669] font-bold text-sm flex items-center justify-center hover:bg-[#059669]/12 active:scale-[0.95] transition-all"
                >
                  +50
                </button>
              </div>
            </div>
          </div>

          {/* Broadcast Button */}
          <Button
            onClick={handleBroadcast}
            disabled={!selectedMaterial || !weight || broadcasting}
            className="w-full h-12 bg-[#059669] hover:bg-[#047857] text-white font-semibold text-base shadow-lg shadow-[#059669]/20 active:scale-[0.97] transition-transform duration-160 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
          >
            {broadcasting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Broadcasting...
              </span>
            ) : (
              "Broadcast Pickup Request"
            )}
          </Button>
        </div>
      </motion.div>

      {/* Live Matching Display — manifest card */}
      <AnimatePresence>
        {showMatches && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="manifest-card-emerald overflow-hidden"
          >
            <div className="p-5 pl-6">
              <div className="manifest-header emerald">
                <Radio className="w-4 h-4 text-[#059669]" />
                <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">
                  Nearby Trucks Detected
                </span>
                <span className="text-[10px] text-[#64748B] ml-auto">AI geofence · 5 km</span>
              </div>

              <div className="space-y-3">
                {nearbyTrucks.map((truck, i) => (
                  <motion.div
                    key={truck.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className={`relative rounded-xl border-2 p-4 ${
                      truck.assigned
                        ? "border-[#059669] bg-[#059669]/5"
                        : "border-[#059669]/15 bg-white"
                    }`}
                  >
                    {truck.assigned && (
                      <div className="absolute -top-2.5 right-3">
                        <span className="stamp-badge stamp-badge-emerald">
                          Auto-Assigned
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[#1E293B] text-sm">
                          Truck #{truck.truckNumber}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-[#64748B]">
                            <MapPin className="w-3 h-3" />
                            {truck.distance} km
                          </span>
                          <span className="flex items-center gap-1 text-xs text-[#64748B]">
                            <Clock className="w-3 h-3" />
                            {truck.eta}
                          </span>
                        </div>
                      </div>
                      {truck.assigned && (
                        <div className="w-8 h-8 rounded-full bg-[#059669] flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    {truck.assigned && (
                      <div className="mt-3 pt-3 border-t border-[#059669]/15">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
                          <span className="text-xs text-[#059669] font-medium">
                            Driver notified — ETA {truck.eta}
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ESG Impact Summary — manifest card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="manifest-card overflow-hidden"
      >
        <div className="p-5 pl-6">
          <div className="manifest-header">
            <TreePine className="w-4 h-4 text-[#059669]" />
            <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
              ESG Impact Summary
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-[#059669]/5 border border-[#059669]/15">
              <Package className="w-5 h-5 text-[#059669] mx-auto mb-1.5" />
              <p className="text-lg font-bold text-[#059669]">2,450</p>
              <p className="text-[10px] text-[#64748B] font-medium">Waste Diverted (kg)</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <TreePine className="w-5 h-5 text-[#059669] mx-auto mb-1.5" />
              <p className="text-lg font-bold text-[#059669]">186</p>
              <p className="text-[10px] text-[#64748B] font-medium">CO₂ Saved (kg)</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-amber-50 border border-amber-100">
              <IndianRupee className="w-5 h-5 text-[#D97706] mx-auto mb-1.5" />
              <p className="text-lg font-bold text-[#D97706]">12,500</p>
              <p className="text-[10px] text-[#64748B] font-medium">Cost Saved (₹)</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scheduled Pickups — manifest card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="manifest-card overflow-hidden"
      >
        <div className="p-5 pl-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#92400E]" />
              <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
                Scheduled Pickups
              </span>
            </div>
            <Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs border-[#92400E]/30 text-[#92400E] hover:bg-[#92400E]/5">
                  <Plus className="w-3 h-3 mr-1" />
                  Schedule
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-[#92400E]/10" align="end">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={(date) => {
                    setScheduledDate(date);
                    setScheduleOpen(false);
                  }}
                  className="rounded-xl border-0"
                />
              </PopoverContent>
            </Popover>
          </div>

          {scheduledDate && (
            <div className="bg-[#92400E]/5 rounded-xl p-3 border border-[#92400E]/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#92400E]/10 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-[#92400E]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1E293B]">
                  Recurring pickup scheduled
                </p>
                <p className="text-xs text-[#64748B]">
                  Every day at 6:00 AM — Starting{" "}
                  {scheduledDate.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}

          {!scheduledDate && (
            <div className="text-center py-5">
              <div className="w-12 h-12 rounded-full bg-[#92400E]/5 flex items-center justify-center mx-auto mb-2">
                <Truck className="w-5 h-5 text-[#92400E]/30" />
              </div>
              <p className="text-xs text-[#94A3B8]">
                Schedule automated recurring daily packaging pickups
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
