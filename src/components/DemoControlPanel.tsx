"use client";

import { useState, useEffect, useRef } from "react";
import { useDemoStore, Delivery } from "@/store/demoStore";
import { Button } from "./ui";
import { Play, RotateCcw, X, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DemoControlPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [demoSpeed, setDemoSpeed] = useState<"Normal" | "Fast" | "Presentation">("Presentation");
  const { deliveries, resetDemo, updateDeliveryStatus, updateDeliveryData, addNotification } = useDemoStore();
  
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => stopSimulation();
  }, []);

  const stopSimulation = () => {
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
      simulationInterval.current = null;
    }
  };

  const handleReset = () => {
    stopSimulation();
    resetDemo();
  };

  const getSpeedMs = () => {
    if (demoSpeed === "Presentation") return 1500;
    if (demoSpeed === "Fast") return 2500;
    return 4000;
  };

  const startLiveSimulation = () => {
    stopSimulation();
    handleReset();
    
    // Give it a brief moment to reset, then start interval
    setTimeout(() => {
      simulationInterval.current = setInterval(() => {
        // Find current state snapshot
        const currentDeliveries = useDemoStore.getState().deliveries;
        
        // 1. Advance the Hero Order (SR-1048)
        const hero = currentDeliveries.find(d => d.id === "SR-1048");
        if (hero) {
          if (hero.status === "inTransit" && hero.progress! < 100) {
            const nextProgress = Math.min(100, hero.progress! + 12);
            updateDeliveryData(hero.id, { progress: nextProgress });
            if (nextProgress === 100) {
              updateDeliveryStatus(hero.id, "delivered", hero.riderId);
              addNotification(`10:${Math.floor(Math.random()*60).toString().padStart(2, '0')} — SR-1048 delivery completed`);
            }
          }
        }

        // 2. Randomly advance 2 other deliveries
        const activePool = currentDeliveries.filter(d => d.id !== "SR-1048" && d.status !== "delivered");
        
        for (let i = 0; i < 2; i++) {
          if (activePool.length > 0) {
            const randIdx = Math.floor(Math.random() * activePool.length);
            const target = activePool[randIdx];
            
            if (target.status === "requested") {
              updateDeliveryStatus(target.id, "matching");
            } else if (target.status === "matching") {
              updateDeliveryStatus(target.id, "riderAssigned", "r2");
              addNotification(`10:${Math.floor(Math.random()*60).toString().padStart(2, '0')} — ${target.id} matched with rider`);
            } else if (target.status === "riderAssigned") {
              updateDeliveryStatus(target.id, "pickedUp", target.riderId);
            } else if (target.status === "pickedUp") {
              updateDeliveryStatus(target.id, "inTransit", target.riderId);
              updateDeliveryData(target.id, { progress: 10 });
              addNotification(`10:${Math.floor(Math.random()*60).toString().padStart(2, '0')} — Rider picked up ${target.id}`);
            } else if (target.status === "inTransit") {
              const nextProg = Math.min(100, (target.progress || 10) + 15);
              updateDeliveryData(target.id, { progress: nextProg });
              if (nextProg === 100) {
                updateDeliveryStatus(target.id, "delivered", target.riderId);
              }
            }
          }
        }

      }, getSpeedMs());
    }, 500);
  };

  return (
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
              <span>Network Simulator</span>
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            className="bg-white/95 dark:bg-slate-900/95 border border-primary/30 shadow-2xl backdrop-blur-3xl rounded-2xl w-[320px] overflow-hidden"
          >
            <div className="flex justify-between items-center p-3 border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/50">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">Network Control Deck</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 text-sm">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Simulation Speed</label>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1">
                  {["Normal", "Fast", "Presentation"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setDemoSpeed(s as any)}
                      className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${
                        demoSpeed === s
                          ? "bg-white dark:bg-slate-700 shadow-sm text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="glow" size="lg" className="w-full font-bold shadow-lg shadow-primary/20" onClick={startLiveSimulation}>
                  <Play className="w-4 h-4 mr-2" /> Start Live Network Demo
                </Button>
                <Button variant="outline" size="lg" className="w-full text-destructive border-destructive/20 hover:bg-destructive/10" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset Network State
                </Button>
              </div>

              <div className="h-px bg-slate-200 dark:bg-slate-800" />
              
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Live Demo Sequence</p>
                <ol className="text-xs space-y-1 text-slate-600 dark:text-slate-400 list-decimal pl-3">
                  <li>Dashboard populates with 50 items</li>
                  <li>Metrics and Live Feed begin running</li>
                  <li>Random background routes progress</li>
                  <li>SR-1048 progresses to DELIVERED</li>
                </ol>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
