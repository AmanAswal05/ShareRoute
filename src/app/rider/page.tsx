"use client";

import { useState } from "react";
import { useDemoStore, Delivery } from "@/store/demoStore";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "@/components/ui";
import { Truck, MapPin, IndianRupee, Clock, ArrowRight, Network, CheckCircle, Package, Power, Navigation, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "@/components/motion/TiltCard";
import { GlowCard } from "@/components/motion/GlowCard";
import { CountUp } from "@/components/motion/CountUp";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/motion/PageTransition";

export default function RiderDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <PageTransition className="space-y-8">
      {/* Rider Tab Navigation Header */}
      <div className="flex items-center justify-between border-b border-white/10 dark:border-slate-800/80 pb-4">
        <div className="flex space-x-2 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
          {[
            { id: "overview", label: "Driver Telemetry", icon: <Truck className="w-4 h-4" /> },
            { id: "available", label: "Available Loads", icon: <Navigation className="w-4 h-4" /> },
            { id: "active", label: "Active Delivery Run", icon: <Clock className="w-4 h-4" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-amber-500 font-bold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-slate-800/40"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeRiderTab"
                    className="absolute inset-0 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        <Badge variant="warning" className="hidden sm:inline-flex">
          Driver Terminal #17
        </Badge>
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <OverviewTab onNavigate={setActiveTab} />
          </motion.div>
        )}

        {activeTab === "available" && (
          <motion.div
            key="available"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <AvailableTab onNavigate={setActiveTab} />
          </motion.div>
        )}

        {activeTab === "active" && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveDeliveryTab />
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

function OverviewTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { riders, updateRiderStatus, deliveries } = useDemoStore();
  const me = riders.find((r) => r.id === "r1") || { id: "r1", name: "Rahul", area: "Vashi", status: "available" };

  const myDeliveries = deliveries.filter((d) => d.riderId === me.id);
  const completed = myDeliveries.filter((d) => d.status === "delivered");
  const active = myDeliveries.filter((d) => !["delivered", "requested"].includes(d.status));
  const earnings = completed.reduce((acc, curr) => acc + (curr.estimatedFee || 0), 0);

  const toggleStatus = () => {
    updateRiderStatus(me.id, me.status === "available" ? "offline" : "available");
  };

  return (
    <div className="space-y-8">
      {/* Futuristic Driver HUD Hero Banner */}
      <GlowCard className="p-8 border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent" glowColor="rgba(245, 158, 11, 0.25)">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Welcome back, {me.name}</h1>
              <Badge variant={me.status === "available" ? "success" : "secondary"}>
                {me.status === "available" ? "🟢 ONLINE" : "OFFLINE"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Assigned Base Zone: <span className="font-semibold text-foreground">{me.area}</span> • Ready to receive shared corridor dispatches.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/60 dark:bg-slate-900/60 p-4 rounded-2xl border border-white/20 dark:border-slate-800 backdrop-blur-xl shadow-lg">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Driver Duty Status</span>
              <span className="text-sm font-bold text-foreground flex items-center gap-2 mt-0.5">
                <span className={`w-2.5 h-2.5 rounded-full ${me.status === "available" ? "bg-emerald-500 animate-ping" : "bg-slate-400"}`} />
                {me.status === "available" ? "Available for Dispatch" : "Duty Paused"}
              </span>
            </div>
            <Button
              variant={me.status === "available" ? "amber" : "outline"}
              size="sm"
              onClick={toggleStatus}
              className="gap-1.5"
            >
              <Power className="w-3.5 h-3.5" />
              <span>{me.status === "available" ? "Go Offline" : "Go Online"}</span>
            </Button>
          </div>
        </div>
      </GlowCard>

      {/* Metrics Row */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StaggerItem>
          <TiltCard>
            <Card className="p-6 border border-white/10 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Fulfillments Completed</div>
              <div className="text-4xl font-black text-foreground">
                <CountUp value={completed.length} />
              </div>
              <p className="text-xs text-emerald-500 font-medium mt-1">100% Customer Rating</p>
            </Card>
          </TiltCard>
        </StaggerItem>

        <StaggerItem>
          <TiltCard>
            <Card className="p-6 border border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/20 backdrop-blur-xl shadow-lg text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">Active Loads En Route</div>
              <div className="text-4xl font-black text-amber-600 dark:text-amber-400">
                <CountUp value={active.length} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Live Route Navigation</p>
            </Card>
          </TiltCard>
        </StaggerItem>

        <StaggerItem>
          <TiltCard>
            <Card className="p-6 border border-white/10 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Total Session Earnings</div>
              <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                <CountUp value={earnings} prefix="₹" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">+₹45 Shared Route Bonus</p>
            </Card>
          </TiltCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Available Opportunities Teaser */}
      <div className="flex justify-between items-center pt-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">Available Loads in Radius</h3>
          <p className="text-xs text-muted-foreground">Nearby orders waiting for dispatch confirmation</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => onNavigate("available")}>
          View Dispatch Queue →
        </Button>
      </div>

      <AvailableTab onNavigate={onNavigate} previewOnly />
    </div>
  );
}

function AvailableTab({ onNavigate, previewOnly = false }: { onNavigate?: (tab: string) => void; previewOnly?: boolean }) {
  const { deliveries, updateDeliveryStatus, sharedRoutes } = useDemoStore();
  const me = "r1";

  const availableDeliveries = deliveries.filter(
    (d) => d.status === "riderAssigned" && d.riderId === me
  );

  const handleAccept = (id: string) => {
    updateDeliveryStatus(id, "riderArriving", me);
    if (onNavigate) {
      onNavigate("active");
    }
  };

  if (availableDeliveries.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 backdrop-blur-xl">
        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-foreground">No Pending Assignments</h3>
        <p className="text-xs text-muted-foreground mt-1">Stand by in your zone. New orders will appear dynamically.</p>
      </div>
    );
  }

  const itemsToShow = previewOnly ? availableDeliveries.slice(0, 2) : availableDeliveries;

  return (
    <div className="space-y-4">
      {itemsToShow.map((d) => {
        const isShared = sharedRoutes.some((sr) => sr.deliveryIds.includes(d.id));

        return (
          <TiltCard key={d.id}>
            <Card className="overflow-hidden border border-white/10 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl hover:border-amber-500/50 transition-all">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
                        Dispatch Opportunity Available
                      </span>
                      <h3 className="text-2xl font-black text-foreground font-mono">Order #{d.id}</h3>
                    </div>
                    {isShared && (
                      <Badge variant="success" className="gap-1.5">
                        <Network className="w-3 h-3" /> Shared Route Optimized (+25%)
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-6 bg-slate-100/70 dark:bg-slate-800/70 p-4 rounded-2xl font-mono text-sm border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex-1">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Pickup Hub</div>
                      <div className="font-extrabold text-foreground text-base">{d.pickupArea}</div>
                    </div>
                    <ArrowRight className="text-primary w-5 h-5 shrink-0" />
                    <div className="flex-1 text-right">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Dropoff Point</div>
                      <div className="font-extrabold text-foreground text-base">{d.destinationArea}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      <span>{d.packageSize} Payload</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-500" />
                      <span>~{d.estimatedTime} mins transit</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      <IndianRupee className="w-4 h-4" />
                      <span>₹{d.estimatedFee} Payout</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/80 dark:bg-slate-950/80 p-6 md:p-8 flex md:flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-200/50 dark:border-slate-800/50 w-full md:w-56 shrink-0">
                  <Button variant="amber" size="lg" className="w-full" onClick={() => handleAccept(d.id)}>
                    Accept Load
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    Decline
                  </Button>
                </div>
              </div>
            </Card>
          </TiltCard>
        );
      })}
    </div>
  );
}

function ActiveDeliveryTab() {
  const { deliveries, updateDeliveryStatus } = useDemoStore();
  const me = "r1";

  const active = deliveries.filter(
    (d) => d.riderId === me && ["riderArriving", "pickedUp", "inTransit"].includes(d.status)
  );

  if (active.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 backdrop-blur-xl">
        <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-foreground">No Active Deliveries</h3>
        <p className="text-xs text-muted-foreground mt-1">Accept a dispatch load to begin route navigation.</p>
      </div>
    );
  }

  const advanceStatus = (id: string, currentStatus: string) => {
    let next: any = "delivered";
    if (currentStatus === "riderArriving") next = "pickedUp";
    else if (currentStatus === "pickedUp") next = "inTransit";
    else if (currentStatus === "inTransit") next = "delivered";

    updateDeliveryStatus(id, next, me);
  };

  const getActionText = (status: string) => {
    if (status === "riderArriving") return "Arrived at Pickup Hub";
    if (status === "pickedUp") return "Package Verified — Start Delivery";
    if (status === "inTransit") return "Fulfill & Mark Delivered";
    return "";
  };

  return (
    <div className="space-y-6">
      {active.map((d) => (
        <GlowCard key={d.id} className="p-8 border-amber-500/40" glowColor="rgba(245, 158, 11, 0.2)">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-foreground font-mono">Order #{d.id}</span>
                <span className="text-xs text-muted-foreground block">Active Telemetry Tracking</span>
              </div>
            </div>
            <Badge variant="warning" className="uppercase tracking-wider font-mono text-xs">
              {d.status}
            </Badge>
          </div>

          <div className="relative pl-8 space-y-8 pb-4 mb-6">
            <div className="absolute top-2 left-3.5 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

            <div className="relative">
              <div
                className={`absolute -left-[35px] w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                  ["riderArriving", "pickedUp", "inTransit"].includes(d.status)
                    ? "bg-amber-500 border-amber-500"
                    : "bg-white border-slate-300"
                }`}
              >
                {["pickedUp", "inTransit"].includes(d.status) && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Pickup Hub Zone</h4>
              <p className="font-extrabold text-xl text-foreground">{d.pickupArea}</p>
              <p className="text-xs text-muted-foreground">Sweet Home Bakery Hub</p>
            </div>

            <div className="relative">
              <div
                className={`absolute -left-[35px] w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                  ["inTransit"].includes(d.status) ? "bg-amber-500 border-amber-500" : "bg-white border-slate-300"
                }`}
              />
              <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Customer Dropoff Zone</h4>
              <p className="font-extrabold text-xl text-foreground">{d.destinationArea}</p>
              <p className="text-xs text-muted-foreground">Direct Consumer Handover</p>
            </div>
          </div>

          <Button
            variant="amber"
            size="xl"
            className="w-full"
            onClick={() => advanceStatus(d.id, d.status)}
          >
            <span>{getActionText(d.status)}</span>
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </GlowCard>
      ))}
    </div>
  );
}
