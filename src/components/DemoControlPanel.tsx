"use client";

import { useState } from "react";
import { useDemoStore } from "@/store/demoStore";
import { Play, CheckSquare, Square, X, RefreshCw, PlusCircle, Zap, CheckCircle2, Sliders, ChevronUp, ChevronDown, Sparkles } from "lucide-react";
import { Button, Badge } from "./ui";
import { motion, AnimatePresence } from "framer-motion";

export function DemoControlPanel() {
  const {
    isDemoMode,
    resetDemo,
    addDelivery,
    deliveries,
    updateDeliveryStatus,
    riders,
    updateRiderStatus,
    addSharedRoute,
  } = useDemoStore();

  const [isOpen, setIsOpen] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);

  if (!isDemoMode) return null;

  const simulateNewOrder = () => {
    const areas = ["Nerul", "Kharghar", "Vashi", "Sanpada", "Belapur"];
    const pickup = areas[Math.floor(Math.random() * areas.length)];
    let destination = areas[Math.floor(Math.random() * areas.length)];
    while (destination === pickup) {
      destination = areas[Math.floor(Math.random() * areas.length)];
    }

    addDelivery({
      id: "SR" + Math.floor(1000 + Math.random() * 9000),
      sellerId: "s" + Math.floor(1 + Math.random() * 3),
      pickupArea: pickup,
      destinationArea: destination,
      packageSize: ["Small", "Medium", "Large"][Math.floor(Math.random() * 3)] as any,
      priority: Math.random() > 0.7 ? "Priority" : "Standard",
      status: "requested",
      createdAt: Date.now(),
    });
  };

  const simulateRiderAvailability = () => {
    const offlineRider = riders.find((r) => r.status === "offline");
    if (offlineRider) {
      updateRiderStatus(offlineRider.id, "available");
    } else {
      updateRiderStatus("r4", "available");
    }
  };

  const advanceDeliveryStatus = () => {
    const active = deliveries.find((d) => !["delivered", "requested"].includes(d.status));
    if (active) {
      if (active.status === "matching") updateDeliveryStatus(active.id, "riderAssigned", "r1");
      else if (active.status === "riderAssigned") updateDeliveryStatus(active.id, "riderArriving", active.riderId || "r1");
      else if (active.status === "riderArriving") updateDeliveryStatus(active.id, "pickedUp", active.riderId || "r1");
      else if (active.status === "pickedUp") updateDeliveryStatus(active.id, "inTransit", active.riderId || "r1");
      else if (active.status === "inTransit") updateDeliveryStatus(active.id, "delivered", active.riderId || "r1");
    }
  };

  const completeDelivery = () => {
    const active = deliveries.find((d) => !["delivered", "requested", "matching"].includes(d.status));
    if (active) {
      updateDeliveryStatus(active.id, "delivered", active.riderId || "r1");
    }
  };

  const detectShared = () => {
    addSharedRoute({
      id: "RT-" + Math.floor(100 + Math.random() * 900),
      name: "Shared Express Corridor",
      deliveryIds: deliveries.slice(0, 2).map((d) => d.id),
      suggestedRiderId: "r1",
      status: "suggested",
    });
  };

  return (
    <>
      {/* Presentation Mode Flow Guide */}
      <AnimatePresence>
        {presentationMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-white/90 dark:bg-slate-900/90 border border-primary/40 shadow-2xl backdrop-blur-2xl rounded-2xl p-5 w-72"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Live Showcase Flow
              </h3>
              <button
                onClick={() => setPresentationMode(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <FlowStep done={true} text="1. Seller creates new delivery order" />
              <FlowStep done={true} text="2. AI engine executes heuristic matching" />
              <FlowStep done={deliveries.some((d) => d.status === "riderAssigned")} active={true} text="3. Shared routes auto-detected" />
              <FlowStep done={deliveries.some((d) => ["pickedUp", "inTransit"].includes(d.status))} text="4. Rider accepts & starts route" />
              <FlowStep done={deliveries.some((d) => d.status === "delivered")} text="5. Real-time delivery fulfilled" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Control Deck */}
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
          {!isOpen ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Button
                variant="glow"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="shadow-xl backdrop-blur-xl border border-white/20 gap-2 h-10 px-4 rounded-full font-medium"
              >
                <Sliders className="w-4 h-4" />
                <span>Demo Control Deck</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              className="bg-white/85 dark:bg-slate-900/85 border border-white/20 dark:border-slate-800/80 shadow-2xl backdrop-blur-2xl rounded-2xl w-72 overflow-hidden"
            >
              <div className="flex justify-between items-center p-3.5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/50">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">Simulation Control Deck</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 space-y-2 max-h-[65vh] overflow-y-auto text-xs">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-9 text-xs" onClick={simulateNewOrder}>
                  <PlusCircle className="w-3.5 h-3.5 text-blue-500" /> Simulate Random Order
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-9 text-xs" onClick={simulateRiderAvailability}>
                  <Play className="w-3.5 h-3.5 text-amber-500" /> Bring Rider Online
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-9 text-xs" onClick={detectShared}>
                  <Zap className="w-3.5 h-3.5 text-purple-500" /> Trigger Shared Route
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-9 text-xs" onClick={advanceDeliveryStatus}>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Advance Order Status
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-9 text-xs" onClick={completeDelivery}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> Complete Active Order
                </Button>

                <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 h-9 text-xs text-primary border-primary/30 hover:bg-primary/10"
                  onClick={() => setPresentationMode(!presentationMode)}
                >
                  <Sparkles className="w-3.5 h-3.5" /> {presentationMode ? "Hide Presentation Guide" : "Show Presentation Guide"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 h-9 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={resetDemo}
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset State
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function FlowStep({ done, active, text }: { done: boolean; active?: boolean; text: string }) {
  return (
    <div
      className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors ${
        active
          ? "bg-primary/10 text-primary font-semibold border border-primary/20"
          : done
          ? "text-foreground/80 font-medium"
          : "text-muted-foreground/60"
      }`}
    >
      {done ? <CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> : <Square className="w-3.5 h-3.5" />}
      <span>{text}</span>
    </div>
  );
}
