'use client';

import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import type { TMDBMovieDetails } from '@/types/TMDB';
import { CartridgeModel } from './Cartridge';
import { Environment } from '@react-three/drei';

export function InteractiveCartridge(
  props: ThreeElements['mesh'] & {
    setCamLoc: React.Dispatch<React.SetStateAction<number>>;
    movie: TMDBMovieDetails;
    reverseHover?: boolean;
    restRotation?: number;
    innerIndex?: number;
  }
) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const reverseHover = props.reverseHover ?? false;
  const innerIndex = props.innerIndex ?? 0;
  const restRotation = props.restRotation ?? 0.25;

  const [hovered, setHover] = useState(reverseHover);
  const [active, setActive] = useState(false);
  const timeOutsideHover = useRef(0);
  const floatHeight = 4;
  const offsetDifference = 0.75;
  useFrame((state, delta) => {
    timeOutsideHover.current += delta;

    meshRef.current.position.y =
      Math.sin(timeOutsideHover.current * 2 + innerIndex * offsetDifference) *
      floatHeight;
    if (hovered) {
      meshRef.current.rotation.y += delta * 0.5;
      const targetScale = 1.15;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    } else {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        restRotation,
        0.1
      );
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });
  const router = useRouter();
  return (
    <mesh
      {...props}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        setHover(!reverseHover);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setHover(reverseHover);
      }}
      onClick={() => {
        setActive(!active);
        props.setCamLoc((prev: number) => prev + 0.1);
        router.push(props.movie.id.toString());
      }}
    >
      <boxGeometry args={[370, 700, 500]} />
      <meshStandardMaterial color={'red'} opacity={0} transparent={true} />
      <mesh ref={meshRef} scale={active ? 0.9 : 1}>
        <CartridgeModel
          poster_path={
            props.movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`
              : '/Sotenboori3DFallback.png'
          }
        />
        <meshStandardMaterial color="#2f74c0" />
      </mesh>
    </mesh>
  );
}

export function BoxCanvas({
  currentMovies,
}: {
  currentMovies: TMDBMovieDetails[];
}) {
  const [camLoc, setCamLoc] = useState(375);
  return (
    <div className="flex justify-center items-center">
      <Canvas
        camera={{ position: [0, -100, 500], fov: 75 }}
        style={{ width: '100%', height: '30em' }}
        orthographic
      >
        <Environment preset="sunset" background />
        <pointLight position={[250, 400, 100]} decay={0} intensity={5} />
        <pointLight position={[-250, 100, -100]} decay={0} intensity={5} />
        <directionalLight position={[0, 100, 100]} intensity={1.5} />
        {currentMovies.map((movie, index) => (
          <InteractiveCartridge
            key={index}
            position={[camLoc * (index - 2), 0, 0]}
            innerIndex={index}
            setCamLoc={setCamLoc}
            movie={movie}
          />
        ))}
      </Canvas>
    </div>
  );
}
