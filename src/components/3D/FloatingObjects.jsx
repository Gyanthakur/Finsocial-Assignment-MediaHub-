// // 'use client';

// // import { useRef, useEffect } from 'react';
// // import { useFrame } from '@react-three/fiber';
// // import { Mesh } from 'three';

// // export default function FloatingObjects() {
// //   const sphere1 = useRef(null);
// //   const sphere2 = useRef(null);
// //   const cube = useRef(null);

// //   useFrame(() => {
// //     if (sphere1.current) {
// //       sphere1.current.rotation.x += 0.001;
// //       sphere1.current.rotation.y += 0.003;
// //       sphere1.current.position.y = Math.sin(Date.now() * 0.0003) * 2;
// //     }

// //     if (sphere2.current) {
// //       sphere2.current.rotation.x -= 0.002;
// //       sphere2.current.rotation.z += 0.002;
// //       sphere2.current.position.y = Math.cos(Date.now() * 0.0002) * 2.5;
// //     }

// //     if (cube.current) {
// //       cube.current.rotation.x += 0.001;
// //       cube.current.rotation.y += 0.002;
// //       cube.current.position.x = Math.sin(Date.now() * 0.0002) * 3;
// //     }
// //   });

// //   return (
// //     <>
// //       <mesh ref={sphere1} position={[-5, 0, -10]}>
// //         <sphereGeometry args={[1.5, 32, 32]} />
// //         <meshStandardMaterial color="#3b82f6" wireframe />
// //       </mesh>

// //       <mesh ref={sphere2} position={[5, 2, -15]}>
// //         <sphereGeometry args={[1, 32, 32]} />
// //         <meshStandardMaterial color="#8b5cf6" wireframe />
// //       </mesh>

// //       <mesh ref={cube} position={[0, -2, -20]}>
// //         <boxGeometry args={[2, 2, 2]} />
// //         <meshStandardMaterial color="#ec4899" wireframe />
// //       </mesh>
// //     </>
// //   );
// // }


// 'use client';

// import { useRef, useEffect } from 'react';
// import { useFrame } from '@react-three/fiber';
// import { Mesh } from 'three';

// function FloatingObject({ position, rotation, scale, color, geometry: GeometryComponent }) {
//   const meshRef = useRef(null);

//   useFrame(({ clock }) => {
//     if (!meshRef.current) return;

//     const time = clock.getElapsedTime();
//     meshRef.current.rotation.x += 0.001;
//     meshRef.current.rotation.y += 0.002;
//     meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 2;
//     meshRef.current.position.x = position[0] + Math.cos(time * 0.3) * 1.5;
//   });

//   return (
//     <mesh ref={meshRef} position={position} scale={scale} rotation={rotation}>
//       <GeometryComponent />
//       <meshStandardMaterial
//         color={color}
//         wireframe={true}
//         emissive={color}
//         emissiveIntensity={0.2}
//       />
//     </mesh>
//   );
// }

// export default function FloatingObjects() {
//   return (
//     <>
//       {/* Floating Spheres */}
//       <FloatingObject
//         position={[-8, 5, -20]}
//         scale={2}
//         color="#3b82f6"
//         geometry={({ ...props }) => <sphereGeometry args={[1, 32, 32]} {...props} />}
//       />

//       <FloatingObject
//         position={[8, -3, -15]}
//         scale={1.5}
//         color="#8b5cf6"
//         geometry={({ ...props }) => <sphereGeometry args={[1, 32, 32]} {...props} />}
//       />

//       {/* Floating Cubes */}
//       <FloatingObject
//         position={[0, 2, -25]}
//         scale={1.8}
//         color="#ec4899"
//         geometry={({ ...props }) => <boxGeometry args={[1, 1, 1]} {...props} />}
//       />

//       <FloatingObject
//         position={[-6, -5, -18]}
//         scale={1.2}
//         color="#06b6d4"
//         geometry={({ ...props }) => <boxGeometry args={[1, 1, 1]} {...props} />}
//       />

//       {/* Floating Icosahedrons */}
//       <FloatingObject
//         position={[6, 0, -22]}
//         scale={1.5}
//         color="#f59e0b"
//         geometry={({ ...props }) => <icosahedronGeometry args={[1, 4]} {...props} />}
//       />

//       {/* Center Torus */}
//       <Torus />
//     </>
//   );
// }

// function Torus() {
//   const meshRef = useRef(null);

//   useFrame(({ clock }) => {
//     if (!meshRef.current) return;
//     meshRef.current.rotation.x += 0.005;
//     meshRef.current.rotation.z += 0.003;
//   });

//   return (
//     <mesh ref={meshRef} position={[0, 0, -15]}>
//       <torusGeometry args={[3, 1, 64, 100]} />
//       <meshStandardMaterial
//         color="#10b981"
//         wireframe={true}
//         emissive="#10b981"
//         emissiveIntensity={0.3}
//       />
//     </mesh>
//   );
// }


import FloatingMesh from './FloatingMesh';

export default function FloatingObjects() {
  return (
    <>
      <FloatingMesh position={[-2, 1, -1]} color="#3b82f6" />
      <FloatingMesh position={[2, -1, 0]} color="#6366f1" />
      <FloatingMesh position={[0, 2, -2]} color="#22c55e" />
      <FloatingMesh position={[-1.5, -2, -1]} color="#ec4899" />
    </>
  );
}
