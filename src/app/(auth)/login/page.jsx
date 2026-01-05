"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "@/src/components/Auth/LoginForm";
import Link from "next/link";
import * as THREE from "three";

export default function LoginPage() {
	const searchParams = useSearchParams();
	const [isAdminLogin, setIsAdminLogin] = useState(false);
	const canvasRef = useRef(null);

	useEffect(() => {
		const adminParam = searchParams.get("admin");
		if (adminParam === "true") {
			setIsAdminLogin(true);
		}
	}, [searchParams]);

	useEffect(() => {
		if (!canvasRef.current) return;

		// Scene setup
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		const renderer = new THREE.WebGLRenderer({
			canvas: canvasRef.current,
			alpha: true,
			antialias: true,
		});

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		camera.position.z = 5;

		// Create particle system
		const particlesGeometry = new THREE.BufferGeometry();
		const particleCount = 1500;
		const positions = new Float32Array(particleCount * 3);
		const colors = new Float32Array(particleCount * 3);

		for (let i = 0; i < particleCount * 3; i += 3) {
			positions[i] = (Math.random() - 0.5) * 20;
			positions[i + 1] = (Math.random() - 0.5) * 20;
			positions[i + 2] = (Math.random() - 0.5) * 20;

			// Blue to purple gradient
			colors[i] = 0.3 + Math.random() * 0.5;
			colors[i + 1] = 0.4 + Math.random() * 0.3;
			colors[i + 2] = 0.8 + Math.random() * 0.2;
		}

		particlesGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3)
		);
		particlesGeometry.setAttribute(
			"color",
			new THREE.BufferAttribute(colors, 3)
		);

		const particlesMaterial = new THREE.PointsMaterial({
			size: 0.05,
			vertexColors: true,
			transparent: true,
			opacity: 0.8,
			blending: THREE.AdditiveBlending,
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
				opacity: 0.3,
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
		lineGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(linePositions, 3)
		);

		const lineMaterial = new THREE.LineBasicMaterial({
			color: 0x4080ff,
			transparent: true,
			opacity: 0.2,
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

		window.addEventListener("mousemove", handleMouseMove);

		// Animation loop
		const animate = () => {
			requestAnimationFrame(animate);

			// Rotate particles
			particles.rotation.y += 0.001;
			particles.rotation.x += 0.0005;

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
			const particlePositions = particlesGeometry.attributes.position.array;
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

		window.addEventListener("resize", handleResize);

		// Cleanup
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("resize", handleResize);
			renderer.dispose();
			particlesGeometry.dispose();
			particlesMaterial.dispose();
			sphereGeometry.dispose();
			spheres.forEach((sphere) => sphere.material.dispose());
		};
	}, []);

	return (
		<div className="min-h-screen relative overflow-hidden bg-slate-950">
			{/* Three.js Canvas */}
			<canvas
				ref={canvasRef}
				className="fixed top-0 left-0 w-full h-full"
				style={{ zIndex: 0 }}
			/>

			{/* Main Content */}
			<div className="relative z-10 min-h-screen flex items-center justify-center p-4">
				<div className="max-w-md w-full animate-fade-in">
					<div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
						{/* Glass effect overlay */}
						<div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl"></div>

						{/* Content */}
						<div className="relative z-10">
							<div className="mb-8">
								<h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
									{isAdminLogin ? "🛡️ Admin Portal" : "Welcome Back"}
								</h1>
								<p className="text-gray-300 text-lg">
									{isAdminLogin
										? "Admin access required"
										: "Login to continue to MediaHub"}
								</p>
							</div>

							<LoginForm />

							<p className="text-center text-gray-400 mt-8 text-sm">
								Don't have an account?{" "}
								<Link
									href="/signup"
									className="text-blue-400 hover:text-blue-300 font-semibold transition-all duration-300 hover:underline"
								>
									Sign up
								</Link>
							</p>
						</div>
					</div>
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
					animation: fade-in 1s ease-out;
				}
			`}</style>
		</div>
	);
}
