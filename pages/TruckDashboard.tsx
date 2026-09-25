/**
 * ReLoop Truck Driver Dashboard
 * Eco-Industrial Materialism: emerald manifest cards, industrial cockpit, stamp badges
 * Features: Route banner, Live Map View, Nearby requests, Accepted task view, Impact widget, Fuel wallet
 */
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MapView } from "@/components/Map";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  Package,
  IndianRupee,
  Fuel,
  Phone,
  MapPinned,
  Hash,
  CheckCircle2,
  QrCode,
  Wallet,
  TrendingUp,
  Route,
  Zap,
  Check,
  Truck,
  Radio,
  Map as MapIcon,
  Layers,
} from "lucide-react";

type TaskState = "idle" | "accepted";

interface PickupRequest {
  id: string;
  mallName: string;
  dock: string;
  weight: number;
  material: string;
  distance: number;
  incentive: number;
  address: string;
  contactPerson: string;
  contactPhone: string;
  lat: number;
  lng: number;
}

export default function TruckDashboard() {
  const [taskState, setTaskState] = useState<TaskState>("idle");
  const [checklist, setChecklist] = useState([false, false, false]);
  const [showMap, setShowMap] = useState(true);
  const [mapLayers, setMapLayers] = useState({ traffic: true, transit: false });
  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const pickupRequests: PickupRequest[] = [
    {
      id: "1",
      mallName: "Central Mall",
      dock: "Dock B",
      weight: 85,
      material: "Cardboard",
      distance: 1.2,
      incentive: 450,
      address: "123 MG Road, Pune 411001",
      contactPerson: "Rajesh Kumar",
      contactPhone: "+91 98765 43210",
      lat: 18.5204,
      lng: 73.8567,
    },
    {
      id: "2",
      mallName: "Phoenix Marketcity",
      dock: "Dock A, Bay 2",
      weight: 120,
      material: "Plastic Wrap",
      distance: 2.4,
      incentive: 680,
      address: "456 Viman Nagar, Pune 411014",
      contactPerson: "Priya Sharma",
      contactPhone: "+91 87654 32109",
      lat: 18.5644,
      lng: 73.9163,
    },
  ];

  const request = pickupRequests[0];

  // Mall coordinates for the route
  const mallLocation = { lat: request.lat, lng: request.lng };
  const hubLocation = { lat: 18.5590, lng: 73.9269 }; // North Logistics Hub

  const toggleChecklist = (index: number) => {
    setChecklist((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    // Initialize directions renderer
    const renderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: "#059669",
        strokeWeight: 5,
        strokeOpacity: 0.8,
      },
      markerOptions: {
        animation: google.maps.Animation.DROP,
      },
    });
    directionsRendererRef.current = renderer;

    // Calculate and display route
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: hubLocation,
        destination: mallLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          renderer.setDirections(result);
        }
      }
    );

    // Add truck marker at hub location
    const truckIcon = {
      path: "M12 2L2 22H22L12 2Z",
      fillColor: "#059669",
      fillOpacity: 1,
      strokeColor: "#047857",
      strokeWeight: 1,
      scale: 1.2,
    };

    new google.maps.marker.AdvancedMarkerElement({
      map,
      position: hubLocation,
      title: "Your Truck",
      content: (() => {
        const el = document.createElement("div");
        el.innerHTML = `
          <div style="background:#059669;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(5,150,105,0.4);border:2px solid white;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3"/><path d="M14 9h4l4 4v5h-2a1 1 0 1 1-2 0h-4a1 1 0 1 1-2 0"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
          </div>
        `;
        return el;
      })(),
    });

    // Add mall marker
    new google.maps.marker.AdvancedMarkerElement({
      map,
      position: mallLocation,
      title: request.mallName,
      content: (() => {
        const el = document.createElement("div");
        el.innerHTML = `
          <div style="background:#92400E;color:white;border-radius:8px;padding:4px 8px;font-size:11px;font-weight:700;box-shadow:0 2px 8px rgba(146,64,14,0.3);border:2px solid white;white-space:nowrap;">
            ${request.mallName}
          </div>
        `;
        return el;
      })(),
    });

    // Add traffic layer
    if (mapLayers.traffic) {
      new google.maps.TrafficLayer().setMap(map);
    }

    // Fit bounds to show route
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(hubLocation);
    bounds.extend(mallLocation);
    map.fitBounds(bounds, { top: 80, bottom: 80, left: 40, right: 40 });
  }, [request.mallName, mapLayers.traffic]);

  // Add second mall marker for other requests
  const handleOtherRequestMapReady = useCallback((map: google.maps.Map) => {
    const renderer2 = new google.maps.DirectionsRenderer({
      map,
      polylineOptions: {
        strokeColor: "#D97706",
        strokeWeight: 4,
        strokeOpacity: 0.6,
        icons: [{ icon: { path: google.maps.SymbolPath.CIRCLE, scale: 0 }, offset: "0", repeat: "20px" }],
      },
    });

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: hubLocation,
        destination: { lat: pickupRequests[1].lat, lng: pickupRequests[1].lng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          renderer2.setDirections(result);
        }
      }
    );

    // Truck marker
    new google.maps.marker.AdvancedMarkerElement({
      map,
      position: hubLocation,
      title: "Your Truck",
      content: (() => {
        const el = document.createElement("div");
        el.innerHTML = `<div style="background:#059669;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(5,150,105,0.4);border:2px solid white;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"/></svg>
        </div>`;
        return el;
      })(),
    });

    pickupRequests.forEach((req) => {
      new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: req.lat, lng: req.lng },
        title: req.mallName,
        content: (() => {
          const el = document.createElement("div");
          el.innerHTML = `<div style="background:${req.id === "1" ? "#059669" : "#D97706"};color:white;border-radius:8px;padding:4px 8px;font-size:11px;font-weight:700;box-shadow:0 2px 8px rgba(0,0,0,0.2);border:2px solid white;white-space:nowrap;">
            ${req.mallName} · ${req.weight}kg
          </div>`;
          return el;
        })(),
      });
    });

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(hubLocation);
    bounds.extend(mallLocation);
    bounds.extend({ lat: pickupRequests[1].lat, lng: pickupRequests[1].lng });
    map.fitBounds(bounds, { top: 80, bottom: 80, left: 40, right: 40 });
  }, []);

  return (
    <div className="px-4 pb-8 pt-4 space-y-5 max-w-lg mx-auto">
      {/* Route Active Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="surface-emerald rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Navigation className="w-4.5 h-4.5 text-[#059669]" />
            <span className="text-sm font-bold text-[#059669] uppercase tracking-wide">Route Active</span>
          </div>
          <span className="stamp-badge stamp-badge-emerald">GPS Live</span>
        </div>
        <p className="text-sm text-[#1E293B] font-semibold">
          {request.mallName} <span className="text-[#059669] mx-1">→</span> North Logistics Hub
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#059669] bg-[#059669]/8 px-2.5 py-1 rounded border border-[#059669]/15">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            Bay Empty
          </span>
          <span className="text-xs text-[#64748B]">GPS Active · Optimizing</span>
        </div>
      </motion.div>

      {/* Map Toggle Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4.5 h-4.5 text-[#92400E]" />
          <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
            Live Route Map
          </span>
        </div>
        <Switch
          checked={showMap}
          onCheckedChange={setShowMap}
          className="data-[state=checked]:bg-[#059669]"
        />
      </div>

      {/* Live Map View */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-xl border-2 border-[#059669]/20 shadow-lg"
          >
            <div className="h-[280px] w-full relative">
              {taskState === "accepted" ? (
                <MapView
                  initialCenter={hubLocation}
                  initialZoom={12}
                  onMapReady={handleMapReady}
                />
              ) : (
                <MapView
                  initialCenter={hubLocation}
                  initialZoom={12}
                  onMapReady={handleOtherRequestMapReady}
                />
              )}
              {/* Map overlay badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-lg shadow-md border border-[#92400E]/10">
                  <MapIcon className="w-3.5 h-3.5 text-[#059669]" />
                  <span className="text-[10px] font-bold text-[#1E293B]">Live Route</span>
                  {mapLayers.traffic && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308] animate-pulse" />
                  )}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 z-10 flex gap-1.5">
                <button
                  onClick={() => setMapLayers(prev => ({ ...prev, traffic: !prev.traffic }))}
                  className={`p-1.5 rounded-lg shadow-md border text-[9px] font-bold backdrop-blur ${
                    mapLayers.traffic
                      ? "bg-[#EAB308]/90 border-[#EAB308]/30 text-white"
                      : "bg-white/95 border-[#92400E]/10 text-[#64748B]"
                  }`}
                >
                  Traffic
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nearby Pickup Requests */}
      <AnimatePresence mode="wait">
        {taskState === "idle" ? (
          <motion.div
            key="requests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <MapPinned className="w-4.5 h-4.5 text-[#059669]" />
              <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">
                Nearby Pickup Requests
              </span>
              <span className="text-[10px] text-[#64748B] ml-auto">AI geofence · 5 km</span>
            </div>

            {pickupRequests.map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="manifest-card-emerald overflow-hidden"
              >
                <div className="p-5 pl-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-[#1E293B]">
                        {req.mallName} — {req.dock}
                      </p>
                      <p className="text-sm text-[#64748B] mt-1 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5" />
                        {req.weight} kg {req.material}
                      </p>
                      <p className="text-sm text-[#64748B] mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {req.distance} km detour
                      </p>
                    </div>
                    <div className="bg-[#059669]/8 px-3 py-1.5 rounded-lg border border-[#059669]/15">
                      <p className="text-xs font-bold text-[#059669] flex items-center gap-0.5">
                        +₹{req.incentive}
                      </p>
                      <p className="text-[10px] text-[#059669]/60 font-medium">Fuel Allowance</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => setTaskState("accepted")}
                      className="flex-1 h-10 bg-[#059669] hover:bg-[#047857] text-white font-semibold text-sm shadow-md shadow-[#059669]/15 active:scale-[0.97] transition-transform duration-160"
                      style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                    >
                      Accept Pickup
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-10 border-[#059669]/20 text-[#64748B] font-medium text-sm hover:bg-[#059669]/5"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="accepted"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Accepted Task Header */}
            <div className="bg-gradient-to-r from-[#059669] to-[#047857] rounded-xl p-5 text-white shadow-lg shadow-[#059669]/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold text-lg">Pickup Accepted</span>
                </div>
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded font-medium">
                  In Progress
                </span>
              </div>
              <p className="text-sm text-white/80">
                {request.mallName} — {request.dock}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded flex items-center gap-1">
                  <Route className="w-3 h-3" />
                  {request.distance} km
                </span>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  {request.weight} kg
                </span>
              </div>
            </div>

            {/* Mall Details */}
            <div className="manifest-card p-5 pl-6 space-y-1">
              <div className="manifest-header">
                <MapPin className="w-4 h-4 text-[#92400E]" />
                <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
                  Pickup Details
                </span>
              </div>
              
              <div className="data-row">
                <MapPin className="w-4.5 h-4.5 text-[#92400E] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wide">Address</p>
                  <p className="text-sm text-[#1E293B] font-medium">{request.address}</p>
                </div>
              </div>

              <div className="data-row">
                <Phone className="w-4.5 h-4.5 text-[#059669] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wide">Contact Person</p>
                  <p className="text-sm text-[#1E293B] font-medium">
                    {request.contactPerson} —{" "}
                    <a href={`tel:${request.contactPhone}`} className="text-[#059669] font-semibold">
                      {request.contactPhone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="data-row">
                <Hash className="w-4.5 h-4.5 text-[#D97706] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wide">Loading Dock</p>
                  <p className="text-sm text-[#1E293B] font-semibold">{request.dock}</p>
                </div>
              </div>

              <div className="data-row">
                <Package className="w-4.5 h-4.5 text-[#92400E] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wide">Load</p>
                  <p className="text-sm text-[#1E293B] font-bold">
                    {request.weight} kg {request.material}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Checklist */}
            <div className="manifest-card p-5 pl-6">
              <div className="manifest-header">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
                  Pickup Checklist
                </span>
                <span className="stamp-badge stamp-badge-emerald ml-auto">
                  {checklist.filter(Boolean).length}/3
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  "Drive to Loading Dock B",
                  "Weigh & Verify Waste Load",
                  "Scan QR Code to Confirm Pickup",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                      checklist[i]
                        ? "bg-[#059669]/5 border-[#059669]/20"
                        : "bg-white border-[#92400E]/10"
                    }`}
                  >
                    <button
                      onClick={() => toggleChecklist(i)}
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                      style={{
                        borderColor: checklist[i] ? "#059669" : "#D1D5DB",
                        backgroundColor: checklist[i] ? "#059669" : "transparent",
                      }}
                    >
                      {checklist[i] && (
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      )}
                    </button>
                    <span
                      className={`text-sm font-medium transition-all duration-200 ${
                        checklist[i] ? "text-[#059669] line-through" : "text-[#1E293B]"
                      }`}
                    >
                      {item}
                    </span>
                    {i === 2 && (
                      <QrCode className="w-4 h-4 text-[#94A3B8] ml-auto" />
                    )}
                  </motion.div>
                ))}
              </div>

              {checklist.every(Boolean) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-[#059669]/8 rounded-xl border border-[#059669]/20 text-center"
                >
                  <p className="text-sm font-bold text-[#059669]">
                    Pickup Confirmed! +₹{request.incentive} Fuel Allowance Earned
                  </p>
                </motion.div>
              )}
            </div>

            {/* Driver Impact & Earnings */}
            <div className="manifest-card p-5 pl-6">
              <div className="manifest-header">
                <TrendingUp className="w-4 h-4 text-[#059669]" />
                <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
                  Impact & Earnings Today
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-[#059669]/5 border border-[#059669]/15">
                  <IndianRupee className="w-5 h-5 text-[#059669] mx-auto mb-1.5" />
                  <p className="text-lg font-bold text-[#059669]">₹1,850</p>
                  <p className="text-[10px] text-[#64748B] font-medium">Revenue Today</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <Route className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
                  <p className="text-lg font-bold text-blue-600">48</p>
                  <p className="text-[10px] text-[#64748B] font-medium">Empty Miles Saved</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <Fuel className="w-5 h-5 text-[#D97706] mx-auto mb-1.5" />
                  <p className="text-lg font-bold text-[#D97706]">₹320</p>
                  <p className="text-[10px] text-[#64748B] font-medium">Fuel Bonus</p>
                </div>
              </div>
            </div>

            {/* Fuel Rebate Wallet */}
            <div className="bg-gradient-to-r from-[#059669] to-[#047857] rounded-xl p-5 text-white shadow-lg shadow-[#059669]/15">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  <h3 className="font-bold text-base">Fuel Rebate Wallet</h3>
                </div>
                <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                  Digital Wallet
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">₹2,340</span>
                <span className="text-sm text-white/60 mb-0.5">available points</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="text-xs text-white/80">
                  Earn 20 points per backhaul completed
                </span>
              </div>
              <div className="mt-3 bg-white/10 rounded-xl p-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60 font-medium">Monthly Target</span>
                  <span className="text-white font-bold">₹5,000</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: "47%" }}
                  />
                </div>
              </div>
            </div>

            {/* Back button */}
            <Button
              onClick={() => {
                setTaskState("idle");
                setChecklist([false, false, false]);
              }}
              variant="outline"
              className="w-full h-10 border-[#059669]/20 text-[#64748B] font-medium text-sm hover:bg-[#059669]/5"
            >
              <Radio className="w-4 h-4 mr-2" />
              View Other Requests
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
