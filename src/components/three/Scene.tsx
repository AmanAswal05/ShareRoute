/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { LogisticsGlobe } from "./LogisticsGlobe";

// Ultra-gentle, non-distracting camera rig
function CameraRig() {
  const cameraGroup = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useFrame((state) => {
    if (cameraGroup.current && !isMobile) {
      // Extremely subtle, smooth interpolation
      cameraGroup.current.position.x = THREE.MathUtils.lerp(
        cameraGroup.current.position.x,
        (state.pointer.x * state.viewport.width) / 28,
        0.02
      );
      cameraGroup.current.position.y = THREE.MathUtils.lerp(
        cameraGroup.current.position.y,
        (state.pointer.y * state.viewport.height) / 28,
        0.02
      );
      cameraGroup.current.lookAt(0, -0.2, 0);
    }
  });

  return (
    <group ref={cameraGroup}>
      <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 15 : 12]} fov={45} />
    </group>
  );
}

export default function Scene() {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    if (
      window.innerWidth < 768 ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
    ) {
      setIsLowEnd(true);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden opacity-45 dark:opacity-40">
      <Canvas
        dpr={isLowEnd ? 1 : [1, 2]}
        gl={{
          antialias: !isLowEnd,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop="always"
      >
        {/* Soft, low-contrast ambient studio lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[8, 8, 6]} intensity={0.6} />
        <directionalLight position={[-8, -8, -4]} intensity={0.3} color="#3b82f6" />

        <CameraRig />

        {/* Subtle 3D Holographic Logistics Core */}
        <LogisticsGlobe />

        {/* Faint distant star dust */}
        {!isLowEnd && (
          <Stars
            radius={40}
            depth={40}
            count={400}
            factor={2}
            saturation={0}
            fade
            speed={0.2}
          />
        )}

        {/* Minimal soft bloom */}
        {!isLowEnd && (
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.8}
              mipmapBlur
              intensity={0.25}
              radius={0.5}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
