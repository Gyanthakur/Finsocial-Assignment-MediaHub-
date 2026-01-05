import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function FloatingMesh({ position, color }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Rotation
    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.4;

    // Floating motion
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        metalness={0.6}
        roughness={0.3}
      />
    </mesh>
  );
}
