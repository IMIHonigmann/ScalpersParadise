'use client';

import * as THREE from 'three';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Box(props: ThreeElements['mesh']) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (meshRef.current.rotation.x += delta * 0));
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : '#2f74c0'} />
    </mesh>
  );
}

export function BoxCanvas() {
  return (
    <div style={{ width: '600px', height: '300px' }}>
      <Canvas camera={{ position: [0, 0, -2], fov: 75 }}>
        <OrbitControls
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 16}
          maxAzimuthAngle={Math.PI / 16}
          enablePan={false}
          enableZoom={false}
        />
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}
