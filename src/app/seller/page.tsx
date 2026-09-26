"use client";

import { useState } from "react";
import { useDemoStore, Delivery } from "@/store/demoStore";
import { findBestRider, detectSharedRouteOpportunities } from "@/lib/matchingEngine";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select, Badge } from "@/components/ui";
import { Package, Truck, Clock, CheckCircle, Network, ArrowRight, PlusCircle, Sparkles, MapPin, IndianRupee, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "@/components/motion/TiltCard";
import { GlowCard } from "@/components/motion/GlowCard";
import { CountUp } from "@/components/motion/CountUp";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/motion/PageTransition";

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <PageTransition className="space-y-8">
      {/* Dynamic Tab Navigation Header */}
      <div className="flex items-center justify-between border-b border-white/10 dark:border-slate-800/80 pb-4">
        <div className="flex space-x-2 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
          {[
            { id: "overview", label: "Dashboard Overview", icon: <Package className="w-4 h-4" /> },
            { id: "create", label: "Create Delivery", icon: <PlusCircle className="w-4 h-4" /> },
            { id: "orders", label: "Order History", icon: <Clock className="w-4 h-4" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-primary font-bold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-slate-800/40"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSellerTab"
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

        <Badge variant="cyan" className="hidden sm:inline-flex">
          Connected Hub • Kharghar Sector 12
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

        {activeTab === "create" && (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <CreateDeliveryTab onNavigate={setActiveTab} />
          </motion.div>
        )}

        {activeTab === "orders" && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <OrdersTab />
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

function OverviewTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { deliveries } = useDemoStore();
  const sellerDeliveries = deliveries.filter((d) => d.sellerId === "s1"); // Sweet Home Bakery
  const activeCount = sellerDeliveries.filter((d) => !["delivered", "requested"].includes(d.status)).length;
  const completedCount = sellerDeliveries.filter((d) => d.status === "delivered").length;
  const todayCount = sellerDeliveries.length;
  const estimatedSpend = sellerDeliveries.reduce((acc, curr) => acc + (curr.estimatedFee || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-transparent p-6 rounded-3xl border border-blue-500/20 backdrop-blur-xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Welcome, Sweet Home Bakery</h1>
            <Badge variant="live" className="text-[10px]">LIVE</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Shared dispatch telemetry is active. 3 delivery riders currently orbiting your pickup zone.
          </p>
        </div>
        <Button variant="glow" onClick={() => onNavigate("create")} className="gap-2 shrink-0">
          <PlusCircle className="w-4 h-4" /> Create Dispatch Order
        </Button>
      </div>

      {/* Metrics Row with CountUp */}
      <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <MetricCard
            title="Total Dispatches"
            value={<CountUp value={todayCount} />}
            icon={<Package className="w-5 h-5 text-blue-500" />}
            subtitle="Today's volume"
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            title="Active in Mesh"
            value={<CountUp value={activeCount} />}
            icon={<Truck className="w-5 h-5 text-amber-500" />}
            subtitle="En route & matching"
            highlight={activeCount > 0}
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            title="Fulfilled Deliveries"
            value={<CountUp value={completedCount} />}
            icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
            subtitle="100% on-time rate"
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            title="Estimated Spend"
            value={<CountUp value={estimatedSpend} prefix="₹" />}
            icon={<IndianRupee className="w-5 h-5 text-purple-500" />}
            subtitle="~42% saved via shared routes"
          />
        </StaggerItem>
      </StaggerContainer>

      {/* Recent Dispatches Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-foreground">Active Deliveries</h3>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("orders")}>
            View All History →
          </Button>
        </div>
        <OrdersTab filterActive />
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  subtitle,
  highlight = false,
}: {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  subtitle: string;
  highlight?: boolean;
}) {
  return (
    <TiltCard>
      <Card
        className={`h-full p-6 border ${
          highlight
            ? "border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/20"
            : "border-white/10 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70"
        } backdrop-blur-xl shadow-lg flex flex-col justify-between`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shadow-inner">{icon}</div>
        </div>
        <div>
          <div className="text-3xl font-black tracking-tight text-foreground">{value}</div>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
      </Card>
    </TiltCard>
  );
}

function CreateDeliveryTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { addDelivery, riders, deliveries, updateDeliveryStatus, addSharedRoute } = useDemoStore();
  const [matchingState, setMatchingState] = useState<"idle" | "matching" | "found">("idle");
  const [matchResult, setMatchResult] = useState<any>(null);
  const [sharedRouteOpt, setSharedRouteOpt] = useState<any>(null);

  const [formData, setFormData] = useState({
    orderId: "SR" + Math.floor(1000 + Math.random() * 9000),
    packageSize: "Medium",
    pickupArea: "Kharghar",
    destinationArea: "Vashi",
    priority: "Standard",
  });

  const handleMatch = () => {
    setMatchingState("matching");

    setTimeout(() => {
      const delivery: Delivery = {
        id: formData.orderId,
        sellerId: "s1",
        pickupArea: formData.pickupArea,
        destinationArea: formData.destinationArea,
        packageSize: formData.packageSize as any,
        priority: formData.priority as any,
        status: "matching",
        createdAt: Date.now(),
      };

      const bestMatch = findBestRider(delivery, riders, deliveries);
      setMatchResult(bestMatch);

      const mockSharedDeliveries = deliveries.filter(
        (d) => d.pickupArea === formData.pickupArea && d.status !== "delivered"
      );
      if (mockSharedDeliveries.length > 0) {
        setSharedRouteOpt({
          count: mockSharedDeliveries.length + 1,
          deliveries: [delivery, ...mockSharedDeliveries],
        });
      }

      setMatchingState("found");
      addDelivery(delivery);
    }, 1800);
  };

  const handleAssign = () => {
    if (matchResult && matchResult.rider) {
      updateDeliveryStatus(formData.orderId, "riderAssigned", matchResult.rider.id);

      if (sharedRouteOpt) {
        addSharedRoute({
          id: "RT-" + Math.floor(100 + Math.random() * 900),
          name: `${formData.pickupArea} Cluster Corridor`,
          deliveryIds: sharedRouteOpt.deliveries.map((d: any) => d.id),
          suggestedRiderId: matchResult.rider.id,
          status: "suggested",
        });
      }
      onNavigate("orders");
    }
  };

  if (matchingState === "matching") {
    return (
      <Card className="max-w-md mx-auto mt-8 border-primary/40 shadow-2xl p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl">
        <CardContent className="flex flex-col items-center text-center p-0">
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Sparkles className="w-8 h-8 text-primary absolute animate-pulse" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-foreground">Executing Heuristic Search...</h2>
          <p className="text-xs text-muted-foreground mb-6">Algorithmic matching across live driver positions</p>

          <div className="space-y-3 text-xs text-left w-full max-w-xs mx-auto font-mono">
            <p className="text-emerald-500 flex items-center gap-2">✓ Querying active riders in radius</p>
            <p className="text-cyan-500 flex items-center gap-2 animate-pulse">✓ Computing lowest pickup detour latency</p>
            <p className="text-purple-500 flex items-center gap-2 animate-pulse" style={{ animationDelay: "0.5s" }}>✓ Analyzing shared route compatibility</p>
            <p className="text-amber-500 flex items-center gap-2 animate-pulse" style={{ animationDelay: "1s" }}>✓ Optimizing carbon footprint score</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (matchingState === "found" && matchResult) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 mt-6">
        <GlowCard className="p-8 border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20" glowColor="rgba(16, 185, 129, 0.25)">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-emerald-500/20">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Optimal Delivery Match Resolved</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Rider #{matchResult.rider.id} — {matchResult.rider.name} ({matchResult.rider.area})
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-6 bg-white/70 dark:bg-slate-900/70 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider block">Pickup Distance</span>
              <span className="font-bold text-foreground text-base">{matchResult.pickupDistance} km</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider block">Route Compatibility</span>
              <span className="font-bold text-primary text-base">{matchResult.routeCompatibility}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider block">Estimated Travel</span>
              <span className="font-bold text-foreground text-base">{matchResult.estimatedTime} mins</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider block">Estimated Protocol Fee</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">₹{matchResult.estimatedFee}</span>
            </div>
          </div>

          {sharedRouteOpt && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Network className="w-4 h-4 text-primary" />
                <h4 className="font-bold text-sm text-foreground">Shared Route Opportunity Detected</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Compatible corridor identified. {sharedRouteOpt.count} packages will be combined to minimize redundant rider travel.
              </p>
              <div className="flex items-center justify-between text-xs font-mono bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-primary/20">
                <span>{formData.pickupArea} → {formData.destinationArea}</span>
                <Badge variant="cyan">+{sharedRouteOpt.count - 1} Coordinated</Badge>
              </div>
            </div>
          )}

          <Button variant="emerald" size="lg" onClick={handleAssign} className="w-full">
            Confirm & Dispatch Rider
          </Button>
        </GlowCard>
      </div>
    );
  }

  const areas = ["Kharghar", "Vashi", "Nerul", "Sanpada", "Belapur"];

  return (
    <div className="max-w-xl mx-auto">
      <GlowCard className="p-8">
        <div className="mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
          <h2 className="text-2xl font-bold text-foreground">Create Dispatch Order</h2>
          <p className="text-xs text-muted-foreground mt-1">Specify package payload and route coordinates</p>
        </div>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleMatch();
          }}
        >
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order Reference ID</label>
            <Input value={formData.orderId} readOnly className="bg-slate-100/50 dark:bg-slate-950/50 font-mono text-primary font-bold" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pickup Location</label>
              <Select
                value={formData.pickupArea}
                onChange={(e) => setFormData({ ...formData, pickupArea: e.target.value })}
              >
                {areas.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Destination Area</label>
              <Select
                value={formData.destinationArea}
                onChange={(e) => setFormData({ ...formData, destinationArea: e.target.value })}
              >
                {areas.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Package Size</label>
              <Select
                value={formData.packageSize}
                onChange={(e) => setFormData({ ...formData, packageSize: e.target.value })}
              >
                <option value="Small">Small (under 2kg)</option>
                <option value="Medium">Medium (2-5kg)</option>
                <option value="Large">Large (5-10kg)</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Priority Tier</label>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Standard">Standard Logistics</option>
                <option value="Priority">Priority Express</option>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            variant="glow"
            size="lg"
            className="w-full mt-4"
            disabled={formData.pickupArea === formData.destinationArea}
          >
            Find Delivery Partner
          </Button>
          {formData.pickupArea === formData.destinationArea && (
            <p className="text-xs text-destructive text-center font-medium">Pickup and destination cannot be the same zone.</p>
          )}
        </form>
      </GlowCard>
    </div>
  );
}

function OrdersTab({ filterActive = false }: { filterActive?: boolean }) {
  const { deliveries } = useDemoStore();
  let sellerDeliveries = deliveries.filter((d) => d.sellerId === "s1");

  if (filterActive) {
    sellerDeliveries = sellerDeliveries.filter((d) => !["delivered", "requested"].includes(d.status));
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "success";
      case "matching":
        return "warning";
      case "inTransit":
        return "cyan";
      case "riderAssigned":
      case "riderArriving":
      case "pickedUp":
        return "purple";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
  };

  if (sellerDeliveries.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
        <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-foreground">No active dispatches</h3>
        <p className="text-xs text-muted-foreground mt-1">Create a dispatch request to start utilizing the shared mesh.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sellerDeliveries.map((delivery) => (
        <TiltCard key={delivery.id}>
          <Card className="p-6 border border-white/10 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg hover:border-primary/50 transition-all">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  <h4 className="font-extrabold text-lg text-foreground font-mono">#{delivery.id}</h4>
                  <Badge variant={getStatusVariant(delivery.status) as any}>
                    {getStatusLabel(delivery.status)}
                  </Badge>
                  {delivery.priority === "Priority" && <Badge variant="destructive">Priority</Badge>}
                  <Badge variant="outline">{delivery.packageSize}</Badge>
                </div>
                <div className="flex items-center text-xs text-muted-foreground gap-2 font-mono">
                  <span className="font-semibold text-foreground">{delivery.pickupArea}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  <span className="font-semibold text-foreground">{delivery.destinationArea}</span>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end text-xs">
                {delivery.riderId ? (
                  <span className="text-muted-foreground">
                    Assigned Driver: <span className="font-bold text-primary">#{delivery.riderId}</span>
                  </span>
                ) : (
                  <span className="text-amber-500 font-medium italic flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    Searching nearby riders...
                  </span>
                )}
                {delivery.estimatedFee && (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base mt-1">
                    ₹{delivery.estimatedFee}
                  </span>
                )}
              </div>
            </div>
          </Card>
        </TiltCard>
      ))}
    </div>
  );
}
