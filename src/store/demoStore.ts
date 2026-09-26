import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DeliveryStatus =
  | "requested"
  | "matching"
  | "riderAssigned"
  | "riderArriving"
  | "pickedUp"
  | "inTransit"
  | "delivered";

export interface Seller {
  id: string;
  name: string;
  category: string;
  area: string;
}

export interface Rider {
  id: string;
  name: string;
  status: "available" | "busy" | "offline";
  area: string;
}

export interface Delivery {
  id: string;
  sellerId: string;
  pickupArea: string;
  destinationArea: string;
  packageSize: "Small" | "Medium" | "Large";
  priority: "Standard" | "Priority";
  status: DeliveryStatus;
  riderId?: string;
  estimatedFee?: number;
  estimatedTime?: number;
  createdAt: number;
}

export interface SharedRoute {
  id: string;
  name: string;
  deliveryIds: string[];
  suggestedRiderId: string;
  status: "suggested" | "coordinated";
}

export interface AppNotification {
  id: string;
  message: string;
  timestamp: number;
}

interface DemoState {
  isDemoMode: boolean;
  sellers: Seller[];
  riders: Rider[];
  deliveries: Delivery[];
  sharedRoutes: SharedRoute[];
  notifications: AppNotification[];

  toggleDemoMode: () => void;
  resetDemo: () => void;
  addDelivery: (delivery: Delivery) => void;
  updateDeliveryStatus: (id: string, status: DeliveryStatus, riderId?: string) => void;
  updateRiderStatus: (id: string, status: Rider['status']) => void;
  addNotification: (message: string) => void;
  addSharedRoute: (route: SharedRoute) => void;
  updateSharedRouteStatus: (id: string, status: SharedRoute['status']) => void;
  clearNotifications: () => void;
}

const initialSellers: Seller[] = [
  { id: "s1", name: "Sweet Home Bakery", category: "Food", area: "Kharghar" },
  { id: "s2", name: "Craft Corner", category: "Handmade", area: "Vashi" },
  { id: "s3", name: "Urban Threads", category: "Clothing", area: "Nerul" },
  { id: "s4", name: "Fresh Bowl Kitchen", category: "Food", area: "Sanpada" },
  { id: "s5", name: "Bloom Box", category: "Gifts", area: "Belapur" },
];

const initialRiders: Rider[] = [
  { id: "r1", name: "Rahul", status: "available", area: "Kharghar" },
  { id: "r2", name: "Arjun", status: "busy", area: "Vashi" },
  { id: "r3", name: "Neha", status: "available", area: "Nerul" },
  { id: "r4", name: "Sameer", status: "offline", area: "Sanpada" },
  { id: "r5", name: "Priya", status: "available", area: "Belapur" },
];

// Seed some initial deliveries for the demo to look realistic initially
const initialDeliveries: Delivery[] = [
  { id: "SR1001", sellerId: "s2", pickupArea: "Vashi", destinationArea: "Nerul", packageSize: "Small", priority: "Standard", status: "delivered", riderId: "r2", estimatedFee: 40, estimatedTime: 15, createdAt: Date.now() - 3600000 },
  { id: "SR1002", sellerId: "s4", pickupArea: "Sanpada", destinationArea: "Vashi", packageSize: "Medium", priority: "Priority", status: "inTransit", riderId: "r2", estimatedFee: 65, estimatedTime: 20, createdAt: Date.now() - 1800000 },
];

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      isDemoMode: true,
      sellers: initialSellers,
      riders: initialRiders,
      deliveries: initialDeliveries,
      sharedRoutes: [],
      notifications: [],

      toggleDemoMode: () => set((state) => ({ isDemoMode: !state.isDemoMode })),
      
      resetDemo: () => set({
        sellers: initialSellers,
        riders: initialRiders,
        deliveries: initialDeliveries,
        sharedRoutes: [],
        notifications: [],
        isDemoMode: true
      }),

      addDelivery: (delivery) => set((state) => ({
        deliveries: [delivery, ...state.deliveries]
      })),

      updateDeliveryStatus: (id, status, riderId) => set((state) => ({
        deliveries: state.deliveries.map(d => 
          d.id === id ? { ...d, status, ...(riderId ? { riderId } : {}) } : d
        )
      })),

      updateRiderStatus: (id, status) => set((state) => ({
        riders: state.riders.map(r => 
          r.id === id ? { ...r, status } : r
        )
      })),

      addNotification: (message) => set((state) => ({
        notifications: [{ id: Math.random().toString(36).substring(7), message, timestamp: Date.now() }, ...state.notifications].slice(0, 20)
      })),

      addSharedRoute: (route) => set((state) => ({
        sharedRoutes: [route, ...state.sharedRoutes]
      })),

      updateSharedRouteStatus: (id, status) => set((state) => ({
        sharedRoutes: state.sharedRoutes.map(sr => 
          sr.id === id ? { ...sr, status } : sr
        )
      })),

      clearNotifications: () => set({ notifications: [] })
    }),
    {
      name: 'shareroute-demo-storage',
    }
  )
);
