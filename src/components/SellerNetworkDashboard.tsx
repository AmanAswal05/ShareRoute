"use client";

import { useState, useMemo } from "react";
import { useDemoStore } from "@/store/demoStore";
import { Card, Badge, Button, Input } from "./ui";
import { Package, Truck, IndianRupee, Search, Activity, Leaf } from "lucide-react";
import { CountUp } from "@/components/motion/CountUp";
import { StaggerContainer, StaggerItem } from "@/components/motion/PageTransition";
import { ActiveDemoDelivery } from "./ActiveDemoDelivery";

export function SellerNetworkDashboard() {
  const { deliveries, riders, sharedRoutes, notifications } = useDemoStore();
  
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>("SR-1048");

  const ITEMS_PER_PAGE = 10;

  // Calculate Metrics
  const activeCount = deliveries.filter(d => d.status !== "delivered" && d.status !== "requested").length;
  
  const activeRidersCount = riders.filter(r => r.status !== "offline").length;
  const totalSavings = deliveries.reduce((acc, d) => acc + ((d.originalFee || 0) - (d.estimatedFee || 0)), 0);
  const totalCo2 = deliveries.reduce((acc, d) => acc + (d.co2Saved || 0), 0);

  // Filter Deliveries
  const filteredDeliveries = useMemo(() => {
    let result = deliveries;
    if (filter !== "All") {
      const matchStatus = filter.toLowerCase().replace(" ", "");
      result = result.filter(d => d.status.toLowerCase().includes(matchStatus));
    }
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(d => 
        d.id.toLowerCase().includes(s) || 
        d.customerName?.toLowerCase().includes(s) || 
        (d.riderId && riders.find(r => r.id === d.riderId)?.name.toLowerCase().includes(s))
      );
    }
    return result;
  }, [deliveries, filter, search, riders]);

  const totalPages = Math.ceil(filteredDeliveries.length / ITEMS_PER_PAGE);
  const paginatedDeliveries = filteredDeliveries.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <StaggerContainer className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <StaggerItem>
          <MetricCard title="Total Dispatches" value={<CountUp value={deliveries.length} />} icon={<Package className="text-blue-500 w-5 h-5" />} />
        </StaggerItem>
        <StaggerItem>
          <MetricCard title="Active Deliveries" value={<CountUp value={activeCount} />} icon={<Activity className="text-amber-500 w-5 h-5" />} highlight={activeCount > 0} />
        </StaggerItem>
        <StaggerItem>
          <MetricCard title="Riders Active" value={<CountUp value={activeRidersCount} />} icon={<Truck className="text-purple-500 w-5 h-5" />} />
        </StaggerItem>
        <StaggerItem>
          <MetricCard title="Total Savings" value={<CountUp value={totalSavings} prefix="₹" />} icon={<IndianRupee className="text-emerald-500 w-5 h-5" />} />
        </StaggerItem>
        <StaggerItem>
          <MetricCard title="CO₂ Saved" value={<><CountUp value={totalCo2} /> kg</>} icon={<Leaf className="text-green-500 w-5 h-5" />} />
        </StaggerItem>
      </StaggerContainer>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Left Column (Table & Activity) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Deliveries Table */}
          <Card className="border border-slate-200 dark:border-slate-800 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" /> Delivery Network
              </h3>
              
              <div className="flex gap-2 text-xs">
                {["All", "Matching", "Picked Up", "In Transit", "Delivered"].map(f => (
                  <button 
                    key={f}
                    onClick={() => { setFilter(f); setPage(1); }}
                    className={`px-3 py-1.5 rounded-full font-medium transition-all ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search by Order ID, Customer, or Rider..." 
                  className="pl-9 h-9 text-sm"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-900 text-muted-foreground uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Route</th>
                    <th className="px-4 py-3">Rider</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Saved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedDeliveries.length > 0 ? paginatedDeliveries.map(delivery => {
                    const r = riders.find(x => x.id === delivery.riderId);
                    const saved = (delivery.originalFee || 0) - (delivery.estimatedFee || 0);
                    return (
                      <tr 
                        key={delivery.id} 
                        onClick={() => setSelectedDeliveryId(delivery.id)}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${selectedDeliveryId === delivery.id ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                      >
                        <td className="px-4 py-3 font-mono font-bold text-primary">{delivery.id}</td>
                        <td className="px-4 py-3 font-medium">{delivery.customerName}</td>
                        <td className="px-4 py-3 text-slate-500">
                          {delivery.pickupArea.split(' ')[0]} → {delivery.destinationArea.split(' ')[0]}
                        </td>
                        <td className="px-4 py-3 font-medium">{r ? r.name : <span className="text-amber-500 italic">Searching...</span>}</td>
                        <td className="px-4 py-3">
                          <Badge variant={delivery.status === 'delivered' ? 'success' : 'live'}>
                            {delivery.status.replace(/([A-Z])/g, " $1").trim().toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-500">₹{saved}</td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No deliveries found matching criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Showing {(page - 1) * ITEMS_PER_PAGE + 1} - {Math.min(page * ITEMS_PER_PAGE, filteredDeliveries.length)} of {filteredDeliveries.length}</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="h-7 text-xs px-2" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</Button>
                <div className="flex items-center px-2 font-medium">{page} / {totalPages || 1}</div>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</Button>
              </div>
            </div>
          </Card>

          {/* Shared Route Groups */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> Shared Route Network
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sharedRoutes.map(group => {
                const r = riders.find(x => x.id === group.riderId);
                return (
                  <Card key={group.id} className="p-4 border border-slate-200 dark:border-slate-800 shadow-sm bg-white/50 dark:bg-slate-900/50">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-sm">{group.name}</h4>
                      <Badge variant="cyan" className="text-[10px]">{group.overlap}% Overlap</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1 mb-3">
                      <p className="flex justify-between"><span>Rider:</span> <span className="font-medium text-foreground">{r?.name}</span></p>
                      <p className="flex justify-between"><span>Payload:</span> <span className="font-medium text-foreground">{group.deliveryIds.length} orders</span></p>
                    </div>
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Combined Savings</p>
                      <p className="text-lg font-mono font-black text-emerald-500">₹{group.totalSavings}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (Hero Delivery & Activity Feed) */}
        <div className="space-y-8">
          
          {/* Hero Delivery Panel */}
          <div>
            <h3 className="text-lg font-bold mb-4">Selected Delivery</h3>
            <ActiveDemoDelivery deliveryId={selectedDeliveryId} />
          </div>

          {/* Activity Feed */}
          <Card className="p-5 border border-slate-200 dark:border-slate-800 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" /> Live Activity Feed
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {notifications.map((notif, idx) => (
                <div key={notif.id} className={`text-xs flex gap-3 ${idx === 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  <div className="mt-1">
                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-primary animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
                  </div>
                  <div>
                    {notif.message}
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="text-xs text-muted-foreground italic">No recent activity. Start the simulation.</div>
              )}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, highlight }: { title: string; value: React.ReactNode; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <Card className={`p-4 border ${highlight ? "border-amber-500/40 bg-amber-500/5" : "border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70"} shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">{icon}</div>
      </div>
      <div className="text-2xl font-black tracking-tight text-foreground">{value}</div>
    </Card>
  );
}
