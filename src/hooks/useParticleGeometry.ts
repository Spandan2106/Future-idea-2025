import { useMemo } from 'react';

const PARTICLE_COUNT = 6000;

export type ShapeName = 
  | 'sphere' | 'cube' | 'heart' | 'saturn' | 'dna' 
  | 'pyramid' | 'flower' | 'galaxy' | 'tree' | 'cyclone' 
  | 'cycloid' | 'blackhole';

export const useParticleGeometry = () => {
  const shapes = useMemo(() => {
    const spherePos: number[] = [];
    const cubePos: number[] = [];
    const heartPos: number[] = [];
    const saturnPos: number[] = [];
    const dnaPos: number[] = [];
    const pyramidPos: number[] = [];
    const flowerPos: number[] = [];
    const galaxyPos: number[] = [];
    const treePos: number[] = [];
    const cyclonePos: number[] = [];
    const cycloidPos: number[] = [];
    const blackholePos: number[] = [];

    // Sphere
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
      const r = 45;
      spherePos.push(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi)
      );
    }

    // Cube
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const side = 70;
      cubePos.push(
        (Math.random() - 0.5) * side,
        (Math.random() - 0.5) * side,
        (Math.random() - 0.5) * side
      );
    }

    // Heart
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = Math.random() * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const z = (Math.random() - 0.5) * 15;
      heartPos.push(x * 3, y * 3, z * 3);
    }

    // Saturn
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let x: number, y: number, z: number;
      if (i < PARTICLE_COUNT * 0.35) {
        const phi = Math.acos(-1 + (2 * i) / (PARTICLE_COUNT * 0.35));
        const theta = Math.sqrt((PARTICLE_COUNT * 0.35) * Math.PI) * phi;
        const r = 30;
        x = r * Math.cos(theta) * Math.sin(phi);
        y = r * Math.sin(theta) * Math.sin(phi);
        z = r * Math.cos(phi);
      } else {
        const angle = Math.random() * Math.PI * 2;
        const dist = 45 + Math.random() * 30;
        x = dist * Math.cos(angle);
        y = (Math.random() - 0.5) * 1;
        z = dist * Math.sin(angle);
      }
      const tilt = 30 * (Math.PI / 180);
      saturnPos.push(x, y * Math.cos(tilt) - z * Math.sin(tilt), y * Math.sin(tilt) + z * Math.cos(tilt));
    }

    // DNA
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const turns = 4;
      const height = 120;
      const radius = 25;
      const yPos = (i / PARTICLE_COUNT) * height - (height / 2);
      const angle = (yPos / height) * Math.PI * 2 * turns;
      let x: number, z: number;
      const type = i % 10;
      if (type < 4) {
        x = radius * Math.cos(angle);
        z = radius * Math.sin(angle);
      } else if (type < 8) {
        x = radius * Math.cos(angle + Math.PI);
        z = radius * Math.sin(angle + Math.PI);
      } else {
        const rungInterval = Math.floor(i / 100) % 2 === 0;
        if (rungInterval) {
          const t = Math.random();
          const x1 = radius * Math.cos(angle);
          const z1 = radius * Math.sin(angle);
          const x2 = radius * Math.cos(angle + Math.PI);
          const z2 = radius * Math.sin(angle + Math.PI);
          x = x1 + (x2 - x1) * t;
          z = z1 + (z2 - z1) * t;
        } else {
          x = radius * Math.cos(angle);
          z = radius * Math.sin(angle);
        }
      }
      dnaPos.push(x, yPos, z);
    }

    // Pyramid
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const h = Math.random() * 70;
      const scale = ((70 - h) / 70) * 40;
      pyramidPos.push(
        (Math.random() - 0.5) * 2 * scale,
        h - 35,
        (Math.random() - 0.5) * 2 * scale
      );
    }

    // Flower
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 10 + 35 * Math.abs(Math.cos(5 * theta * 0.5));
      flowerPos.push(
        r * Math.cos(theta),
        r * Math.sin(theta),
        (Math.random() - 0.5) * 10
      );
    }

    // Galaxy
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = i * 0.1;
      const r = i * 0.015;
      galaxyPos.push(
        r * Math.cos(angle),
        (Math.random() - 0.5) * 5,
        r * Math.sin(angle)
      );
    }

    // Tree
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let x: number, y: number, z: number;
      if (i < PARTICLE_COUNT * 0.2) {
        x = (Math.random() - 0.5) * 8;
        y = (Math.random() - 0.5) * 80;
        z = (Math.random() - 0.5) * 8;
      } else {
        const phi = Math.acos(-1 + (2 * (i - PARTICLE_COUNT * 0.2)) / (PARTICLE_COUNT * 0.8));
        const theta = Math.sqrt((PARTICLE_COUNT * 0.8) * Math.PI) * phi;
        const r = 40;
        x = r * Math.cos(theta) * Math.sin(phi);
        y = r * Math.cos(phi) + 40;
        z = r * Math.sin(theta) * Math.sin(phi);
      }
      treePos.push(x, y, z);
    }

    // Cyclone
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const height = Math.random() * 150;
      const angle = Math.random() * Math.PI * 10;
      const radius = (height / 150) * 60 + Math.random() * 10;
      cyclonePos.push(
        radius * Math.cos(angle),
        height - 75,
        radius * Math.sin(angle)
      );
    }

    // Cycloid
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 20;
      const theta = Math.random() * Math.PI * 8;
      cycloidPos.push(
        radius * (theta - Math.sin(theta)) - 100,
        radius * (1 - Math.cos(theta)) - 20,
        (Math.random() - 0.5) * 15
      );
    }

    // Blackhole
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 1.5) * 100;
      blackholePos.push(
        radius * Math.cos(angle),
        (Math.random() - 0.5) * 6,
        radius * Math.sin(angle)
      );
    }

    return {
      sphere: new Float32Array(spherePos),
      cube: new Float32Array(cubePos),
      heart: new Float32Array(heartPos),
      saturn: new Float32Array(saturnPos),
      dna: new Float32Array(dnaPos),
      pyramid: new Float32Array(pyramidPos),
      flower: new Float32Array(flowerPos),
      galaxy: new Float32Array(galaxyPos),
      tree: new Float32Array(treePos),
      cyclone: new Float32Array(cyclonePos),
      cycloid: new Float32Array(cycloidPos),
      blackhole: new Float32Array(blackholePos),
    };
  }, []);

  const generateExplosion = (): Float32Array => {
    const positions: number[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions.push(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400
      );
    }
    return new Float32Array(positions);
  };

  const generateCompression = (): Float32Array => {
    return new Float32Array(PARTICLE_COUNT * 3).fill(0);
  };

  return { shapes, generateExplosion, generateCompression, particleCount: PARTICLE_COUNT };
};
