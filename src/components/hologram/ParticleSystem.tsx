import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { ShapeName, useParticleGeometry } from '@/hooks/useParticleGeometry';

interface ParticleSystemProps {
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
}

const colorSchemes: Record<string, THREE.Color> = {
  neon: new THREE.Color(0x00ffcc),
  space: new THREE.Color(0x4a90e2),
  red: new THREE.Color(0xff3366),
  green: new THREE.Color(0x00ff88),
  blue: new THREE.Color(0x0088ff),
  gold: new THREE.Color(0xffd700),
  violet: new THREE.Color(0x8a2be2),
  magenta: new THREE.Color(0xff00ff),
};

export const ParticleSystem = ({
  currentShape,
  colorScheme,
  isSpinning,
  rotationAxis,
  rotationSpeed,
  isVortex,
  isAttract,
  isRepel,
  isExploded,
  isCompressed,
  particleSize,
}: ParticleSystemProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { shapes, generateExplosion, generateCompression, particleCount } = useParticleGeometry();
  
  const prevShapeRef = useRef<ShapeName>(currentShape);
  const prevExplodedRef = useRef(isExploded);
  const prevCompressedRef = useRef(isCompressed);
  const activePositionsRef = useRef<Float32Array>(shapes[currentShape]);

  const { geometry, initialColors } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(shapes.sphere);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const colors = new Float32Array(particleCount * 3);
    const baseColor = colorSchemes.neon;
    for (let i = 0; i < particleCount; i++) {
      colors[i * 3] = baseColor.r;
      colors[i * 3 + 1] = baseColor.g;
      colors[i * 3 + 2] = baseColor.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return { geometry: geo, initialColors: colors };
  }, [shapes, particleCount]);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Handle shape morphing
  useEffect(() => {
    if (!pointsRef.current) return;
    
    let targetPositions: Float32Array;
    
    if (isExploded && !prevExplodedRef.current) {
      targetPositions = generateExplosion();
    } else if (isCompressed && !prevCompressedRef.current) {
      targetPositions = generateCompression();
    } else if (currentShape !== prevShapeRef.current || (!isExploded && prevExplodedRef.current) || (!isCompressed && prevCompressedRef.current)) {
      targetPositions = shapes[currentShape];
      activePositionsRef.current = shapes[currentShape];
    } else {
      return;
    }

    prevShapeRef.current = currentShape;
    prevExplodedRef.current = isExploded;
    prevCompressedRef.current = isCompressed;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const startPositions = Float32Array.from(positions);

    const tween = { value: 0 };
    new TWEEN.Tween(tween)
      .to({ value: 1 }, 1200)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(() => {
        for (let i = 0; i < particleCount * 3; i++) {
          positions[i] = startPositions[i] + (targetPositions[i] - startPositions[i]) * tween.value;
        }
        pointsRef.current!.geometry.attributes.position.needsUpdate = true;
      })
      .start();
  }, [currentShape, isExploded, isCompressed, shapes, generateExplosion, generateCompression, particleCount]);

  // Handle color changes
  useEffect(() => {
    if (!pointsRef.current) return;
    
    const colors = pointsRef.current.geometry.attributes.color.array as Float32Array;
    const baseColor = colorSchemes[colorScheme] || colorSchemes.neon;

    for (let i = 0; i < particleCount; i++) {
      if (colorScheme === 'space') {
        const r = Math.random();
        let c: THREE.Color;
        if (r > 0.8) c = new THREE.Color(0x4a90e2);
        else if (r > 0.6) c = new THREE.Color(0xffd700);
        else if (r > 0.4) c = new THREE.Color(0xffffff);
        else c = new THREE.Color(0x888888);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      } else {
        colors[i * 3] = baseColor.r;
        colors[i * 3 + 1] = baseColor.g;
        colors[i * 3 + 2] = baseColor.b;
      }
    }
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
  }, [colorScheme, particleCount]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    TWEEN.update();

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Vortex effect
    if (isVortex) {
      const vortexSpeed = 0.02;
      const pullSpeed = 0.2;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];
        positions[i3] = x * Math.cos(vortexSpeed) - z * Math.sin(vortexSpeed) - x * 0.005 * pullSpeed;
        positions[i3 + 2] = x * Math.sin(vortexSpeed) + z * Math.cos(vortexSpeed) - z * 0.005 * pullSpeed;
        positions[i3 + 1] = y * 0.99;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Attract effect
    if (isAttract) {
      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] *= 0.98;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Repel effect
    if (isRepel) {
      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] *= 1.02;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Rotation
    if (isSpinning) {
      pointsRef.current.rotation[rotationAxis] += rotationSpeed;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={particleSize}
        map={texture}
        transparent
        opacity={0.95}
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};
