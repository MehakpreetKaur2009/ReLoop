/**
 * ReLoop Subscription Modal
 * 3 Tier Comparison with stamp badges, kraft/emerald accents
 */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Crown, Zap, Shield, RotateCcw } from "lucide-react";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto sm:rounded-2xl border-0 bg-white">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#EAB308]/10 flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#EAB308]" />
            </div>
            <DialogTitle className="text-xl font-bold text-[#1E293B]">
              Choose Your Plan
            </DialogTitle>
          </div>
          <DialogDescription className="text-center text-[#64748B] text-sm">
            Upgrade for AI-powered logistics, instant dispatch, and priority matching.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Basic Plan */}
          <div className="relative rounded-xl border-2 border-[#92400E]/15 p-5 bg-[#F8FAFC]">
            <div className="absolute -top-3 left-4">
              <span className="stamp-badge stamp-badge-kraft">
                Current Plan
              </span>
            </div>
            <div className="flex items-center justify-between mb-3 mt-1">
              <h3 className="font-bold text-[#1E293B] text-lg">Basic</h3>
              <div className="text-right">
                <span className="text-lg font-bold text-[#059669]">₹0</span>
                <p className="text-[10px] text-[#94A3B8]">10-day trial</p>
              </div>
            </div>
            <p className="text-xs text-[#64748B] mb-3 leading-relaxed">
              Manual waste logging, standard pickup matching, basic ESG summary.
            </p>
            <div className="space-y-1.5">
              {["Manual waste logging", "Standard pickup matching", "Basic ESG summary"].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#92400E]/40" />
                  <span className="text-xs text-[#64748B]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gold Tier */}
          <div className="relative rounded-xl border-2 border-[#EAB308] p-5 bg-[#EAB308]/3 shadow-md">
            <div className="absolute -top-3 left-4">
              <span className="stamp-badge stamp-badge-gold flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" />
                Most Popular
              </span>
            </div>
            <div className="flex items-center justify-between mb-3 mt-1">
              <h3 className="font-bold text-[#1E293B] text-lg">Gold</h3>
              <div className="text-right">
                <span className="text-lg font-bold text-[#EAB308]">₹1,499</span>
                <p className="text-[10px] text-[#94A3B8]">/ month</p>
              </div>
            </div>
            <p className="text-xs text-[#64748B] mb-3 leading-relaxed">
              Unlimited AI pickup matching, instant driver dispatch, 24/7 route optimization.
            </p>
            <div className="space-y-1.5">
              {["Unlimited AI matching", "Instant driver dispatch", "24/7 route optimization", "Priority waste categorization"].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#EAB308]" />
                  <span className="text-xs text-[#1E293B] font-medium">{feature}</span>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 h-10 bg-[#EAB308] hover:bg-[#CA8A04] text-white font-semibold active:scale-[0.97] transition-transform duration-160">
              Upgrade to Gold
            </Button>
          </div>

          {/* Platinum Tier */}
          <div className="relative rounded-xl border-2 border-[#1E293B] p-5 bg-white shadow-sm">
            <div className="absolute -top-3 left-4">
              <span className="stamp-badge" style={{
                color: "#1E293B",
                background: "oklch(0.25 0.02 250 / 0.05)",
                borderColor: "oklch(0.25 0.02 250 / 0.15)",
              }}>
                <Shield className="w-2.5 h-2.5" />
                Enterprise
              </span>
            </div>
            <div className="flex items-center justify-between mb-3 mt-1">
              <h3 className="font-bold text-[#1E293B] text-lg">Platinum</h3>
              <div className="text-right">
                <span className="text-lg font-bold text-[#1E293B]">₹2,999</span>
                <p className="text-[10px] text-[#94A3B8]">/ month</p>
              </div>
            </div>
            <p className="text-xs text-[#64748B] mb-3 leading-relaxed">
              All Gold features + Priority AI Matching, ESG Carbon Credit Reporting, Mall ERP API integration.
            </p>
            <div className="space-y-1.5">
              {[
                "All Gold features",
                "Priority AI matching",
                "ESG carbon credit reporting",
                "Mall ERP API integration",
                "Dedicated fleet manager",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E293B]" />
                  <span className="text-xs text-[#1E293B] font-medium">{feature}</span>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 h-10 bg-[#1E293B] hover:bg-[#334155] text-white font-semibold active:scale-[0.97] transition-transform duration-160">
              Upgrade to Platinum
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
