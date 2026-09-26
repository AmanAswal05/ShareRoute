"use client";

import { useDemoStore } from "@/store/demoStore";
import { Card, Badge } from "./ui";
import { Package, Truck, Navigation, CheckCircle2, User, Clock, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ActiveDemoDelivery({ deliveryId }: { deliveryId: string }) {
  const { deliveries, riders } = useDemoStore();
  const delivery = deliveries.find((d) => d.id === deliveryId);
  const rider = riders.find((r) => r.id === delivery?.riderId);

  if (!delivery) return null;

  const isMatched = ["riderAssigned", "pickedUp", "inTransit", "delivered"].includes(delivery.status);
  const isTransit = ["inTransit", "delivered"].includes(delivery.status);

  return (
    <div className="space-y-6">
      {/* Route Visualization */}
      <Card className="p-6 overflow-hidden relative bg-slate-950 border-slate-800 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-400" /> Live Route Tracking
            </h3>
            {delivery.routeOverlap && (
              <Badge variant="cyan" className="animate-pulse">
                {delivery.routeOverlap}% Route Overlap
              </Badge>
            )}
          </div>
          
          <div className="relative h-24 flex items-center justify-between px-4 sm:px-10">
            {/* Background Line */}
            <div className="absolute left-4 right-4 sm:left-10 sm:right-10 top-1/2 -translate-y-1/2 h-1.5 bg-slate-800 rounded-full"></div>
            
            {/* Progress Line */}
            <motion.div 
              className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${delivery.progress || 0}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>

            {/* Nodes */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] border-2 border-white"></div>
              <span className="absolute top-6 text-xs font-bold whitespace-nowrap">{delivery.pickupArea}</span>
              <span className="absolute -top-6 text-[10px] text-slate-400">Pickup</span>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full ${isTransit ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'bg-slate-700'} border-2 border-white transition-colors duration-500`}></div>
              <span className="absolute top-6 text-xs font-bold whitespace-nowrap">{delivery.destinationArea}</span>
              <span className="absolute -top-6 text-[10px] text-slate-400">Dropoff</span>
            </div>

            {/* Rider Marker */}
            {isMatched && (
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 -ml-3 z-20"
                initial={{ left: "0%" }}
                animate={{ left: `${delivery.progress || (delivery.status === "pickedUp" ? 5 : 0)}%` }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Truck className="w-3.5 h-3.5 text-slate-900" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Environmental Impact & Savings (Aha Moment) */}
          <AnimatePresence>
            {isMatched && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-800 pt-5"
              >
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Standard Cost</p>
                  <p className="text-lg font-mono line-through text-slate-500">₹{delivery.originalFee || 120}</p>
                </div>
                <div className="text-center border-x border-slate-800">
                  <p className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1 font-bold">Shared Cost</p>
                  <p className="text-2xl font-mono font-bold text-emerald-400">₹{delivery.estimatedFee}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-1 font-bold">🌱 CO₂ Saved</p>
                  <p className="text-lg font-mono font-bold text-blue-400">{delivery.co2Saved || 0.8} kg</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Active Delivery Details Card */}
      <Card className="p-6 border-slate-200 dark:border-slate-800 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="flex justify-between items-start mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h4 className="text-2xl font-black font-mono text-foreground">#{delivery.id}</h4>
              <Badge variant={delivery.status === "delivered" ? "success" : "live"} className="uppercase tracking-wider">
                {delivery.status.replace(/([A-Z])/g, " $1").trim()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <User className="w-4 h-4" /> {delivery.customerName || "Customer"} • {delivery.packageDetails} ({delivery.weight})
            </p>
          </div>
          {isMatched && (
            <div className="text-right">
              <Badge variant="success" className="mb-1 text-sm py-1">29% SAVED</Badge>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">₹{delivery.originalFee ? delivery.originalFee - (delivery.estimatedFee || 0) : 0} savings</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Timeline */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Delivery Timeline</h5>
            <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
              <TimelineStep title="Order Created" done={true} active={delivery.status === "requested"} />
              <TimelineStep title="Rider Matched" done={isMatched} active={delivery.status === "matching"} />
              <TimelineStep title="Package Picked Up" done={isTransit} active={delivery.status === "pickedUp"} />
              <TimelineStep title="In Transit" done={delivery.status === "delivered"} active={delivery.status === "inTransit"} />
              <TimelineStep title="Delivered" done={delivery.status === "delivered"} active={delivery.status === "delivered"} />
            </div>
          </div>

          {/* Rider Info */}
          {isMatched && rider && (
            <div className="bg-slate-50 dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 h-fit">
              <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Assigned Partner</h5>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold text-xl">
                  {rider.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">{rider.name}</p>
                  <p className="text-sm flex items-center gap-1 text-muted-foreground">
                    <span className="text-amber-500 font-bold">★ 4.9</span> • Electric Scooter
                  </p>
                </div>
              </div>
              
              {delivery.status === "inTransit" && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm font-medium">
                  <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <Navigation className="w-4 h-4" /> 4.2 km remaining
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4" /> ETA 11:05 AM
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function TimelineStep({ title, done, active }: { title: string; done: boolean; active: boolean }) {
  return (
    <div className={`relative flex items-center gap-3 ${active ? "opacity-100 scale-105 origin-left font-bold" : done ? "opacity-70" : "opacity-40"} transition-all duration-300`}>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 ${
        done ? "bg-emerald-500 text-white" : active ? "bg-blue-500 text-white animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]" : "bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700"
      }`}>
        {done ? <Check className="w-3 h-3" /> : active ? <div className="w-2 h-2 bg-white rounded-full" /> : null}
      </div>
      <span className={`text-sm ${done || active ? "text-foreground" : "text-muted-foreground"}`}>{title}</span>
    </div>
  );
}
