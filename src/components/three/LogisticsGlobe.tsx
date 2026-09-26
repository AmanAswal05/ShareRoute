"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { usePathname } from "next/navigation";

// Convert spherical coordinates (lat, lon) to 3D Cartesian coordinates
function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// 3D Parabolic Arc generator between two points
function createArc(start: THREE.Vector3, end: THREE.Vector3, elevation = 1.2): THREE.CubicBezierCurve3 {
  const distance = start.distanceTo(end);
  const mid = start
    .clone()
    .lerp(end, 0.5)
    .normalize()
    .multiplyScalar(start.length() * (1 + distance * 0.12 * elevation));

  const mid1 = start.clone().lerp(mid, 0.5);
  const mid2 = mid.clone().lerp(end, 0.5);
  return new THREE.CubicBezierCurve3(start, mid1, mid2, end);
}

// Subtle photon pulse along an arc
function ArcPulse({
  curve,
  color = "#3b82f6",
  speed = 1,
}: {
  curve: THREE.CubicBezierCurve3;
  color?: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(Math.random());

  useFrame((_, delta) => {
    progressRef.current = (progressRef.current + delta * 0.2 * speed) % 1;
    if (meshRef.current) {
      const pos = curve.getPointAt(progressRef.current);
      meshRef.current.position.copy(pos);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.045, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

// Subtle orbiting logistics satellite (No distracting big trails)
function OrbitingSatellite({
  radius,
  speed,
  inclination,
  color,
  offset,
}: {
  radius: number;
  speed: number;
  inclination: number;
  color: string;
  offset: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t) * Math.sin(inclination) * (radius * 0.35);

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export function LogisticsGlobe() {
  const masterGroup = useRef<THREE.Group>(null);
  const outerGeodesic = useRef<THREE.Mesh>(null);
  const innerSphere = useRef<THREE.Mesh>(null);
  const ringsGroup = useRef<THREE.Group>(null);
  const pathname = usePathname() || "/";

  // Muted, sophisticated route colors for subtle ambient backdrop
  const theme = useMemo(() => {
    if (pathname.startsWith("/rider")) {
      return {
        primary: "#d97706",
        secondary: "#b45309",
        glow: "#92400e",
        arcCount: 6,
      };
    }
    if (pathname.startsWith("/admin")) {
      return {
        primary: "#7c3aed",
        secondary: "#0284c7",
        glow: "#4f46e5",
        arcCount: 8,
      };
    }
    if (pathname.startsWith("/seller")) {
      return {
        primary: "#2563eb",
        secondary: "#059669",
        glow: "#1d4ed8",
        arcCount: 7,
      };
    }
    return {
      primary: "#2563eb",
      secondary: "#0284c7",
      glow: "#1e40af",
      arcCount: 7,
    };
  }, [pathname]);

  const radius = 3.4;

  // Major Logistics Hub Coordinates
  const hubs = useMemo(() => {
    const rawCoords = [
      { name: "Kharghar", lat: 19.0473, lon: 73.0699 },
      { name: "Vashi", lat: 19.0771, lon: 72.9986 },
      { name: "Nerul", lat: 19.033, lon: 73.0297 },
      { name: "Belapur", lat: 19.0185, lon: 73.0396 },
      { name: "Sanpada", lat: 19.0658, lon: 73.0108 },
      { name: "Mumbai Central", lat: 18.9696, lon: 72.8193 },
      { name: "Thane", lat: 19.2183, lon: 72.9781 },
      { name: "East Station", lat: 40.7128, lon: -74.006 },
      { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
      { name: "London", lat: 51.5074, lon: -0.1278 },
      { name: "Singapore", lat: 1.3521, lon: 103.8198 },
    ];

    return rawCoords.map((c, i) => ({
      ...c,
      id: i,
      pos: latLongToVector3(c.lat, c.lon, radius),
    }));
  }, [radius]);

  // Generate Subtle 3D Arcs
  const { arcs, curves } = useMemo(() => {
    const arcList: { points: THREE.Vector3[]; id: number; color: string }[] = [];
    const curveList: { curve: THREE.CubicBezierCurve3; id: number; color: string; speed: number }[] = [];

    for (let i = 0; i < hubs.length; i++) {
      for (let j = i + 1; j < hubs.length; j++) {
        const dist = hubs[i].pos.distanceTo(hubs[j].pos);
        if (dist > 1.8 && dist < 6.0 && arcList.length < theme.arcCount) {
          const curve = createArc(hubs[i].pos, hubs[j].pos, 1.15);
          const points = curve.getPoints(35);
          const color = arcList.length % 2 === 0 ? theme.primary : theme.secondary;

          arcList.push({ points, id: arcList.length, color });
          curveList.push({ curve, id: curveList.length, color, speed: 0.8 + (i % 2) * 0.2 });
        }
      }
    }
    return { arcs: arcList, curves: curveList };
  }, [hubs, theme]);

  // Soft dot matrix point cloud for the sphere surface
  const surfacePoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const count = 320;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, [radius]);

  // Smooth, Calm, Self-driven Animation
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (masterGroup.current) {
      // Very slow, calm rotation that doesn't distract
      masterGroup.current.rotation.y = time * 0.05;
      masterGroup.current.rotation.x = Math.sin(time * 0.04) * 0.06 + 0.1;
      
      // Gentle, subtle breathing float
      masterGroup.current.position.y = Math.sin(time * 0.3) * 0.08 - 0.2;
    }

    if (outerGeodesic.current) {
      outerGeodesic.current.rotation.y = -time * 0.02;
    }

    if (ringsGroup.current) {
      ringsGroup.current.rotation.z = time * 0.03;
      ringsGroup.current.rotation.y = -time * 0.04;
    }
  });

  return (
    <group ref={masterGroup} position={[0, -0.2, 0]}>
      {/* 1. Deep Muted Holographic Core Sphere */}
      <mesh ref={innerSphere}>
        <sphereGeometry args={[radius * 0.98, 36, 36]} />
        <meshStandardMaterial
          color="#020617"
          emissive="#0a0f1d"
          emissiveIntensity={0.3}
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* 2. Soft Faint Geodesic Wireframe */}
      <mesh ref={outerGeodesic}>
        <icosahedronGeometry args={[radius * 1.04, 2]} />
        <meshStandardMaterial
          wireframe
          color={theme.secondary}
          transparent
          opacity={0.05}
        />
      </mesh>

      {/* 3. Surface Point Matrix */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(surfacePoints.flatMap((p) => [p.x, p.y, p.z])),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color={theme.secondary}
          transparent
          opacity={0.22}
          sizeAttenuation
        />
      </points>

      {/* 4. Muted Hub Beacons */}
      {hubs.map((hub) => (
        <group key={`hub-${hub.id}`} position={hub.pos}>
          <mesh>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial
              color={theme.primary}
              emissive={theme.primary}
              emissiveIntensity={0.8}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      ))}

      {/* 5. Subtle Muted Arcs */}
      {arcs.map((arc) => (
        <Line
          key={`arc-${arc.id}`}
          points={arc.points}
          color={arc.color}
          lineWidth={1.0}
          transparent
          opacity={0.2}
        />
      ))}

      {/* 6. Soft Glimmer Pulses */}
      {curves.map((c) => (
        <ArcPulse key={`pulse-${c.id}`} curve={c.curve} color={c.color} speed={c.speed} />
      ))}

      {/* 7. Subtle Orbiting Satellites */}
      <OrbitingSatellite radius={radius * 1.22} speed={0.2} inclination={Math.PI / 4} color={theme.primary} offset={0} />
      <OrbitingSatellite radius={radius * 1.3} speed={0.16} inclination={-Math.PI / 3} color={theme.secondary} offset={Math.PI} />

      {/* 8. Faint Orbital Ring */}
      <group ref={ringsGroup}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[radius * 1.35, radius * 1.354, 64]} />
          <meshBasicMaterial
            color={theme.primary}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}
