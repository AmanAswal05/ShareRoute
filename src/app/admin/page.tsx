"use client";

import { useState } from "react";
import { useDemoStore } from "@/store/demoStore";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from "@/components/ui";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Network, Store, Truck, Package, Activity, Search, Link as LinkIcon, ShieldCheck, Zap, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "@/components/motion/TiltCard";
import { GlowCard } from "@/components/motion/GlowCard";
import { CountUp } from "@/components/motion/CountUp";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/motion/PageTransition";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <PageTransition className="space-y-8">
      {/* Command Center Tab Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 dark:border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Mesh Operations Matrix</h1>
            <Badge variant="purple">v2.4 Telemetry</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time heuristics & decentralized route optimization monitor</p>
        </div>

        <div className="flex space-x-2 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
          {[
            { id: "overview", label: "Network Telemetry", icon: <Activity className="w-4 h-4" /> },
            { id: "deliveries", label: "Dispatch Stream", icon: <Package className="w-4 h-4" /> },
            { id: "routes", label: "Shared Corridors", icon: <Network className="w-4 h-4" /> },
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
                    layoutId="activeAdminTab"
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
            <OverviewTab />
          </motion.div>
        )}

        {activeTab === "deliveries" && (
          <motion.div
            key="deliveries"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <DeliveriesTab />
          </motion.div>
        )}

        {activeTab === "routes" && (
          <motion.div
            key="routes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <SharedRoutesTab />
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

function OverviewTab() {
  const { sellers, riders, deliveries, sharedRoutes } = useDemoStore();

  const activeDeliveries = deliveries.filter((d) => !["delivered", "requested"].includes(d.status)).length;
  const completedDeliveries = deliveries.filter((d) => d.status === "delivered").length;
  const activeSellers = new Set(deliveries.map((d) => d.sellerId)).size;
  const availableRiders = riders.filter((r) => r.status === "available").length;

  const areaData = ["Kharghar", "Vashi", "Nerul", "Sanpada", "Belapur"].map((area) => ({
    name: area,
    deliveries: deliveries.filter((d) => d.pickupArea === area || d.destinationArea === area).length,
  }));

  const statusData = [
    { name: "Delivered", value: completedDeliveries || 1, color: "#10b981" },
    { name: "En Route", value: activeDeliveries || 1, color: "#f59e0b" },
    { name: "Matching", value: Math.max(deliveries.length - completedDeliveries - activeDeliveries, 1), color: "#3b82f6" },
  ];

  return (
    <div className="space-y-8">
      {/* 6-Col Command Metric Stream */}
      <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StaggerItem>
          <MetricCard title="Active Sellers" value={<CountUp value={activeSellers} />} icon={<Store className="w-4 h-4 text-blue-500" />} />
        </StaggerItem>
        <StaggerItem>
          <MetricCard title="Rider Fleet" value={<CountUp value={riders.length} />} icon={<Truck className="w-4 h-4 text-amber-500" />} />
        </StaggerItem>
        <StaggerItem>
          <MetricCard title="Available Riders" value={<CountUp value={availableRiders} />} icon={<Activity className="w-4 h-4 text-emerald-500" />} highlight={availableRiders > 0} />
        </StaggerItem>
        <StaggerItem>
          <MetricCard title="Active Mesh Loads" value={<CountUp value={activeDeliveries} />} icon={<Package className="w-4 h-4 text-purple-500" />} />
        </StaggerItem>
        <StaggerItem>
          <MetricCard title="Fulfillments" value={<CountUp value={completedDeliveries} />} icon={<CheckCircle2 className="w-4 h-4 text-cyan-500" />} />
        </StaggerItem>
        <StaggerItem>
          <MetricCard title="Shared Corridors" value={<CountUp value={sharedRoutes.length} />} icon={<Network className="w-4 h-4 text-pink-500" />} />
        </StaggerItem>
      </StaggerContainer>

      {/* Analytics Charts Row */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Deliveries by Sector Chart */}
        <TiltCard className="col-span-2">
          <Card className="p-6 border border-white/10 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-base text-foreground">Sector Load Density</h3>
                <p className="text-xs text-muted-foreground">Real-time package dispatch distribution across urban hubs</p>
              </div>
              <Badge variant="outline">Live Telemetry</Badge>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaData}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="#888888" />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#888888" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                  />
                  <Bar dataKey="deliveries" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TiltCard>

        {/* Status Donut Chart */}
        <TiltCard>
          <Card className="p-6 border border-white/10 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground">Dispatch Lifecycle</h3>
              <p className="text-xs text-muted-foreground mb-4">State breakdown of ongoing logistics</p>
            </div>
            <div className="h-[220px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around text-xs pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Fulfilled</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> En Route</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Matching</span>
            </div>
          </Card>
        </TiltCard>
      </div>

      {/* Interactive Live Topological Visualizer Map */}
      <NetworkMap />
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  highlight = false,
}: {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <Card
      className={`p-4 flex flex-col items-center justify-center text-center h-full border ${
        highlight
          ? "border-emerald-500/40 bg-emerald-500/5"
          : "border-white/10 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70"
      } backdrop-blur-xl shadow-md`}
    >
      <div className="mb-2 p-2 bg-slate-100/70 dark:bg-slate-800/70 rounded-xl">{icon}</div>
      <div className="text-2xl font-black text-foreground">{value}</div>
      <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-1">{title}</div>
    </Card>
  );
}

function NetworkMap() {
  const { sellers, riders, deliveries } = useDemoStore();

  return (
    <GlowCard className="p-0 border-white/10 dark:border-slate-800/80 overflow-hidden" glowColor="rgba(139, 92, 246, 0.2)">
      <div className="bg-slate-950/90 text-white p-5 border-b border-slate-800/80 flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <Network className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="font-bold text-sm">Live Topological Network Topology</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="live">Active Sensor Stream</Badge>
        </div>
      </div>

      <div className="relative h-[420px] bg-slate-950/95 overflow-hidden">
        {/* High-tech Radar Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px]"></div>

        {/* Ambient Radar Sweep Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-blue-500/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-blue-500/15 pointer-events-none" />

        {/* Node 1: Kharghar Seller */}
        <div className="absolute top-[25%] left-[22%] group flex flex-col items-center cursor-pointer">
          <div className="w-5 h-5 bg-blue-500 rounded-full shadow-[0_0_20px_#3b82f6] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
            S1
          </div>
          <div className="absolute top-7 whitespace-nowrap text-xs text-white font-mono bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-blue-500/30 shadow-lg">
            Sweet Home Bakery • Kharghar
          </div>
        </div>

        {/* Node 2: Rider Node */}
        <div className="absolute top-[48%] left-[45%] group flex flex-col items-center cursor-pointer">
          <div className="w-5 h-5 bg-amber-500 rounded-full shadow-[0_0_20px_#f59e0b] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold animate-bounce">
            R
          </div>
          <div className="absolute top-7 whitespace-nowrap text-xs text-white font-mono bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-amber-500/30 shadow-lg">
            Rahul (Rider #17) • In Transit
          </div>
        </div>

        {/* Node 3: Vashi Destination */}
        <div className="absolute top-[68%] left-[72%] group flex flex-col items-center cursor-pointer">
          <div className="w-5 h-5 bg-purple-500 rounded-full shadow-[0_0_20px_#a855f7] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
            D
          </div>
          <div className="absolute top-7 whitespace-nowrap text-xs text-white font-mono bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-purple-500/30 shadow-lg">
            Vashi Sector 17 • Dropoff Zone
          </div>
        </div>

        {/* Dynamic Glowing SVG Interconnectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line
            x1="22%"
            y1="25%"
            x2="45%"
            y2="48%"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            className="opacity-70 animate-[dash_1.5s_linear_infinite]"
          />
          <line
            x1="45%"
            y1="48%"
            x2="72%"
            y2="68%"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            className="opacity-70 animate-[dash_1.5s_linear_infinite]"
          />
        </svg>

        {/* Map Legend */}
        <div className="absolute bottom-5 left-5 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 backdrop-blur-xl text-xs text-slate-300 space-y-1.5 shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
            <span>Seller Hub Origin</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
            <span>Active Dispatch Courier</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
            <span>Destination Node</span>
          </div>
        </div>
      </div>
    </GlowCard>
  );
}

function DeliveriesTab() {
  const { deliveries, sellers, riders } = useDemoStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDeliveries = deliveries.filter((d) => {
    const term = searchTerm.toLowerCase();
    return (
      d.id.toLowerCase().includes(term) ||
      d.pickupArea.toLowerCase().includes(term) ||
      d.destinationArea.toLowerCase().includes(term) ||
      d.status.toLowerCase().includes(term)
    );
  });

  return (
    <Card className="p-6 border border-white/10 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">Global Dispatch Stream</h3>
          <p className="text-xs text-muted-foreground">Comprehensive record of all network orders</p>
        </div>
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search orders, areas, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 text-xs"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground bg-slate-100/70 dark:bg-slate-950/70 uppercase font-semibold">
            <tr>
              <th className="px-4 py-3.5">Order ID</th>
              <th className="px-4 py-3.5">Seller Origin</th>
              <th className="px-4 py-3.5">Transit Corridor</th>
              <th className="px-4 py-3.5">Assigned Rider</th>
              <th className="px-4 py-3.5">Lifecycle Status</th>
              <th className="px-4 py-3.5">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
            {filteredDeliveries.map((d) => {
              const seller = sellers.find((s) => s.id === d.sellerId);
              const rider = riders.find((r) => r.id === d.riderId);

              return (
                <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors font-mono text-xs">
                  <td className="px-4 py-3.5 font-bold text-foreground">#{d.id}</td>
                  <td className="px-4 py-3.5 font-sans font-medium text-foreground">{seller?.name || d.sellerId}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    <span className="font-semibold text-foreground">{d.pickupArea}</span> → {d.destinationArea}
                  </td>
                  <td className="px-4 py-3.5 font-sans">{rider ? rider.name : <span className="italic text-muted-foreground">Pending</span>}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant={d.status === "delivered" ? "success" : d.status === "inTransit" ? "cyan" : "warning"}>
                      {d.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    {d.priority === "Priority" ? (
                      <Badge variant="destructive">High</Badge>
                    ) : (
                      <Badge variant="outline">Std</Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function SharedRoutesTab() {
  const { sharedRoutes, updateSharedRouteStatus, deliveries } = useDemoStore();

  if (sharedRoutes.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 backdrop-blur-xl">
        <Network className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-foreground">No Shared Routes Formed</h3>
        <p className="text-xs text-muted-foreground mt-1">Shared route clusters will be generated automatically when orders overlap.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {sharedRoutes.map((route) => {
        const routeDeliveries = deliveries.filter((d) => route.deliveryIds.includes(d.id));

        return (
          <TiltCard key={route.id}>
            <Card className="p-6 border border-primary/30 bg-primary/5 dark:bg-primary/10 backdrop-blur-xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-primary/20">
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-primary" /> {route.name}
                  </h3>
                  <Badge variant={route.status === "coordinated" ? "success" : "default"}>
                    {route.status}
                  </Badge>
                </div>

                <div className="mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-2">
                    Bundled Dispatches ({route.deliveryIds.length})
                  </span>
                  <div className="space-y-2 font-mono text-xs">
                    {routeDeliveries.map((d) => (
                      <div
                        key={d.id}
                        className="flex justify-between items-center bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50"
                      >
                        <span className="font-bold text-primary">#{d.id}</span>
                        <span className="text-muted-foreground">{d.pickupArea} → {d.destinationArea}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-primary/20">
                <div className="text-xs">
                  <span className="text-muted-foreground font-semibold">Suggested Driver:</span> #{route.suggestedRiderId}
                </div>
                {route.status === "suggested" && (
                  <Button
                    variant="emerald"
                    size="sm"
                    onClick={() => updateSharedRouteStatus(route.id, "coordinated")}
                  >
                    Coordinate Route
                  </Button>
                )}
              </div>
            </Card>
          </TiltCard>
        );
      })}
    </div>
  );
}
