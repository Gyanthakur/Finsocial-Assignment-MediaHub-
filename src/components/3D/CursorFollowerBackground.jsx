'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import ParticleSystem from './ParticleSystem';

export default function CursorFollowerBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <ParticleSystem />
        </Suspense>
      </Canvas>
    </div>
  );
}
