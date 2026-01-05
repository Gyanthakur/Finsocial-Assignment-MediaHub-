// 'use client';

// import { motion } from 'framer-motion';
// import { useAuth } from '@/src/hooks/useAuth';
// // import PostFeed from '@/components/Posts/PostFeed';
// import PostFeed from '@/src/components/Posts/PostFeed';
// import Link from 'next/link';
// import { Plus } from 'lucide-react';

// export default function UserDashboard() {
//   const { user } = useAuth();

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="space-y-8"
//     >
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-4xl font-bold text-white">Welcome back, {user?.name}!</h1>
//           <p className="text-gray-400 mt-2">Discover amazing content from creators</p>
//         </div>

//         <Link href="/create-post">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
//           >
//             <Plus className="w-5 h-5" />
//             Create Post
//           </motion.button>
//         </Link>
//       </div>

//       <PostFeed />
//     </motion.div>
//   );
// }


'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import PostFeed from '@/src/components/Posts/PostFeed';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import * as THREE from 'three';

export default function UserDashboard() {
  const { user } = useAuth();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let animationId;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      velocities[i] = (Math.random() - 0.5) * 0.015;
      velocities[i + 1] = (Math.random() - 0.5) * 0.015;
      velocities[i + 2] = (Math.random() - 0.5) * 0.015;

      // Blue to purple gradient
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        colors[i] = 0.3 + Math.random() * 0.3;
        colors[i + 1] = 0.5 + Math.random() * 0.3;
        colors[i + 2] = 0.95;
      } else {
        colors[i] = 0.6 + Math.random() * 0.3;
        colors[i + 1] = 0.3 + Math.random() * 0.3;
        colors[i + 2] = 0.95;
      }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Create glowing spheres
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const spheres = [];

    for (let i = 0; i < 5; i++) {
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(`hsl(${220 + i * 20}, 70%, 60%)`),
        transparent: true,
        opacity: 0.3
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
      );
      spheres.push(sphere);
      scene.add(sphere);
    }

    // Create connecting lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4080ff,
      transparent: true,
      opacity: 0.2
    });
    
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate particles
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;

      // Animate particles with flow
      const particlePositions = particlesGeometry.attributes.position.array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] += velocities[i];
        particlePositions[i + 1] += velocities[i + 1];
        particlePositions[i + 2] += velocities[i + 2];

        // Boundary check
        if (Math.abs(particlePositions[i]) > 10) velocities[i] *= -1;
        if (Math.abs(particlePositions[i + 1]) > 10) velocities[i + 1] *= -1;
        if (Math.abs(particlePositions[i + 2]) > 10) velocities[i + 2] *= -1;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // Animate spheres
      spheres.forEach((sphere, i) => {
        sphere.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
      });

      // Mouse interaction with camera
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Update connecting lines
      let lineIndex = 0;

      for (let i = 0; i < particleCount; i++) {
        const x1 = particlePositions[i * 3];
        const y1 = particlePositions[i * 3 + 1];
        const z1 = particlePositions[i * 3 + 2];

        for (let j = i + 1; j < particleCount; j++) {
          const x2 = particlePositions[j * 3];
          const y2 = particlePositions[j * 3 + 1];
          const z2 = particlePositions[j * 3 + 2];

          const distance = Math.sqrt(
            Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)
          );

          if (distance < 2 && lineIndex < particleCount * 6) {
            linePositions[lineIndex++] = x1;
            linePositions[lineIndex++] = y1;
            linePositions[lineIndex++] = z1;
            linePositions[lineIndex++] = x2;
            linePositions[lineIndex++] = y2;
            linePositions[lineIndex++] = z2;
          }
        }
      }

      lines.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationId) cancelAnimationFrame(animationId);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      sphereGeometry.dispose();
      spheres.forEach(sphere => sphere.material.dispose());
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Three.js Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Content */}
      <div className="relative z-10 space-y-8 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-300 mt-2">Discover amazing content from creators</p>
          </div>

          <Link href="/create-post">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-blue-500/25">
              <Plus className="w-5 h-5" />
              Create Post
            </button>
          </Link>
        </div>

        <div className="backdrop-blur-sm bg-slate-900/30 rounded-xl p-1 border border-slate-700/50">
          <PostFeed />
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}