'use client';

import { Environment } from '@react-three/drei';
import { InteractiveCartridge } from '../home/MovieBox';
import { Canvas } from '@react-three/fiber';
import { TMDBMovieDetails } from '@/types/TMDB';
import { useState } from 'react';

export function SingleMovieCanvas({ movie }: { movie: TMDBMovieDetails }) {
  const [camLoc, setCamLoc] = useState(375);
  return (
    <div className="flex flex-row justify-center items-center w-full h-[30em]">
      <Canvas
        camera={{ position: [-50, -100, 500], fov: 75 }}
        orthographic
        gl={{ alpha: true, antialias: true }}
      >
        <Environment preset="sunset" background />
        <pointLight position={[250, 200, 100]} decay={0} intensity={7.5} />
        <pointLight position={[-200, 100, -100]} decay={0} intensity={5} />
        <directionalLight position={[0, 100, 100]} intensity={1} />
        <InteractiveCartridge
          position={[0, 0, 0]}
          setCamLoc={setCamLoc}
          movie={movie}
          restRotation={0.3}
        />
      </Canvas>
    </div>
  );
}
