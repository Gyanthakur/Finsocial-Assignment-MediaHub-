import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Particle() {
  const mesh = useRef();

  const basePosition = [
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 6,
    (Math.random() - 0.5) * 5,
  ];

  useFrame(({ clock }) => {
    if (!mesh.current) return;

    const t = clock.elapsedTime;

    // subtle floating only
    mesh.current.position.y =
      basePosition[1] + Math.sin(t + basePosition[0]) * 2.3;

    mesh.current.rotation.x += 0.002;
    mesh.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={mesh} position={basePosition}>
      <sphereGeometry args={[0.07, 16, 16]} />
      <meshStandardMaterial
        color="#93c5fd"
        emissive="#3b82f6"
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}
