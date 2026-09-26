"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Package, Users, Truck, Network, Store, Route, ShieldCheck, Sparkles, Zap, CheckCircle2, TrendingUp, Activity } from "lucide-react";
import { Button, Card, CardContent, Badge as UIBadge } from "@/components/ui";
import { TiltCard } from "@/components/motion/TiltCard";
import { GlowCard } from "@/components/motion/GlowCard";
import { CountUp } from "@/components/motion/CountUp";
import { StaggerContainer, StaggerItem, PageTransition } from "@/components/motion/PageTransition";
import { Magnetic } from "@/components/motion/Magnetic";
import { useRef } from "react";

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <PageTransition className="flex flex-col relative min-h-screen" ref={containerRef}>
      {/* Decorative Ambient Background Glows (Kept subtle so they don't fight 3D) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none opacity-50 dark:opacity-20 animate-pulse"></div>
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none opacity-50 dark:opacity-20"></div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 md:pt-32 pb-24 lg:pb-32">
        <div className="container relative mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: y1, opacity }}
              className="z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl mb-8 shadow-sm">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Shared Logistics Protocol
                </span>
              </div>

              <motion.h1 
                className="text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter text-foreground mb-8 leading-[1.05] drop-shadow-sm flex flex-col"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.15 } }
                }}
              >
                <motion.span variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}>
                  Deliver
                </motion.span>
                <motion.span variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-cyan-500">Together.</span>
                </motion.span>
              </motion.h1>

              <p className="text-lg md:text-xl text-muted-foreground/90 max-w-lg mb-10 leading-relaxed font-medium">
                Unite local retailers through a decentralized delivery network. Optimize routes, slash fulfillment costs, and empower community drivers.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Magnetic strength={0.2}>
                  <Link href="/seller" className="w-full sm:w-auto block">
                    <Button variant="glow" size="xl" className="w-full sm:w-auto group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 border-0 rounded-2xl shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]">
                      <span className="relative z-10 flex items-center font-bold">
                        Launch Demo <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </Magnetic>
                <Magnetic strength={0.1}>
                  <a href="#how-it-works" className="w-full sm:w-auto block">
                    <Button variant="outline" size="xl" className="w-full sm:w-auto rounded-2xl border-2 bg-white/10 dark:bg-slate-900/10 backdrop-blur-md hover:bg-white/20 dark:hover:bg-slate-800/20 font-bold">
                      Explore Architecture
                    </Button>
                  </a>
                </Magnetic>
              </div>
            </motion.div>

            {/* Right Simulation Widget */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
              transition={{ 
                opacity: { duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 } 
              }}
              style={{ y: y2 }}
              className="relative lg:ml-auto w-full max-w-lg"
            >
              {/* Widget Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-emerald-500/30 blur-3xl rounded-full -z-10 animate-pulse"></div>

              <TiltCard className="w-full">
                <div className="bg-white/70 dark:bg-slate-950/70 border border-white/40 dark:border-white/10 rounded-3xl p-1 shadow-2xl backdrop-blur-2xl overflow-hidden relative">
                  {/* Grid pattern overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50 mix-blend-overlay"></div>
                  
                  <div className="bg-gradient-to-b from-white/40 to-white/10 dark:from-slate-900/40 dark:to-slate-900/10 rounded-[1.35rem] p-6 relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
                          <div className="w-3 h-3 rounded-full bg-amber-400/80 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                          <div className="w-3 h-3 rounded-full bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
                        </div>
                        <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase ml-2">Live Match</span>
                      </div>
                      <UIBadge variant="cyan" className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20">Sync Active</UIBadge>
                    </div>

                    <div className="space-y-4">
                      {/* Source */}
                      <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-white/20 dark:border-slate-800 backdrop-blur-md">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-inner">
                          <Store className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-foreground">Sweet Home Bakery</h4>
                          <p className="text-xs text-muted-foreground font-medium">Order #1024 • Kharghar</p>
                        </div>
                        <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
                      </div>

                      {/* Connection Line */}
                      <div className="pl-10 flex flex-col justify-center py-1">
                        <div className="h-8 border-l-2 border-dashed border-slate-300 dark:border-slate-700 relative">
                           <motion.div 
                             className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"
                             animate={{ top: ["0%", "100%"] }}
                             transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                           />
                        </div>
                      </div>

                      {/* Destination / Rider */}
                      <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-white/20 dark:border-slate-800 backdrop-blur-md">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                          <Truck className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-foreground">Rider #17 • Rahul</h4>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Match Score: 98.4%</p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium Statistics Marquee/Banner */}
      <section className="py-10 border-y border-white/5 bg-slate-950/40 backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x divide-white/5">
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 dark:from-white dark:to-white/50 mb-2">
                <CountUp value={42} suffix="%" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Cost Reduction</p>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-600 mb-2">
                <CountUp value={3.2} suffix="x" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Efficiency</p>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-blue-600 mb-2">
                <CountUp value={18} suffix="m" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Avg Dispatch</p>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-purple-600 mb-2">
                <CountUp value={100} suffix="%" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Automated</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem - Bento Box Layout */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-20"
          >
            <UIBadge variant="warning" className="mb-6 py-1.5 px-4 text-sm font-bold bg-amber-500/10 text-amber-600 border-amber-500/20">The Friction</UIBadge>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.1]">
              Logistics shouldn&apos;t be a <span className="text-amber-500">luxury.</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              Small retailers lose margins to premium delivery apps or struggle to maintain private fleets. The current fragmented system is inefficient, costly, and unsustainable.
            </p>
          </motion.div>

          {/* Bento Box Grid */}
          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-6">
            {/* Box 1 - Large */}
            <StaggerItem className="md:col-span-2 md:row-span-1">
              <Card className="h-full min-h-[280px] border-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 dark:from-red-500/10 dark:to-orange-500/10 backdrop-blur-xl shadow-none hover:shadow-xl transition-all duration-500 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
                   <Magnetic strength={0.4}>
                     <TrendingUp className="w-32 h-32 text-red-500" />
                   </Magnetic>
                </div>
                <CardContent className="p-8 h-full flex flex-col justify-end relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-600 flex items-center justify-center mb-6 mt-auto">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-2xl text-foreground mb-3">Crushing Overheads</h3>
                  <p className="text-muted-foreground font-medium text-lg max-w-md">Low order density forces businesses to pay ad-hoc fees, bleeding profits on every single order.</p>
                </CardContent>
              </Card>
            </StaggerItem>

            {/* Box 2 */}
            <StaggerItem>
              <Card className="h-full min-h-[280px] border-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-none hover:shadow-xl transition-all duration-500">
                <CardContent className="p-8 h-full flex flex-col justify-end">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center mb-6 mt-auto">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-2xl text-foreground mb-3">Fleet Limits</h3>
                  <p className="text-muted-foreground font-medium">Fixed staffing fails during peak hours and wastes money during lulls.</p>
                </CardContent>
              </Card>
            </StaggerItem>

            {/* Box 3 */}
            <StaggerItem>
              <Card className="h-full min-h-[280px] border-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-none hover:shadow-xl transition-all duration-500">
                <CardContent className="p-8 h-full flex flex-col justify-end">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-600 flex items-center justify-center mb-6 mt-auto">
                    <Route className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-2xl text-foreground mb-3">Redundant Routes</h3>
                  <p className="text-muted-foreground font-medium">Adjacent stores dispatch separate riders to identical neighborhoods.</p>
                </CardContent>
              </Card>
            </StaggerItem>

            {/* Box 4 - Large */}
            <StaggerItem className="md:col-span-2 md:row-span-1">
              <Card className="h-full min-h-[280px] border-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 dark:from-purple-500/10 dark:to-indigo-500/10 backdrop-blur-xl shadow-none hover:shadow-xl transition-all duration-500 overflow-hidden relative group">
                 <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
                   <Magnetic strength={0.4}>
                     <Zap className="w-32 h-32 text-purple-500" />
                   </Magnetic>
                </div>
                <CardContent className="p-8 h-full flex flex-col justify-end relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-600 flex items-center justify-center mb-6 mt-auto">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-2xl text-foreground mb-3">Blind Operations</h3>
                  <p className="text-muted-foreground font-medium text-lg max-w-md">No telemetry, manual coordination via phone calls, and zero transparency for the end customer.</p>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* The Solution - Immersive Architecture Section */}
      <section className="py-32 border-t border-white/5 bg-slate-50/50 dark:bg-slate-950/80 backdrop-blur-3xl relative overflow-hidden">
        {/* Huge background typography watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-slate-200/30 dark:text-slate-800/20 whitespace-nowrap pointer-events-none select-none z-0">
          MESH NETWORK
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <UIBadge variant="success" className="mb-6 py-1.5 px-4 text-sm font-bold bg-emerald-500/10 text-emerald-600 border-emerald-500/20">The Solution</UIBadge>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.1]">
              A Collaborative <span className="gradient-text-emerald">Ecosystem.</span>
            </h2>
            <p className="text-xl text-muted-foreground font-medium">
              We replace fragmented private fleets with a unified, smart-matching mesh topology. 
            </p>
          </div>

          <div className="space-y-32">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-16 group">
              <div className="md:w-1/2 relative z-10">
                 <div className="text-8xl md:text-[12rem] font-black text-slate-200/50 dark:text-slate-800/40 absolute -top-12 -left-4 md:-top-20 md:-left-12 -z-10 transition-transform group-hover:scale-110 duration-700 pointer-events-none select-none">01</div>
                 <h3 className="text-3xl md:text-4xl font-black mb-4 relative z-10">Instant Ingestion</h3>
                 <p className="text-lg text-muted-foreground font-medium leading-relaxed relative z-10">Sellers publish package orders instantly through a unified dashboard or API. No phone calls, no spreadsheets.</p>
              </div>
              <div className="md:w-1/2 w-full z-10">
                 <TiltCard>
                   <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20 border border-white/10 dark:border-slate-800">
                     <Image 
                       src="/images/instant_ingestion.jpg" 
                       alt="Instant Ingestion Dashboard" 
                       fill 
                       className="object-cover transition-transform duration-700 hover:scale-105"
                     />
                   </div>
                 </TiltCard>
              </div>
            </div>

             {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-16 group">
              <div className="md:w-1/2 relative z-10">
                 <div className="text-8xl md:text-[12rem] font-black text-slate-200/50 dark:text-slate-800/40 absolute -top-12 -left-4 md:-top-20 md:-left-12 -z-10 transition-transform group-hover:scale-110 duration-700 pointer-events-none select-none">02</div>
                 <h3 className="text-3xl md:text-4xl font-black mb-4 relative z-10">Heuristic Matching</h3>
                 <p className="text-lg text-muted-foreground font-medium leading-relaxed relative z-10">Our engine continuously evaluates rider vectors, load capacities, and geospatial data to forge the perfect pairing.</p>
              </div>
              <div className="md:w-1/2 w-full z-10">
                 <TiltCard>
                   <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/20 border border-white/10 dark:border-slate-800">
                     <Image 
                       src="/images/heuristic_matching.jpg" 
                       alt="Heuristic Matching Engine" 
                       fill 
                       className="object-cover transition-transform duration-700 hover:scale-105"
                     />
                   </div>
                 </TiltCard>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-16 group">
              <div className="md:w-1/2 relative z-10">
                 <div className="text-8xl md:text-[12rem] font-black text-slate-200/50 dark:text-slate-800/40 absolute -top-12 -left-4 md:-top-20 md:-left-12 -z-10 transition-transform group-hover:scale-110 duration-700 pointer-events-none select-none">03</div>
                 <h3 className="text-3xl md:text-4xl font-black mb-4 relative z-10">Shared Corridors</h3>
                 <p className="text-lg text-muted-foreground font-medium leading-relaxed relative z-10">Deliveries heading to the same cluster are batched. One rider, multiple sellers, zero redundant trips.</p>
              </div>
              <div className="md:w-1/2 w-full z-10">
                 <TiltCard>
                   <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-white/10 dark:border-slate-800">
                     <Image 
                       src="/images/shared_corridors.jpg" 
                       alt="Shared Delivery Corridors" 
                       fill 
                       className="object-cover transition-transform duration-700 hover:scale-105"
                     />
                   </div>
                 </TiltCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Section (Role Portals) */}
      <section id="how-it-works" className="py-32 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6">
              Enter the Protocol
            </h2>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              Experience the customized interfaces engineered for every participant in the network.
            </p>
          </motion.div>

          <StaggerContainer staggerDelay={0.2} className="grid md:grid-cols-3 gap-8">
            {/* Seller Portal */}
            <StaggerItem>
              <TiltCard>
                <Link href="/seller" className="block h-full group">
                  <Card className="h-full border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl shadow-xl p-10 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors duration-500">
                    <div className="w-20 h-20 bg-blue-500/10 text-blue-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:bg-blue-500 group-hover:text-white shadow-lg shadow-blue-500/20">
                      <Store className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-black text-foreground mb-4">Retailer</h3>
                    <p className="text-muted-foreground font-medium text-lg mb-10">
                      Publish orders and track fulfillments on the shared network.
                    </p>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold text-lg group-hover:translate-x-2 transition-transform">
                      Launch Portal <ArrowRight className="ml-2 w-6 h-6" />
                    </div>
                  </Card>
                </Link>
              </TiltCard>
            </StaggerItem>

            {/* Rider Hub */}
            <StaggerItem>
              <TiltCard>
                <Link href="/rider" className="block h-full group">
                  <Card className="h-full border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl shadow-xl p-10 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 transition-colors duration-500">
                    <div className="w-20 h-20 bg-amber-500/10 text-amber-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:bg-amber-500 group-hover:text-white shadow-lg shadow-amber-500/20">
                      <Truck className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-black text-foreground mb-4">Rider</h3>
                    <p className="text-muted-foreground font-medium text-lg mb-10">
                      Accept optimized batch routes and maximize your earnings per trip.
                    </p>
                    <div className="flex items-center text-amber-600 dark:text-amber-400 font-bold text-lg group-hover:translate-x-2 transition-transform">
                      Launch Hub <ArrowRight className="ml-2 w-6 h-6" />
                    </div>
                  </Card>
                </Link>
              </TiltCard>
            </StaggerItem>

            {/* Admin Ops */}
            <StaggerItem>
              <TiltCard>
                <Link href="/admin" className="block h-full group">
                  <Card className="h-full border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl shadow-xl p-10 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-colors duration-500">
                    <div className="w-20 h-20 bg-purple-500/10 text-purple-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:bg-purple-500 group-hover:text-white shadow-lg shadow-purple-500/20">
                      <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-black text-foreground mb-4">Operator</h3>
                    <p className="text-muted-foreground font-medium text-lg mb-10">
                      Oversee network health, monitor clustering, and adjust heuristics.
                    </p>
                    <div className="flex items-center text-purple-600 dark:text-purple-400 font-bold text-lg group-hover:translate-x-2 transition-transform">
                      Launch Command <ArrowRight className="ml-2 w-6 h-6" />
                    </div>
                  </Card>
                </Link>
              </TiltCard>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Modernized Footer */}
      <footer className="border-t border-white/5 bg-slate-950/80 backdrop-blur-3xl text-slate-300 py-20 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-primary/20">
                  <Package className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black text-white tracking-tight">ShareRoute</span>
              </div>
              <p className="text-lg text-slate-400 max-w-md leading-relaxed font-medium mb-8">
                A collaborative logistics protocol exploring how local delivery capacity can be algorithmically shared across small businesses.
              </p>
              <div className="flex flex-wrap gap-3">
                <UIBadge variant="outline" className="border-slate-800 text-slate-400">React 19</UIBadge>
                <UIBadge variant="outline" className="border-slate-800 text-slate-400">Next.js App Router</UIBadge>
                <UIBadge variant="outline" className="border-slate-800 text-slate-400">React Three Fiber</UIBadge>
              </div>
            </div>

            <div className="md:pl-12">
              <h4 className="font-black text-white text-lg tracking-wider mb-6">TECH STACK</h4>
              <ul className="text-base space-y-4 font-medium text-slate-400">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> WebGL 3D Ambient Visualization
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Client-Side Matching Engine
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" /> Zustand Reactive State
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500" /> Framer Motion Choreography
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-slate-500">
            <p>ShareRoute Prototype • Built for Performance & Scale</p>
            <p>© {new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </footer>
    </PageTransition>
  );
}

