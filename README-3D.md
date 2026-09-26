# 3D Website Transformation

## Overview
This project has been upgraded with a professional, motion-rich 3D visual layer using Three.js and Framer Motion. The original Next.js architecture, routing, and data flow remain completely intact. The 3D scene sits purely on the visual layer behind the existing components.

## Libraries Installed
The following libraries were added to enable the 3D scene and animations:
- `three` & `@types/three`: Core 3D engine.
- `@react-three/fiber`: React wrapper for Three.js.
- `@react-three/drei`: Useful helpers and abstractions for React Three Fiber (like `PerspectiveCamera`, `Float`, `Stars`, `Line`).
- `@react-three/postprocessing` & `postprocessing`: Enables post-processing effects like Bloom.
- `gsap`: Used for scroll-linked animations (via `ScrollTrigger`).
- `framer-motion`: Used for DOM-level entry animations (`whileInView`).

**To install manually, run:**
```bash
npm install three @types/three @react-three/fiber @react-three/drei gsap framer-motion @react-three/postprocessing postprocessing --legacy-peer-deps
```

## Architecture
1. **`src/components/three/CanvasContainer.tsx`**
   - Wrapper for the 3D `<Canvas>`.
   - Uses `next/dynamic` (`ssr: false`) to ensure the canvas only renders on the client side, avoiding hydration mismatches and unblocking the initial HTML render.
   - Includes a fallback `<Suspense>` loader.
2. **`src/components/three/Scene.tsx`**
   - The main R3F context.
   - Contains lighting setups (AmbientLight, SpotLight).
   - Handles the custom `CameraRig` which gently lerps its position based on the mouse pointer for a subtle parallax effect.
   - Checks device capability (`navigator.hardwareConcurrency` and viewport width) to conditionally disable heavy effects (`Stars` and `Bloom`) for better mobile performance.
3. **`src/components/three/LogisticsGlobe.tsx`**
   - The interactive 3D Holographic Logistics Mesh representing global and local urban routing.
   - Generates 3D parabolic curved route trajectories (Cubic Bezier curves) with animated light packet pulses.
   - Features a dot-matrix point cloud surface, pulsing city hub beacons (Kharghar, Vashi, Nerul, Belapur, Sanpada), and concentric orbital gyroscope rings.
   - Dynamically adapts route colors based on the active role (`/seller`, `/rider`, `/admin`).
   - Integrated with GSAP `ScrollTrigger` for smooth scroll-driven perspective elevation.

## How to Customize or Add Custom Models (.glb)
Currently, the scene uses lightweight 3D primitives to ensure fast loading times. If you wish to replace the abstract network graph with a custom 3D model (e.g. a delivery truck or custom branded asset):

1. Place your `.glb` or `.gltf` model into the `public/` folder.
2. Generate a declarative React component from your model using [`gltfjsx`](https://github.com/pmndrs/gltfjsx):
   ```bash
   npx gltfjsx public/your-model.glb -t
   ```
3. Import the generated component into `Scene.tsx` and place it inside the `<Canvas>`.
   ```tsx
   import YourModel from "./YourModel"
   // inside <Canvas> ...
   <Float speed={2} rotationIntensity={0.5}>
     <YourModel scale={1.5} position={[0, -2, 0]} />
   </Float>
   ```

## Design Decisions & Performance
- **Non-blocking Render:** The 3D canvas is dynamically imported and visually layered underneath the content with CSS (`fixed inset-0 z-0`, `pointer-events-none`).
- **Scroll Sync:** A GSAP `ScrollTrigger` hooks into body scroll to drive 3D scene properties seamlessly without overriding the browser's native scroll behavior.
- **Glassmorphism:** The existing solid background colors (`bg-white` and `bg-slate-50`) on the page sections were updated to be translucent (`bg-white/70`, `backdrop-blur-md`) so the 3D environment is visible in the background.
- **Accessibility:** Motion respects native browser optimizations and framer-motion defaults.
