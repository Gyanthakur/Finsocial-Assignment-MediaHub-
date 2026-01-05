'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function DashboardBackground() {
  const canvasRef = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!canvasRef.current || mountedRef.current) return;
    mountedRef.current = true;

    let animationId;
    let renderer, scene, camera;

    try {
      // Scene setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current, 
        alpha: true,
        antialias: true 
      });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      camera.position.set(0, 3, 8);

      // Create wave particles
      const waveGeometry = new THREE.BufferGeometry();
      const waveCount = 60;
      const waveParticles = waveCount * waveCount;
      const wavePositions = new Float32Array(waveParticles * 3);
      const waveColors = new Float32Array(waveParticles * 3);

      let index = 0;
      for (let i = 0; i < waveCount; i++) {
        for (let j = 0; j < waveCount; j++) {
          wavePositions[index * 3] = (i - waveCount / 2) * 0.3;
          wavePositions[index * 3 + 1] = 0;
          wavePositions[index * 3 + 2] = (j - waveCount / 2) * 0.3;

          const t = i / waveCount;
          const color = new THREE.Color();
          color.setHSL(0.6 - t * 0.15, 0.75, 0.55);
          waveColors[index * 3] = color.r;
          waveColors[index * 3 + 1] = color.g;
          waveColors[index * 3 + 2] = color.b;

          index++;
        }
      }

      waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
      waveGeometry.setAttribute('color', new THREE.BufferAttribute(waveColors, 3));

      const waveMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });

      const waveParticleSystem = new THREE.Points(waveGeometry, waveMaterial);
      waveParticleSystem.rotation.x = -Math.PI / 3.5;
      scene.add(waveParticleSystem);

      // Create floating particles
      const floatingGeometry = new THREE.BufferGeometry();
      const floatingCount = 500;
      const floatingPositions = new Float32Array(floatingCount * 3);
      const floatingColors = new Float32Array(floatingCount * 3);
      const floatingVelocities = [];

      for (let i = 0; i < floatingCount; i++) {
        floatingPositions[i * 3] = (Math.random() - 0.5) * 30;
        floatingPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        floatingPositions[i * 3 + 2] = (Math.random() - 0.5) * 25;

        floatingVelocities.push({
          x: (Math.random() - 0.5) * 0.025,
          y: (Math.random() - 0.5) * 0.025,
          z: (Math.random() - 0.5) * 0.025
        });

        const color = new THREE.Color();
        color.setHSL(0.55 + Math.random() * 0.12, 0.75, 0.65);
        floatingColors[i * 3] = color.r;
        floatingColors[i * 3 + 1] = color.g;
        floatingColors[i * 3 + 2] = color.b;
      }

      floatingGeometry.setAttribute('position', new THREE.BufferAttribute(floatingPositions, 3));
      floatingGeometry.setAttribute('color', new THREE.BufferAttribute(floatingColors, 3));

      const floatingMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });

      const floatingParticles = new THREE.Points(floatingGeometry, floatingMaterial);
      scene.add(floatingParticles);

      // Create glowing spheres
      const spheres = [];
      const sphereGeometry = new THREE.SphereGeometry(0.5, 20, 20);
      
      for (let i = 0; i < 6; i++) {
        const sphereMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.54 + i * 0.06, 0.8, 0.62),
          transparent: true,
          opacity: 0.28
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 8
        );
        spheres.push(sphere);
        scene.add(sphere);
      }

      // Create connecting lines between wave points
      const lineGeometry = new THREE.BufferGeometry();
      const linePositions = new Float32Array(waveParticles * 6);
      lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
      
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x5090ff,
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
      let time = 0;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        time += 0.012;

        // Smooth mouse follow
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Animate wave with more dynamic motion
        const positions = waveGeometry.attributes.position.array;
        index = 0;
        for (let i = 0; i < waveCount; i++) {
          for (let j = 0; j < waveCount; j++) {
            const x = (i - waveCount / 2) * 0.3;
            const z = (j - waveCount / 2) * 0.3;
            
            positions[index * 3 + 1] = 
              Math.sin(x * 0.4 + time * 1.5) * 0.8 + 
              Math.cos(z * 0.4 + time * 1.5) * 0.8 +
              Math.sin((x + z) * 0.25 + time * 1.8) * 0.6 +
              Math.cos(x * z * 0.01 + time) * 0.3;
            
            index++;
          }
        }
        waveGeometry.attributes.position.needsUpdate = true;

        // Rotate wave system
        waveParticleSystem.rotation.y += 0.003;

        // Animate floating particles with boundary wrapping
        const floatingPos = floatingGeometry.attributes.position.array;
        for (let i = 0; i < floatingCount; i++) {
          floatingPos[i * 3] += floatingVelocities[i].x;
          floatingPos[i * 3 + 1] += floatingVelocities[i].y;
          floatingPos[i * 3 + 2] += floatingVelocities[i].z;

          // Wrap around boundaries
          if (Math.abs(floatingPos[i * 3]) > 15) floatingVelocities[i].x *= -1;
          if (Math.abs(floatingPos[i * 3 + 1]) > 15) floatingVelocities[i].y *= -1;
          if (Math.abs(floatingPos[i * 3 + 2]) > 12) floatingVelocities[i].z *= -1;
        }
        floatingGeometry.attributes.position.needsUpdate = true;

        // Rotate floating particles
        floatingParticles.rotation.y += 0.0012;
        floatingParticles.rotation.x += 0.0005;

        // Animate spheres with more dynamic movement
        spheres.forEach((sphere, i) => {
          sphere.position.y += Math.sin(time * 0.9 + i * 0.8) * 0.006;
          sphere.position.x += Math.cos(time * 0.7 + i * 0.5) * 0.005;
          sphere.rotation.x += 0.012;
          sphere.rotation.y += 0.018;
          
          // Pulsating effect
          const scale = 1 + Math.sin(time + i) * 0.1;
          sphere.scale.set(scale, scale, scale);
        });

        // Update connecting lines
        const linePos = lineGeometry.attributes.position.array;
        let lineIdx = 0;
        for (let i = 0; i < waveCount - 1; i++) {
          for (let j = 0; j < waveCount - 1; j++) {
            const idx1 = i * waveCount + j;
            const idx2 = i * waveCount + (j + 1);
            const idx3 = (i + 1) * waveCount + j;

            if (lineIdx < waveParticles * 6 - 12) {
              linePos[lineIdx++] = positions[idx1 * 3];
              linePos[lineIdx++] = positions[idx1 * 3 + 1];
              linePos[lineIdx++] = positions[idx1 * 3 + 2];
              linePos[lineIdx++] = positions[idx2 * 3];
              linePos[lineIdx++] = positions[idx2 * 3 + 1];
              linePos[lineIdx++] = positions[idx2 * 3 + 2];

              linePos[lineIdx++] = positions[idx1 * 3];
              linePos[lineIdx++] = positions[idx1 * 3 + 1];
              linePos[lineIdx++] = positions[idx1 * 3 + 2];
              linePos[lineIdx++] = positions[idx3 * 3];
              linePos[lineIdx++] = positions[idx3 * 3 + 1];
              linePos[lineIdx++] = positions[idx3 * 3 + 2];
            }
          }
        }
        lineGeometry.attributes.position.needsUpdate = true;

        // Camera mouse follow with smooth interpolation
        camera.position.x += (targetX * 2.5 - camera.position.x) * 0.05;
        camera.position.y += (3 + targetY * 2.5 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      animate();

      // Handle resize
      const handleResize = () => {
        if (camera && renderer) {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        
        if (renderer) {
          renderer.dispose();
        }
        
        waveGeometry.dispose();
        waveMaterial.dispose();
        floatingGeometry.dispose();
        floatingMaterial.dispose();
        lineGeometry.dispose();
        lineMaterial.dispose();
        sphereGeometry.dispose();
        spheres.forEach(sphere => sphere.material.dispose());
      };
    } catch (error) {
      console.error('Three.js initialization error:', error);
    }
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}