'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesMeshRef = useRef<THREE.Points | null>(null);
  const velocityArrayRef = useRef<Float32Array | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Particle System - Adjust count for mobile
    const particlesGeometry = new THREE.BufferGeometry();
    const isMobile = window.innerWidth <= 768;
    const particlesCount = isMobile ? 1000 : 2000; // Reduce particles on mobile
    const posArray = new Float32Array(particlesCount * 3);
    const velocityArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 200;
      velocityArray[i] = (Math.random() - 0.5) * 0.02;
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: isMobile ? 1.2 : 0.8, // Larger particles on mobile for visibility
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    particlesMeshRef.current = particlesMesh;
    velocityArrayRef.current = velocityArray;

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (
        particlesMesh &&
        particlesGeometry.attributes.position &&
        velocityArray
      ) {
        const positions = particlesGeometry.attributes.position
          .array as Float32Array;

        for (let i = 0; i < particlesCount; i++) {
          const i3 = i * 3;

          positions[i3] += velocityArray[i3];
          positions[i3 + 1] += velocityArray[i3 + 1];
          positions[i3 + 2] += velocityArray[i3 + 2];

          if (positions[i3] > 100 || positions[i3] < -100)
            velocityArray[i3] *= -1;
          if (positions[i3 + 1] > 100 || positions[i3 + 1] < -100)
            velocityArray[i3 + 1] *= -1;
          if (positions[i3 + 2] > 100 || positions[i3 + 2] < -100)
            velocityArray[i3 + 2] *= -1;
        }

        particlesGeometry.attributes.position.needsUpdate = true;
        particlesMesh.rotation.y = mouseRef.current.x * 0.3;
        particlesMesh.rotation.x = mouseRef.current.y * 0.3;
        particlesMesh.rotation.y += 0.0005;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
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
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full z-[1] pointer-events-none"
    />
  );
};

export default ParticleBackground;