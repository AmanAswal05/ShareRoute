"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";

// Lazy load the 3D Scene with ssr disabled
const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-[-1] bg-slate-50 dark:bg-slate-950 flex items-center justify-center pointer-events-none">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  ),
});

export function CanvasContainer() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Only render canvas on the client side to prevent hydration mismatches
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <Scene />
    </Suspense>
  );
}
