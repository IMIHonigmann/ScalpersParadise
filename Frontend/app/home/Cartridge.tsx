/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
'use client';

import * as THREE from 'three';
import React, { JSX, useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Cardridge_low_1: THREE.Mesh;
    Cardridge_low_2: THREE.Mesh;
  };
  materials: {
    CardridgeMat: THREE.MeshStandardMaterial;
    BOTW: THREE.MeshStandardMaterial;
  };
};

export function CartridgeModel(
  props: JSX.IntrinsicElements['group'] & { poster_path: string }
) {
  const { nodes, materials } = useGLTF(
    '/Cartridge.gltf'
  ) as unknown as GLTFResult;
  const labelTexture = useTexture(props.poster_path);
  const cartridgeDiff = useTexture('/textures/Cartridge/BaseColor.png');
  const cartridgeMetallic = useTexture('/textures/Cartridge/Metallic.png');
  const cartridgeNormal = useTexture('/textures/Cartridge/Normal.png');
  const cartridgeRough = useTexture('/textures/Cartridge/Roughness.png');

  const cartridgeMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      map: cartridgeDiff,
      metalnessMap: cartridgeMetallic,
      normalMap: cartridgeNormal,
      roughnessMap: cartridgeRough,
      color: '#555555',
    });
    return material;
  }, [cartridgeDiff, cartridgeMetallic, cartridgeNormal, cartridgeRough]);

  labelTexture.colorSpace = THREE.SRGBColorSpace;
  cartridgeDiff.flipY = false;
  cartridgeMetallic.flipY = false;
  cartridgeNormal.flipY = false;
  cartridgeRough.flipY = false;

  const botwMaterial = React.useMemo(() => {
    const mat = materials.BOTW.clone();
    mat.envMapIntensity = 1;
    mat.metalness = 1;
    mat.roughness = 0.4;

    return mat;
  }, [materials.BOTW]);

  useMemo(() => {
    botwMaterial.map = labelTexture;
    botwMaterial.needsUpdate = true;
  }, [botwMaterial, labelTexture]);

  return (
    <group {...props} dispose={null}>
      <group name="RootNode" scale={1.5}>
        <mesh
          name="Cardridge_low_1"
          castShadow
          receiveShadow
          geometry={nodes.Cardridge_low_1.geometry}
          material={cartridgeMaterial}
        />
        <mesh
          name="Cardridge_low_2"
          castShadow
          receiveShadow
          geometry={nodes.Cardridge_low_2.geometry}
          material={botwMaterial}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/Cartridge.gltf');
