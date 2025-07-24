'use client';

import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import type { TMDBMovieDetails } from '@/types/TMDB';
import { CartridgeModel } from './Cartridge';
import { Environment, useHelper } from '@react-three/drei';
import gsap from 'gsap';

export function InteractiveCartridge(
  props: ThreeElements['mesh'] & {
    setCamLoc: React.Dispatch<React.SetStateAction<number>>;
    movie: TMDBMovieDetails;
    reverseHover?: boolean;
    restRotation?: number;
    innerIndex?: number;
  } & (
      | { rotationDirection?: undefined; setRotationDirection?: undefined }
      | {
          rotationDirection: number;
          setRotationDirection: React.Dispatch<
            React.SetStateAction<number>
          > | null;
        }
    )
) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const reverseHover = props.reverseHover ?? false;
  const innerIndex = props.innerIndex ?? 0;
  const restRotation = props.restRotation ?? 0.3;
  const rotationDirection = props.rotationDirection ?? 0;
  const setRotationDirection = props.setRotationDirection ?? null;

  const [hovered, setHover] = useState(reverseHover);
  const [rotating, setRotating] = useState(false);
  const timeOutsideHover = useRef(0);
  const floatHeight = 4;
  const offsetDifference = 0.75;

  useEffect(() => {
    if (!meshRef.current) return;
    setRotating(true);
    const rotation = meshRef.current.rotation;
    gsap.timeline().to(rotation, {
      y: Math.PI * 2 * rotationDirection + restRotation,
      duration: 1,
      ease: 'power4.out',
      onComplete: () => {
        meshRef.current.rotation.y = restRotation;
        if (setRotationDirection !== null) setRotationDirection(0);
        setRotating(false);
      },
    });

    return () => gsap.killTweensOf(rotation);
  }, [restRotation, rotationDirection, setRotationDirection]);

  useFrame((state, delta) => {
    timeOutsideHover.current += delta;

    meshRef.current.position.y =
      Math.sin(timeOutsideHover.current * 2 + innerIndex * offsetDifference) *
      floatHeight;
    if (!rotating) {
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
        props.setCamLoc((prev: number) => prev + 0.1);
        router.push(props.movie.id.toString());
      }}
    >
      <boxGeometry args={[370, 700, 500]} />
      <meshStandardMaterial color={'red'} opacity={0} transparent={true} />
      <mesh ref={meshRef}>
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

function MovingLight(props: { hoveredIndex: number }) {
  const backLightTargetPositionX = -200 + 375 * props.hoveredIndex;
  const frontLightTargetPositionX = 250 + 375 * props.hoveredIndex;
  const backLightRef = useRef<THREE.PointLight>(null!);
  const frontLightRef = useRef<THREE.PointLight>(null!);
  const speed = 0.1;

  useFrame(() => {
    backLightRef.current.position.x = THREE.MathUtils.lerp(
      backLightRef.current.position.x,
      backLightTargetPositionX,
      speed
    );
    frontLightRef.current.position.x = THREE.MathUtils.lerp(
      frontLightRef.current.position.x,
      frontLightTargetPositionX,
      speed * 0.5
    );
  });

  useHelper(backLightRef, THREE.PointLightHelper, 30, 'red');
  useHelper(frontLightRef, THREE.PointLightHelper, 30, 'red');

  return (
    <group>
      <pointLight
        ref={frontLightRef}
        position={[250, 200, 100]}
        decay={0}
        intensity={7.5}
      />
      <pointLight
        ref={backLightRef}
        position={[-200, 100, -100]}
        decay={0}
        intensity={5}
      />
    </group>
  );
}

export function BoxCanvas({
  currentMovies,
}: {
  currentMovies: TMDBMovieDetails[];
}) {
  const [camLoc, setCamLoc] = useState(375);
  const [hoveredIndex, setHoveredIndex] = useState(0);
  return (
    <div className="flex justify-center items-center">
      <Canvas
        camera={{ position: [0, -100, 500], fov: 75 }}
        style={{ width: '100%', height: '30em' }}
        orthographic
      >
        <Environment preset="sunset" background />
        <directionalLight position={[0, 100, 100]} intensity={1.5} />
        <MovingLight hoveredIndex={hoveredIndex} />
        {currentMovies.map((movie, index) => (
          <mesh onPointerOver={() => setHoveredIndex(index - 2)} key={index}>
            <InteractiveCartridge
              position={[camLoc * (index - 2), 0, 0]}
              innerIndex={index}
              setCamLoc={setCamLoc}
              movie={movie}
              restRotation={0.3}
            />
          </mesh>
        ))}
      </Canvas>
    </div>
  );
}
