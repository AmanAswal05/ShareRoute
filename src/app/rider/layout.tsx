"use client";

import React from "react";
import Link from "next/link";
import { Truck, Navigation, CheckCircle, Clock, Zap, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui";

export default function RiderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 py-6 gap-6">
      {/* Driver Telemetry Sidebar */}
      <aside className="w-full md:w-64 border border-white/10 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 shrink-0 shadow-xl flex flex-col justify-between">
        <div>
          {/* Rider Profile Card */}
          <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-md shadow-amber-500/20">
              R17
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold text-foreground truncate">Rahul Sharma</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                <span>Vashi Hub Zone</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Driver Hub
          </div>

          <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
            <NavItem href="/rider" active icon={<Truck className="w-4 h-4" />}>
              Dashboard
            </NavItem>
            <NavItem href="/rider" icon={<Navigation className="w-4 h-4" />}>
              Available Loads
            </NavItem>
            <NavItem href="/rider" icon={<Clock className="w-4 h-4" />}>
              Active Delivery Run
            </NavItem>
          </nav>
        </div>

        <div className="hidden md:block pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs space-y-1">
            <div className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Smart Surge Active</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Shared dropoffs earn +25% bonus.</p>
          </div>
        </div>
      </aside>

      {/* Main Rider Content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  );
}

function NavItem({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/25 font-semibold"
          : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-foreground"
      }`}
    >
      <div className="flex items-center gap-2.5">
        {icon}
        <span>{children}</span>
      </div>
      {active && <ChevronRight className="w-4 h-4 opacity-70" />}
    </Link>
  );
}
