import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { DemoControlPanel } from "@/components/DemoControlPanel";
import { CanvasContainer } from "@/components/three/CanvasContainer";

export const metadata: Metadata = {
  title: "ShareRoute - Decentralized Shared Delivery Logistics Network",
  description: "A collaborative logistics protocol connecting local businesses and delivery partners with algorithmic routing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased selection:bg-primary/20 selection:text-primary">
        {/* Global 3D Interactive Canvas Layer */}
        <CanvasContainer />

        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 relative z-10">
            {children}
          </main>
          <DemoControlPanel />
        </div>
      </body>
    </html>
  );
}
