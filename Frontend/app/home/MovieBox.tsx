'use client';

import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import type { TMDBMovieDetails } from '@/types/TMDB';

function Box(
  props: ThreeElements['mesh'] & {
    setCamLoc: React.Dispatch<React.SetStateAction<number>>;
    movie: TMDBMovieDetails;
  }
) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const timeOutsideHover = useRef(0);
  useEffect(() => {
    if (!active) {
    }
  }, [active]);
  useFrame((state, delta) => {
    timeOutsideHover.current += delta;
    if (!hovered) {
      meshRef.current.position.y = 0;
      timeOutsideHover.current = 0;
      return;
    }
    meshRef.current.rotation.y += delta * 0.1;
    meshRef.current.position.y =
      Math.sin(timeOutsideHover.current * 3.5) * 25.9;
  });
  const router = useRouter();
  return (
    <mesh
      {...props}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => {
        setHover(false);
      }}
      onClick={() => {
        setActive(!active);
        props.setCamLoc((prev: number) => prev + 0.1);
        router.push(props.movie.id.toString());
      }}
    >
      <boxGeometry args={[370, 700, 500]} />
      <meshStandardMaterial color={'red'} opacity={0} transparent={true} />
      <mesh ref={meshRef} scale={active ? 1.5 : 1}>
        <boxGeometry args={[100, 100, 100]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : '#2f74c0'} />
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
        <pointLight
          position={[-250, -100, 100]}
          decay={0}
          intensity={Math.PI * 4}
        />
        <pointLight
          position={[250, 100, 100]}
          decay={0}
          intensity={Math.PI * 4}
        />
        {currentMovies.map((movie, index) => (
          <Box
            key={index}
            position={[camLoc * (index - 2), 0, 0]}
            setCamLoc={setCamLoc}
            movie={movie}
          />
        ))}
      </Canvas>
    </div>
  );
}
