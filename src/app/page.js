

'use client';

// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { useAuth } from '@/src/hooks/useAuth';
// import { ArrowRight, Image, Video, Users, Zap, Shield } from 'lucide-react';
// import AnimatedBackground from '@/src/components/3D/AnimatedBackground';
// import CursorFollowerBackground from '../components/3D/CursorFollowerBackground';

// export default function HomePage() {
//   const { isAuthenticated, user } = useAuth();

//   const features = [
//     {
//       icon: Image,
//       title: 'Share Images',
//       description: 'Upload and share beautiful images with the community'
//     },
//     {
//       icon: Video,
//       title: 'Share Videos',
//       description: 'Stream your videos and engage with viewers'
//     },
//     {
//       icon: Users,
//       title: 'Community',
//       description: 'Connect with like-minded creators and viewers'
//     },
//     {
//       icon: Zap,
//       title: 'Fast & Reliable',
//       description: 'Lightning-fast performance with reliable uptime'
//     }
//   ];

//   return (
//     <>
//       <AnimatedBackground />
//       <CursorFollowerBackground/>

//       <main className="relative z-10 min-h-screen">
//         {/* Hero Section */}
//         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
//               Share Your Moments
//             </h1>
//             <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
//               Join our community of creators and share stunning images and videos with the world. Express yourself, inspire others, and grow your audience.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               {isAuthenticated ? (
//                 <>
//                   <Link href={user?.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/user'} className="inline-block">
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition"
//                     >
//                       Go to Dashboard <ArrowRight className="w-5 h-5" />
//                     </motion.button>
//                   </Link>

//                   {user?.role === 'ADMIN' && (
//                     <Link href="/dashboard/admin" className="inline-block">
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition"
//                       >
//                         <Shield className="w-5 h-5" />
//                         Admin Panel
//                       </motion.button>
//                     </Link>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <Link href="/signup" className="inline-block">
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition"
//                     >
//                       Get Started <ArrowRight className="w-5 h-5" />
//                     </motion.button>
//                   </Link>

//                   <Link href="/login" className="inline-block">
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="px-8 py-3 border border-blue-500 text-blue-400 rounded-lg font-semibold hover:bg-blue-500/10 transition"
//                     >
//                       Sign In
//                     </motion.button>
//                   </Link>

//                   <Link href="/login?admin=true" className="inline-block">
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="px-8 py-3 border border-red-500 text-red-400 rounded-lg font-semibold hover:bg-red-500/10 transition flex items-center gap-2"
//                     >
//                       <Shield className="w-4 h-4" />
//                       Admin Portal
//                     </motion.button>
//                   </Link>
//                 </>
//               )}
//             </div>
//           </motion.div>
//         </section>

//         {/* Features Section */}
//         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//           <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Us?</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {features.map((feature, idx) => (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: idx * 0.1 }}
//                 className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-blue-500 transition"
//               >
//                 <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
//                 <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
//                 <p className="text-gray-400 text-sm">{feature.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </section>

//         {/* Admin Portal Card */}
//         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg overflow-hidden border border-red-500/30"
//           >
//             <div className="px-8 py-12 text-center">
//               <Shield className="w-16 h-16 text-red-200 mx-auto mb-4 opacity-20" />
//               <h2 className="text-3xl font-bold text-white mb-4">Admin Portal</h2>
//               <p className="text-red-100 mb-8 max-w-2xl mx-auto">
//                 Platform administrators can manage users, moderate content, and view analytics.
//               </p>
//               {!isAuthenticated ? (
//                 <Link href="/login?admin=true">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-8 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition inline-flex items-center gap-2"
//                   >
//                     <Shield className="w-4 h-4" />
//                     Access Admin Portal
//                   </motion.button>
//                 </Link>
//               ) : user?.role === 'ADMIN' ? (
//                 <Link href="/dashboard/admin">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-8 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition inline-flex items-center gap-2"
//                   >
//                     <Shield className="w-4 h-4" />
//                     Go to Admin Panel
//                   </motion.button>
//                 </Link>
//               ) : null}
//             </div>
//           </motion.div>
//         </section>

//         {/* CTA Section */}
//         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//           >
//             <h2 className="text-3xl font-bold text-white mb-4">Ready to share your story?</h2>
//             <p className="text-gray-400 mb-8">Join thousands of creators today</p>
//             {!isAuthenticated && (
//               <Link href="/signup">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
//                 >
//                   Create Account
//                 </motion.button>
//               </Link>
//             )}
//           </motion.div>
//         </section>
//       </main>
//     </>
//   );
// }

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/hooks/useAuth';
import { ArrowRight, Image, Video, Users, Zap, Shield } from 'lucide-react';
import * as THREE from 'three';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const canvasRef = useRef(null);

  const features = [
    {
      icon: Image,
      title: 'Share Images',
      description: 'Upload and share beautiful images with the community'
    },
    {
      icon: Video,
      title: 'Share Videos',
      description: 'Stream your videos and engage with viewers'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with like-minded creators and viewers'
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Lightning-fast performance with reliable uptime'
    }
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.position.z = 5;

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 25;
      positions[i + 1] = (Math.random() - 0.5) * 25;
      positions[i + 2] = (Math.random() - 0.5) * 25;

      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;

      // Blue to purple to pink gradient
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i] = 0.3 + Math.random() * 0.3;
        colors[i + 1] = 0.5 + Math.random() * 0.3;
        colors[i + 2] = 0.9 + Math.random() * 0.1;
      } else if (colorChoice < 0.66) {
        colors[i] = 0.6 + Math.random() * 0.3;
        colors[i + 1] = 0.3 + Math.random() * 0.3;
        colors[i + 2] = 0.9 + Math.random() * 0.1;
      } else {
        colors[i] = 0.9 + Math.random() * 0.1;
        colors[i + 1] = 0.3 + Math.random() * 0.2;
        colors[i + 2] = 0.7 + Math.random() * 0.2;
      }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Create floating geometric shapes
    const shapes = [];
    const geometries = [
      new THREE.TetrahedronGeometry(0.5, 0),
      new THREE.OctahedronGeometry(0.4, 0),
      new THREE.IcosahedronGeometry(0.4, 0),
      new THREE.TorusGeometry(0.3, 0.1, 8, 16)
    ];

    for (let i = 0; i < 8; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(`hsl(${200 + i * 30}, 80%, 60%)`),
        transparent: true,
        opacity: 0.15,
        wireframe: true
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 8
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      shapes.push({
        mesh,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        }
      });
      scene.add(mesh);
    }

    // Create glowing spheres
    const sphereGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const spheres = [];

    for (let i = 0; i < 6; i++) {
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(`hsl(${220 + i * 25}, 80%, 65%)`),
        transparent: true,
        opacity: 0.25
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 6
      );
      spheres.push(sphere);
      scene.add(sphere);
    }

    // Create connecting lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x6080ff,
      transparent: true,
      opacity: 0.15
    });
    
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Rotate particles
      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0003;

      // Animate particles with flow
      const particlePositions = particlesGeometry.attributes.position.array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] += velocities[i];
        particlePositions[i + 1] += velocities[i + 1];
        particlePositions[i + 2] += velocities[i + 2];

        // Boundary check
        if (Math.abs(particlePositions[i]) > 12) velocities[i] *= -1;
        if (Math.abs(particlePositions[i + 1]) > 12) velocities[i + 1] *= -1;
        if (Math.abs(particlePositions[i + 2]) > 12) velocities[i + 2] *= -1;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // Animate geometric shapes
      shapes.forEach(shape => {
        shape.mesh.rotation.x += shape.rotationSpeed.x;
        shape.mesh.rotation.y += shape.rotationSpeed.y;
        shape.mesh.rotation.z += shape.rotationSpeed.z;
      });

      // Animate spheres
      spheres.forEach((sphere, i) => {
        sphere.position.y += Math.sin(Date.now() * 0.001 + i) * 0.003;
        sphere.position.x += Math.cos(Date.now() * 0.0008 + i) * 0.002;
        sphere.rotation.x += 0.005;
        sphere.rotation.y += 0.008;
      });

      // Camera follow mouse with smooth lerp
      camera.position.x += (targetX * 0.8 - camera.position.x) * 0.03;
      camera.position.y += (targetY * 0.8 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      // Update connecting lines
      let lineIndex = 0;
      for (let i = 0; i < Math.min(particleCount, 300); i++) {
        const x1 = particlePositions[i * 3];
        const y1 = particlePositions[i * 3 + 1];
        const z1 = particlePositions[i * 3 + 2];

        for (let j = i + 1; j < Math.min(particleCount, 300); j++) {
          const x2 = particlePositions[j * 3];
          const y2 = particlePositions[j * 3 + 1];
          const z2 = particlePositions[j * 3 + 2];

          const distance = Math.sqrt(
            Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)
          );

          if (distance < 2.5 && lineIndex < particleCount * 6) {
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
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      sphereGeometry.dispose();
      geometries.forEach(g => g.dispose());
      shapes.forEach(s => s.mesh.material.dispose());
      spheres.forEach(s => s.material.dispose());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      {/* Three.js Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      <main className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Share Your Moments
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our community of creators and share stunning images and videos with the world. Express yourself, inspire others, and grow your audience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link href={user?.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/user'} className="inline-block">
                    <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all duration-300 mx-auto sm:mx-0">
                      Go to Dashboard <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>

                  {user?.role === 'ADMIN' && (
                    <Link href="/dashboard/admin" className="inline-block">
                      <button className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all duration-300 mx-auto sm:mx-0">
                        <Shield className="w-5 h-5" />
                        Admin Panel
                      </button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link href="/signup" className="inline-block">
                    <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all duration-300 mx-auto sm:mx-0">
                      Get Started <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>

                  <Link href="/login" className="inline-block">
                    <button className="px-8 py-3 border border-blue-500 text-blue-400 rounded-lg font-semibold hover:bg-blue-500/10 hover:scale-105 transition-all duration-300">
                      Sign In
                    </button>
                  </Link>

                  <Link href="/login?admin=true" className="inline-block">
                    <button className="px-8 py-3 border border-red-500 text-red-400 rounded-lg font-semibold hover:bg-red-500/10 hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto sm:mx-0">
                      <Shield className="w-4 h-4" />
                      Admin Portal
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-lg hover:border-blue-500 transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Admin Portal Card */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg overflow-hidden border border-red-500/30 animate-fade-in backdrop-blur-sm">
            <div className="px-8 py-12 text-center">
              <Shield className="w-16 h-16 text-red-200 mx-auto mb-4 opacity-20" />
              <h2 className="text-3xl font-bold text-white mb-4">Admin Portal</h2>
              <p className="text-red-100 mb-8 max-w-2xl mx-auto">
                Platform administrators can manage users, moderate content, and view analytics.
              </p>
              {!isAuthenticated ? (
                <Link href="/login?admin=true">
                  <button className="px-8 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Access Admin Portal
                  </button>
                </Link>
              ) : user?.role === 'ADMIN' ? (
                <Link href="/dashboard/admin">
                  <button className="px-8 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Go to Admin Panel
                  </button>
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to share your story?</h2>
            <p className="text-gray-400 mb-8">Join thousands of creators today</p>
            {!isAuthenticated && (
              <Link href="/signup">
                <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Create Account
                </button>
              </Link>
            )}
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out both;
        }
      `}</style>
    </div>
  );
}