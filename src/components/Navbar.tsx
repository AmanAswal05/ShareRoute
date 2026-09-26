"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoStore } from "@/store/demoStore";
import { Button, Badge } from "./ui";
import { Package, RefreshCw, Store, Truck, ShieldCheck, Sparkles, Activity } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const { isDemoMode, resetDemo, deliveries, riders } = useDemoStore();

  const activeDeliveriesCount = deliveries.filter(
    (d) => !["delivered", "requested"].includes(d.status)
  ).length;

  const handleReset = () => {
    if (confirm("Reset all demo activity and simulate fresh state?")) {
      resetDemo();
    }
  };

  const navLinks = [
    { href: "/seller", label: "Seller Portal", icon: <Store className="w-4 h-4" /> },
    { href: "/rider", label: "Rider Hub", icon: <Truck className="w-4 h-4" /> },
    { href: "/admin", label: "Admin Operations", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-cyan-500 shadow-md shadow-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/40">
            <Package className="h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-foreground flex items-center gap-1.5">
              ShareRoute
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">v2.0</span>
            </span>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">Decentralized Logistics Mesh</span>
          </div>
        </Link>

        {/* Central Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-primary font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-800/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {link.icon}
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Live Status & Demo Controls */}
        <div className="flex items-center space-x-3">
          {activeDeliveriesCount > 0 && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>{activeDeliveriesCount} Active Route{activeDeliveriesCount > 1 ? "s" : ""}</span>
            </div>
          )}

          {isDemoMode && (
            <div className="flex items-center gap-2">
              <Badge variant="live" className="hidden sm:inline-flex">
                ● LIVE DEMO
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-9 gap-1.5 border-slate-200 dark:border-slate-800 text-xs font-medium"
              >
                <RefreshCw className="h-3.5 w-3.5 text-muted-foreground transition-transform hover:rotate-180 duration-500" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/40 px-4 py-2 justify-around">
        {navLinks.map((link) => {
          const isActive = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg ${
                isActive
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.icon}
              {link.label.split(" ")[0]}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
