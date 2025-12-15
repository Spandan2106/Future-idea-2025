import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useRef, useEffect } from 'react';
import { ParticleSystem } from './ParticleSystem';
import { Starfield } from './Starfield';
import { ShapeName } from '@/hooks/useParticleGeometry';
import * as THREE from 'three';

interface HologramSceneProps {
  currentShape: ShapeName;
  colorScheme: string;
  isSpinning: boolean;
  rotationAxis: 'x' | 'y';
  rotationSpeed: number;
  isVortex: boolean;
  isAttract: boolean;
  isRepel: boolean;
  isExploded: boolean;
  isCompressed: boolean;
  particleSize: number;
  isOrbiting: boolean;
  cameraDistance: number;
}

export const HologramScene = (props: HologramSceneProps) => {
  return (
    <div className="absolute inset-0">
      <Canvas
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <PerspectiveCamera
            makeDefault
            position={[0, 0, props.cameraDistance]}
            fov={75}
            near={0.1}
            far={2000}
          />
          <ambientLight intensity={0.1} />
          <Starfield />
          <ParticleSystem {...props} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            autoRotate={props.isOrbiting}
            autoRotateSpeed={0.5}
            minDistance={60}
            maxDistance={250}
          />
        </Suspense>
      </Canvas>
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />
      
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)'
      }} />
    </div>
  );
};
