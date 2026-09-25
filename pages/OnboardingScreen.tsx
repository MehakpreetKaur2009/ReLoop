/**
 * ReLoop Role Onboarding Questionnaire (Step 3)
 * Manifest-style form — registration as a logistics document
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowLeft, Store, Truck, FileText, CheckCircle2 } from "lucide-react";

export default function OnboardingScreen() {
  const [, navigate] = useLocation();
  const { user, updateProfile } = useApp();
  const role = user.role;

  // Mall form fields
  const [mallName, setMallName] = useState("");
  const [mallAddress, setMallAddress] = useState("");
  const [loadingDock, setLoadingDock] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [wasteType, setWasteType] = useState("");

  // Truck form fields
  const [driverName, setDriverName] = useState("");
  const [truckNumber, setTruckNumber] = useState("");
  const [truckPhone, setTruckPhone] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [gpsEnabled, setGpsEnabled] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "mall") {
      updateProfile({
        mallName,
        mallAddress,
        loadingDock,
        contactPerson,
        phoneNumber,
        wasteType,
      });
    } else {
      updateProfile({
        driverName,
        truckNumber,
        phoneNumber: truckPhone,
        vehicleCapacity,
        gpsEnabled,
      });
    }
    navigate("/dashboard");
  };

  const isMall = role === "mall";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 py-4">
        <button
          onClick={() => navigate("/role-select")}
          className="p-2 -ml-2 rounded-lg hover:bg-[#92400E]/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#1E293B]" />
        </button>
        <div className="flex items-center gap-2 ml-1">
          <FileText className="w-4.5 h-4.5 text-[#92400E]" />
          <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wide">
            Registration Manifest
          </h2>
        </div>
        <span className="stamp-badge stamp-badge-kraft ml-auto">
          Step 3 of 3
        </span>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pb-8 overflow-y-auto">
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          onSubmit={handleSubmit}
          className="max-w-md mx-auto space-y-5 pt-4"
        >
          {/* Role indicator card */}
          <div className={`p-4 rounded-xl flex items-center gap-3 ${
            isMall ? "surface-kraft" : "surface-emerald"
          }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isMall ? "bg-[#92400E]/10" : "bg-[#059669]/10"
            }`}>
              {isMall ? (
                <Store className="w-5 h-5 text-[#92400E]" />
              ) : (
                <Truck className="w-5 h-5 text-[#059669]" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: isMall ? "#92400E" : "#059669" }}>
                {isMall ? "Waste Generator" : "Return Fleet"}
              </p>
              <p className="text-sm font-medium text-[#1E293B]">
                {isMall ? "Mall / Retail Hub Registration" : "Truck Driver / Fleet Registration"}
              </p>
            </div>
          </div>

          {isMall ? (
            <div className="manifest-card p-5 space-y-4">
              <div className="manifest-header">
                <Store className="w-4 h-4 text-[#92400E]" />
                <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
                  Facility Details
                </span>
              </div>

              <div>
                <Label htmlFor="mallName" className="text-xs font-semibold text-[#1E293B] uppercase tracking-wide">
                  Mall / Store Name
                </Label>
                <Input
                  id="mallName"
                  placeholder="e.g., Central Mall Pune"
                  value={mallName}
                  onChange={(e) => setMallName(e.target.value)}
                  className="mt-1.5 h-11 bg-white border-[#92400E]/15 text-[#1E293B] placeholder:text-gray-400 focus:border-[#059669] focus:ring-[#059669]/20"
                  required
                />
              </div>

              <div>
                <Label htmlFor="mallAddress" className="text-xs font-semibold text-[#1E293B] uppercase tracking-wide">
                  Complete Address
                </Label>
                <Input
                  id="mallAddress"
                  placeholder="e.g., 123 MG Road, Pune 411001"
                  value={mallAddress}
                  onChange={(e) => setMallAddress(e.target.value)}
                  className="mt-1.5 h-11 bg-white border-[#92400E]/15 text-[#1E293B] placeholder:text-gray-400 focus:border-[#059669] focus:ring-[#059669]/20"
                  required
                />
              </div>

              <div>
                <Label htmlFor="loadingDock" className="text-xs font-semibold text-[#1E293B] uppercase tracking-wide">
                  Loading Dock Number
                </Label>
                <Input
                  id="loadingDock"
                  placeholder="e.g., Dock B, Bay 3"
                  value={loadingDock}
                  onChange={(e) => setLoadingDock(e.target.value)}
                  className="mt-1.5 h-11 bg-white border-[#92400E]/15 text-[#1E293B] placeholder:text-gray-400 focus:border-[#059669] focus:ring-[#059669]/20"
                  required
                />
              </div>

              <div className="tear-line" />

              <div className="manifest-header">
                <FileText className="w-4 h-4 text-[#92400E]" />
                <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
                  Contact & Operations
                </span>
              </div>

              <div>
                <Label htmlFor="contactPerson" className="text-xs font-semibold text-[#1E293B] uppercase tracking-wide">
                  Contact Person
                </Label>
                <Input
                  id="contactPerson"
                  placeholder="e.g., Rajesh Kumar"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="mt-1.5 h-11 bg-white border-[#92400E]/15 text-[#1E293B] placeholder:text-gray-400 focus:border-[#059669] focus:ring-[#059669]/20"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="text-xs font-semibold text-[#1E293B] uppercase tracking-wide">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="e.g., +91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1.5 h-11 bg-white border-[#92400E]/15 text-[#1E293B] placeholder:text-gray-400 focus:border-[#059669] focus:ring-[#059669]/20"
                  required
                />
              </div>

              <div>
                <Label htmlFor="wasteType" className="text-xs font-semibold text-[#1E293B] uppercase tracking-wide">
                  Primary Waste Type
                </Label>
                <Select value={wasteType} onValueChange={setWasteType}>
                  <SelectTrigger className="mt-1.5 h-11 bg-white border-[#92400E]/15 text-[#1E293B] focus:border-[#059669] focus:ring-[#059669]/20">
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardboard">Cardboard</SelectItem>
                    <SelectItem value="plastic">Plastic</SelectItem>
                    <SelectItem value="pallets">Wooden Pallets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="manifest-card-emerald p-5 space-y-4">
              <div className="manifest-header emerald">
                <Truck className="w-4 h-4 text-[#059669]" />
                <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">
                  Fleet Details
                </span>
              </div>

              <div>
                <Label htmlFor="driverName" className="text-xs font-semibold text-[#1E293B] uppercase tracking-wide">
                  Driver Full Name
                </Label>
                <Input
                  id="driverName"
                  placeholder="e.g., Amit Singh"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="mt-1.5 h-11 bg-white border-[#059669]/15 text-[#1E293B] placeholder:text-gray-400 focus:border-[#059669] focus:ring-[#059669]/20"
                  required
                />
              </div>

              <div>
                <Label htmlFor="truckNumber" className="text-xs font-semibold text-[#1E293B] uppercase tracking-wide">
                  Truck Number / License Plate
                </Label>
                <Input
                  id="truckNumber"
                  placeholder="e.g., PB-10-8842"
                  value={truckNumber}
                  onChange={(e) => setTruckNumber(e.target.value)}
                  className="mt-1.5 h-11 bg-white border-[#059669]/15 text-[#1E293B] placeholder:text-gray-400 focus:border-[#059669] focus:ring-[#059669]/20"
                  required
                />
              </div>

              <div>
                <Label htmlFor="truckPhone" className="text-xs font-semibold text-[#1E293B] uppercase tracking-wide">
                  Phone Number
                </Label>
                <Input
                  id="truckPhone"
                  type="tel"
                  placeholder="e.g., +91 87654 32109"
                  value={truckPhone}
                  onChange={(e) => setTruckPhone(e.target.value)}
                  className="mt-1.5 h-11 bg-white border-[#059669]/15 text-[#1E293B] placeholder:text-gray-400 focus:border-[#059669] focus:ring-[#059669]/20"
                  required
                />
              </div>

              <div>
                <Label htmlFor="vehicleCapacity" className="text-xs font-semibold text-[#1E293B] uppercase tracking-wide">
                  Vehicle Capacity (Tons)
                </Label>
                <Input
                  id="vehicleCapacity"
                  type="number"
                  placeholder="e.g., 5"
                  value={vehicleCapacity}
                  onChange={(e) => setVehicleCapacity(e.target.value)}
                  className="mt-1.5 h-11 bg-white border-[#059669]/15 text-[#1E293B] placeholder:text-gray-400 focus:border-[#059669] focus:ring-[#059669]/20"
                  required
                />
              </div>

              <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-[#059669]/15">
                <div>
                  <p className="text-sm font-medium text-[#1E293B]">Allow Live Location Access</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">Enable GPS for route optimization</p>
                </div>
                <Switch
                  checked={gpsEnabled}
                  onCheckedChange={setGpsEnabled}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-12 bg-[#059669] hover:bg-[#047857] text-white font-semibold text-base shadow-lg shadow-[#059669]/20 active:scale-[0.97] transition-transform duration-160"
              style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Complete Registration & Enter Dashboard
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
