// 'use client';

// import { Canvas } from '@react-three/fiber';
// import { motion } from 'framer-motion';
// import FloatingObjects from './FloatingObjects';

// export default function AnimatedBackground() {
//   return (
//     <div className="fixed inset-0 w-full h-full -z-10">
//       <Canvas 
//         className="w-full h-full"
//         dpr={[1, 2]}
//         performance={{ current: 1 }}
//       >
//         <FloatingObjects />
//         <ambientLight intensity={0.5} />
//         <pointLight position={[10, 10, 10]} intensity={0.8} />
//       </Canvas>
//     </div>
//   );
// }

'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import FloatingObjects from './FloatingObjects';
import Lights from './Lights';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Lights />
          <FloatingObjects />
        </Suspense>
      </Canvas>
    </div>
  );
}
