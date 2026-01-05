'use client';

import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function RotatingCamera() {
  const cameraRef = useRef(null);

  useFrame(({ clock }) => {
    if (!cameraRef.current) return;
    const time = clock.getElapsedTime();
    cameraRef.current.position.x = Math.sin(time * 0.3) * 20;
    cameraRef.current.position.z = Math.cos(time * 0.3) * 20;
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 20]} />;
}

export default function Scene() {
  return (
    <div className="w-full h-screen">
      <Canvas>
        <RotatingCamera />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
      </Canvas>
    </div>
  );
}