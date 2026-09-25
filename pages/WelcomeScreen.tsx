/**
 * ReLoop Welcome & Authentication Screen
 * Eco-Industrial Materialism — kraft paper textures, stamp badges, manifest feel
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

export default function WelcomeScreen() {
  const [, navigate] = useLocation();
  const { login, signup } = useApp();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      signup(email, password);
    } else {
      login(email, password);
    }
    navigate("/role-select");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative overflow-hidden">
      {/* Subtle kraft paper grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2392400E' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-sm"
        >
          {/* Logo with recycling loop motif */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <img
                src="/manus-storage/reloop-logo-icon_c18a3b9c.png"
                alt="ReLoop Logo"
                className="w-16 h-16"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#92400E] rounded-full flex items-center justify-center">
                <RotateCcw className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold ml-3 tracking-tight">
              <span className="text-[#059669]">Re</span>
              <span className="text-[#1E293B]">Loop</span>
            </h1>
          </div>

          {/* Stamp badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex justify-center mb-5"
          >
            <span className="stamp-badge stamp-badge-emerald transform -rotate-1">
              Circular Logistics
            </span>
          </motion.div>

          {/* Headline — assertive and brand-voice */}
          <h2 className="text-2xl font-bold text-[#1E293B] text-center mb-2 leading-tight">
            The First Step to a<br />Circular Tomorrow
          </h2>

          {/* Subtext */}
          <p className="text-[#64748B] text-center text-sm mb-8 leading-relaxed">
            Connecting retail waste directly with empty logistics return trips.
          </p>

          {/* Auth Form — manifest-style card */}
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            onSubmit={handleSubmit}
            className="manifest-card p-5"
          >
            {/* Card header with tear line */}
            <div className="manifest-header">
              <RotateCcw className="w-4 h-4 text-[#92400E]" />
              <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
                {isSignup ? "New Registration" : "Access Account"}
              </span>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-[#F5F0EB] rounded-lg p-1 mb-4 border border-[#92400E]/10">
              <button
                type="button"
                onClick={() => setIsSignup(false)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 ${
                  !isSignup
                    ? "bg-[#059669] text-white shadow-sm"
                    : "text-[#92400E]/60 hover:text-[#92400E]"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsSignup(true)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 ${
                  isSignup
                    ? "bg-[#059669] text-white shadow-sm"
                    : "text-[#92400E]/60 hover:text-[#92400E]"
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="email" className="text-xs font-semibold text-[#1E293B] uppercase tracking-wide">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 h-11 bg-white border-[#92400E]/15 text-[#1E293B] placeholder:text-gray-400 focus:border-[#059669] focus:ring-[#059669]/20"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-xs font-semibold text-[#1E293B] uppercase tracking-wide">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 h-11 bg-white border-[#92400E]/15 text-[#1E293B] placeholder:text-gray-400 focus:border-[#059669] focus:ring-[#059669]/20"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#059669] hover:bg-[#047857] text-white font-semibold text-base shadow-lg shadow-[#059669]/20 active:scale-[0.97] transition-transform duration-160 mt-5"
              style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
            >
              Continue
            </Button>
          </motion.form>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="pb-8 text-center relative z-10">
        <p className="text-xs text-[#94A3B8]">
          By continuing, you agree to ReLoop's Terms of Service
        </p>
      </div>
    </div>
  );
}
