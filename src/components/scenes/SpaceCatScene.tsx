'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Box } from '@react-three/drei';
import * as THREE from 'three';

function PlaceholderCat() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
    if (meshRef.current && clicked) {
      // Simple bounce animation
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 10) * 0.2;
    }
  });

  return (
    <Box
      ref={meshRef}
      args={[1.5, 1.5, 1.5]}
      scale={hovered ? 1.1 : 1}
      onClick={() => {
        setClicked(!clicked);
        // Reset position if un-clicked
        if (clicked && meshRef.current) {
          meshRef.current.position.y = 0;
        }
      }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <meshStandardMaterial color={hovered ? 'hotpink' : 'mediumpurple'} />
    </Box>
  );
}

export default function SpaceCatScene() {
  return (
    <div className="h-96 w-full">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars />
        <PlaceholderCat />
      </Canvas>
    </div>
  );
}
