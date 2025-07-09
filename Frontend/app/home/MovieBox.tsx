'use client';

import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Box(
  props: ThreeElements['mesh'] & {
    setCamLoc: React.Dispatch<React.SetStateAction<number>>;
  }
) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (meshRef.current.rotation.x += delta * 0));
  const router = useRouter();
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => {
        setActive(!active);
        props.setCamLoc((prev: number) => prev + 0.1);
        router.push('/test');
      }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : '#2f74c0'} />
    </mesh>
  );
}

export function BoxCanvas() {
  const [camLoc, setCamLoc] = useState(2.5);
  return (
    <div className="flex justify-center items-center">
      <Canvas
        camera={{ position: [0, 0, -2], fov: 75 }}
        style={{ width: '100%', height: '300px' }}
      >
        <OrbitControls
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 16}
          maxAzimuthAngle={Math.PI / 16}
          enablePan={false}
          enableZoom={false}
        />
        <pointLight position={[10, 10, 10]} decay={0} intensity={Math.PI * 4} />
        <Box position={[camLoc * -2, 0, 0]} setCamLoc={setCamLoc} />
        <Box position={[camLoc * -1, 0, 0]} setCamLoc={setCamLoc} />
        <Box position={[camLoc * 0, 0, 0]} setCamLoc={setCamLoc} />
        <Box position={[camLoc * 1, 0, 0]} setCamLoc={setCamLoc} />
        <Box position={[camLoc * 2, 0, 0]} setCamLoc={setCamLoc} />
      </Canvas>
    </div>
  );
}
