/**
 * ReLoop Profile Page
 * Manifest-style profile editing with kraft accents
 */
import { useLocation } from "wouter";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft, Store, Truck, Mail, FileText, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const [, navigate] = useLocation();
  const { user, updateProfile } = useApp();
  const isMall = user.role === "mall";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-white border-b border-[#92400E]/10 sticky top-0 z-10 shadow-sm">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 -ml-2 rounded-lg hover:bg-[#92400E]/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#1E293B]" />
        </button>
        <div className="flex items-center gap-2 ml-1">
          <FileText className="w-4.5 h-4.5 text-[#92400E]" />
          <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wide">Profile Settings</h2>
        </div>
      </div>

      <div className="px-6 py-6 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          {/* Email (non-editable) */}
          <div className="manifest-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#059669]/8 flex items-center justify-center border border-[#059669]/15">
              <Mail className="w-5 h-5 text-[#059669]" />
            </div>
            <div>
              <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wide">Email</p>
              <p className="text-sm font-medium text-[#1E293B]">{user.email || "Not set"}</p>
            </div>
          </div>

          {/* Role */}
          <div className={`p-4 flex items-center gap-3 ${isMall ? "surface-kraft" : "surface-emerald"} rounded-xl`}>
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
              <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wide">Role</p>
              <p className="text-sm font-bold text-[#1E293B]">
                {isMall ? "Mall / Retail Hub" : "Truck Driver / Fleet"}
              </p>
            </div>
          </div>

          {/* Editable Fields — manifest card */}
          <div className={`p-5 pl-6 space-y-4 ${isMall ? "manifest-card" : "manifest-card-emerald"}`}>
            <div className={`manifest-header ${isMall ? "" : "emerald"}`}>
              {isMall ? (
                <Store className="w-4 h-4 text-[#92400E]" />
              ) : (
                <Truck className="w-4 h-4 text-[#059669]" />
              )}
              <span className={`text-xs font-bold uppercase tracking-wider ${isMall ? "text-[#92400E]" : "text-[#059669]"}`}>
                {isMall ? "Facility Details" : "Fleet Details"}
              </span>
            </div>

            {isMall ? (
              <>
                <div>
                  <Label htmlFor="profileMall" className="text-xs font-semibold text-[#1E293B] uppercase tracking-wide">
                    Mall / Store Name
                  </Label>
                  <Input
                    id="profileMall"
                    defaultValue={user.mallName}
                    onBlur={(e) => updateProfile({ mallName: e.target.value })}
                    className="mt-1.5 h-11 bg-white border-[#92400E]/15 text-[#1E293B] focus:border-[#059669] focus:ring-[#059669]/20"
                  />
                </div>
                <div>
                  <Label htmlFor="profileAddress" className="text-xs font-semibold text-[#1E293B] uppercase tracking-wide">
                    Address
                  </Label>
                  <Input
                    id="profileAddress"
                    defaultValue={user.mallAddress}
                    onBlur={(e) => updateProfile({ mallAddress: e.target.value })}
                    className="mt-1.5 h-11 bg-white border-[#92400E]/15 text-[#1E293B] focus:border-[#059669] focus:ring-[#059669]/20"
                  />
                </div>
                <div>
                  <Label htmlFor="profileContact" className="text-xs font-semibold text-[#1E293B] uppercase tracking-wide">
                    Contact Person
                  </Label>
                  <Input
                    id="profileContact"
                    defaultValue={user.contactPerson}
                    onBlur={(e) => updateProfile({ contactPerson: e.target.value })}
                    className="mt-1.5 h-11 bg-white border-[#92400E]/15 text-[#1E293B] focus:border-[#059669] focus:ring-[#059669]/20"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="profileDriver" className="text-xs font-semibold text-[#1E293B] uppercase tracking-wide">
                    Driver Name
                  </Label>
                  <Input
                    id="profileDriver"
                    defaultValue={user.driverName}
                    onBlur={(e) => updateProfile({ driverName: e.target.value })}
                    className="mt-1.5 h-11 bg-white border-[#059669]/15 text-[#1E293B] focus:border-[#059669] focus:ring-[#059669]/20"
                  />
                </div>
                <div>
                  <Label htmlFor="profileTruck" className="text-xs font-semibold text-[#1E293B] uppercase tracking-wide">
                    Truck Number
                  </Label>
                  <Input
                    id="profileTruck"
                    defaultValue={user.truckNumber}
                    onBlur={(e) => updateProfile({ truckNumber: e.target.value })}
                    className="mt-1.5 h-11 bg-white border-[#059669]/15 text-[#1E293B] focus:border-[#059669] focus:ring-[#059669]/20"
                  />
                </div>
              </>
            )}
          </div>

          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full h-12 bg-[#059669] hover:bg-[#047857] text-white font-semibold active:scale-[0.97] transition-transform duration-160 shadow-lg shadow-[#059669]/15"
            style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
