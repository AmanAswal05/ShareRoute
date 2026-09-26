import { Delivery, Rider, useDemoStore } from '../store/demoStore';

const areaCoordinates: Record<string, {x: number, y: number}> = {
  "Kharghar": { x: 15, y: 0 },
  "Belapur": { x: 10, y: 0 },
  "Nerul": { x: 10, y: 5 },
  "Sanpada": { x: 10, y: 8 },
  "Vashi": { x: 10, y: 12 },
};

function calculateDistance(area1: string, area2: string): number {
  const p1 = areaCoordinates[area1] || {x: 0, y: 0};
  const p2 = areaCoordinates[area2] || {x: 0, y: 0};
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export function estimateFee(pickup: string, destination: string, packageSize: string, priority: string): number {
  const baseFee = 30;
  const dist = calculateDistance(pickup, destination);
  const distanceFee = dist * 5;
  const packageFee = packageSize === "Large" ? 20 : packageSize === "Medium" ? 10 : 0;
  const priorityFee = priority === "Priority" ? 25 : 0;
  
  return Math.round(baseFee + distanceFee + packageFee + priorityFee);
}

export function estimateTime(pickup: string, destination: string): number {
  const dist = calculateDistance(pickup, destination);
  return Math.round(15 + dist * 2); // Base 15 mins + 2 mins per distance unit
}

export interface MatchResult {
  rider: Rider;
  score: number;
  reasons: string[];
  routeCompatibility: "High" | "Medium" | "Low";
  estimatedTime: number;
  estimatedFee: number;
  pickupDistance: number;
}

export function findBestRider(delivery: Delivery, riders: Rider[], existingDeliveries: Delivery[]): MatchResult | null {
  let bestMatch: MatchResult | null = null;
  let highestScore = -1;

  for (const rider of riders) {
    if (rider.status !== "available") continue;

    let score = 100;
    const reasons: string[] = [];
    
    // 1. Distance from rider to pickup
    const pickupDist = calculateDistance(rider.area, delivery.pickupArea);
    score -= (pickupDist * 2);
    if (pickupDist < 3) reasons.push("Rider is very close to pickup");

    // 2. Route compatibility with existing active deliveries
    let routeCompatibility: "High" | "Medium" | "Low" = "Low";
    
    const riderActiveDeliveries = existingDeliveries.filter(d => 
      d.riderId === rider.id && 
      ["riderAssigned", "riderArriving", "pickedUp", "inTransit"].includes(d.status)
    );

    if (riderActiveDeliveries.length > 0) {
      // Check if pickup or destination aligns
      const alignsPickup = riderActiveDeliveries.some(d => d.pickupArea === delivery.pickupArea);
      const alignsDest = riderActiveDeliveries.some(d => d.destinationArea === delivery.destinationArea);
      
      if (alignsPickup && alignsDest) {
        score += 50;
        routeCompatibility = "High";
        reasons.push("Perfect route alignment with current deliveries");
      } else if (alignsPickup || alignsDest) {
        score += 20;
        routeCompatibility = "Medium";
        reasons.push("Partial route alignment");
      } else {
        score -= 30; // Might delay existing deliveries
        reasons.push("Detour required");
      }
    } else {
      routeCompatibility = "High";
      reasons.push("Rider has no other active deliveries");
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = {
        rider,
        score,
        reasons,
        routeCompatibility,
        estimatedTime: estimateTime(delivery.pickupArea, delivery.destinationArea),
        estimatedFee: delivery.estimatedFee || estimateFee(delivery.pickupArea, delivery.destinationArea, delivery.packageSize, delivery.priority),
        pickupDistance: Number(pickupDist.toFixed(1))
      };
    }
  }

  // To guarantee a match for demo purposes if someone is available, we might just return the best one even if score is low
  return bestMatch;
}

export function detectSharedRouteOpportunities(deliveries: Delivery[]): Delivery[][] {
  const pending = deliveries.filter(d => d.status === "requested" || d.status === "matching");
  const opportunities: Delivery[][] = [];
  
  // Group by same pickup area
  const groupedByPickup = pending.reduce((acc, d) => {
    if (!acc[d.pickupArea]) acc[d.pickupArea] = [];
    acc[d.pickupArea].push(d);
    return acc;
  }, {} as Record<string, Delivery[]>);

  for (const pickup in groupedByPickup) {
    if (groupedByPickup[pickup].length > 1) {
      // Found potential shared route
      opportunities.push(groupedByPickup[pickup]);
    }
  }

  return opportunities;
}
