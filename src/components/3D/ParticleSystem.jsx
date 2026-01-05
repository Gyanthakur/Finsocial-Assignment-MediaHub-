import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import Particle from './Particle';

export default function ParticleSystem() {
  const groupRef = useRef();

  useFrame(({ mouse }) => {
    if (!groupRef.current) return;

    // GLOBAL cursor follow (ease-in-out)
    groupRef.current.position.x += (mouse.x * 5 - groupRef.current.position.x) * 0.08;
    groupRef.current.position.y += (mouse.y * 3 - groupRef.current.position.y) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 120 }).map((_, i) => (
        <Particle key={i} />
      ))}
    </group>
  );
}
