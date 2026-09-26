"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Line, Sphere, Trail } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Interactive moving carrier packet between nodes
function MovingPacket({ start, end, color = "#60a5fa", speed = 1 }: { start: THREE.Vector3; end: THREE.Vector3; color?: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(Math.random());

  useFrame((_, delta) => {
    progressRef.current = (progressRef.current + delta * 0.4 * speed) % 1;
    if (meshRef.current) {
      meshRef.current.position.lerpVectors(start, end, progressRef.current);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export function NetworkGraph() {
  const group = useRef<THREE.Group>(null);
  const pathname = usePathname() || "/";
  
  // Theme customization based on active route
  const theme = useMemo(() => {
    if (pathname.startsWith("/rider")) {
      return {
        accent: "#f59e0b", // Amber
        secondary: "#fbbf24",
        nodeCount: 18,
        radius: 7,
        wireColor: "#f59e0b",
        wireOpacity: 0.18,
      };
    }
    if (pathname.startsWith("/admin")) {
      return {
        accent: "#8b5cf6", // Purple
        secondary: "#06b6d4",
        nodeCount: 28,
        radius: 9,
        wireColor: "#6366f1",
        wireOpacity: 0.22,
      };
    }
    if (pathname.startsWith("/seller")) {
      return {
        accent: "#3b82f6", // Blue
        secondary: "#10b981",
        nodeCount: 20,
        radius: 8,
        wireColor: "#3b82f6",
        wireOpacity: 0.18,
      };
    }
    // Landing page default
    return {
      accent: "#3b82f6",
      secondary: "#10b981",
      nodeCount: 24,
      radius: 8.5,
      wireColor: "#3b82f6",
      wireOpacity: 0.2,
    };
  }, [pathname]);

  // Scroll progress proxy for GSAP ScrollTrigger
  const scrollProgress = useRef({ value: 0 });

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => {
        scrollProgress.current.value = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
  }, [pathname]);

  // Generate node positions and clusters
  const nodes = useMemo(() => {
    return Array.from({ length: theme.nodeCount }).map((_, i) => {
      const angle = (i / theme.nodeCount) * Math.PI * 2;
      const r = (Math.random() * 0.5 + 0.5) * theme.radius;
      const position = new THREE.Vector3(
        Math.cos(angle) * r + (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * theme.radius * 0.9,
        Math.sin(angle) * r * 0.8 + (Math.random() - 0.5) * 2
      );

      const type = i % 4 === 0 ? "hub" : i % 3 === 0 ? "vehicle" : i % 2 === 0 ? "package" : "destination";
      return { position, type, id: i };
    });
  }, [theme]);

  // Generate network connection lines
  const { lines, pairs } = useMemo(() => {
    const lineList: [THREE.Vector3, THREE.Vector3][] = [];
    const pairList: { start: THREE.Vector3; end: THREE.Vector3; color: string }[] = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < theme.radius * 0.85) {
          lineList.push([nodes[i].position, nodes[j].position]);
          if (pairList.length < 8 && Math.random() > 0.4) {
            pairList.push({
              start: nodes[i].position,
              end: nodes[j].position,
              color: i % 2 === 0 ? theme.accent : theme.secondary,
            });
          }
        }
      }
    }
    return { lines: lineList, pairs: pairList };
  }, [nodes, theme]);

  // Continuous subtle 3D animation loop
  useFrame((state) => {
    if (group.current) {
      const idleTime = state.clock.elapsedTime * 0.04;
      const scrollVal = scrollProgress.current.value;

      group.current.rotation.y = idleTime + scrollVal * Math.PI * 1.5;
      group.current.rotation.x = Math.sin(idleTime * 0.8) * 0.08 + scrollVal * 0.3;
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -scrollVal * 4, 0.08);
    }
  });

  return (
    <group ref={group}>
      {/* Route lines */}
      {lines.map((line, idx) => (
        <Line
          key={`route-line-${idx}`}
          points={line}
          color={theme.wireColor}
          lineWidth={1.2}
          transparent
          opacity={theme.wireOpacity}
        />
      ))}

      {/* Moving packets traveling along lines */}
      {pairs.map((p, idx) => (
        <MovingPacket key={`packet-${idx}`} start={p.start} end={p.end} color={p.color} speed={1 + (idx % 3) * 0.3} />
      ))}

      {/* Interactive geometric network nodes */}
      {nodes.map((node) => (
        <Float
          key={`node-${node.id}`}
          speed={1.5 + (node.id % 3) * 0.5}
          rotationIntensity={0.6}
          floatIntensity={0.8}
          position={node.position}
        >
          <mesh>
            {node.type === "hub" ? (
              // Central hubs (Hexahedron / Box)
              <boxGeometry args={[0.38, 0.38, 0.38]} />
            ) : node.type === "vehicle" ? (
              // Vehicles / Riders (Octahedron)
              <octahedronGeometry args={[0.26]} />
            ) : node.type === "package" ? (
              // Packages (Rounded box simulation / Dodecahedron)
              <dodecahedronGeometry args={[0.2]} />
            ) : (
              // Customer destinations (Sphere)
              <sphereGeometry args={[0.16, 16, 16]} />
            )}
            <meshStandardMaterial
              color={
                node.type === "hub"
                  ? theme.accent
                  : node.type === "vehicle"
                  ? "#f59e0b"
                  : node.type === "package"
                  ? "#10b981"
                  : "#8b5cf6"
              }
              emissive={
                node.type === "hub"
                  ? theme.accent
                  : node.type === "vehicle"
                  ? "#f59e0b"
                  : node.type === "package"
                  ? "#10b981"
                  : "#8b5cf6"
              }
              emissiveIntensity={0.7}
              roughness={0.15}
              metalness={0.85}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}
