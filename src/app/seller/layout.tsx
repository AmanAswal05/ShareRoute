"use client";

import React from "react";
import Link from "next/link";
import { Store, Package, PlusCircle, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 py-6 gap-6">
      {/* Sleek Glass Sidebar */}
      <aside className="w-full md:w-64 border border-white/10 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 shrink-0 shadow-xl flex flex-col justify-between">
        <div>
          {/* Seller Profile Header */}
          <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Store className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold text-foreground truncate">Sweet Home Bakery</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Verified Seller</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Navigation
          </div>

          <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
            <NavItem href="/seller" active icon={<Package className="w-4 h-4" />}>
              Overview
            </NavItem>
            <NavItem href="/seller" icon={<PlusCircle className="w-4 h-4" />}>
              Create Order
            </NavItem>
            <NavItem href="/seller" icon={<Clock className="w-4 h-4" />}>
              Active Route Status
            </NavItem>
          </nav>
        </div>

        <div className="hidden md:block pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-xs text-muted-foreground space-y-1">
            <div className="font-semibold text-foreground flex items-center justify-between">
              <span>Cluster Zone</span>
              <Badge variant="cyan" className="text-[10px] px-1.5 py-0">Navi Mumbai</Badge>
            </div>
            <p className="text-[11px]">Kharghar • Vashi • Nerul</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
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
          ? "bg-primary text-white shadow-md shadow-primary/25 font-semibold"
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
