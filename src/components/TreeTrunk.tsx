import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';

export function TreeTrunk() {
  const meshRef = useRef<THREE.Mesh>(null);
  const treeState = useStore((state) => state.treeState);
  const currentOpacity = useRef(1);

  useFrame(() => {
    if (!meshRef.current) return;
    
    const targetOpacity = treeState === 'FORMED' ? 1 : 0.3;
    currentOpacity.current += (targetOpacity - currentOpacity.current) * 0.05;
    
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.opacity = currentOpacity.current;
  });

  return (
    <mesh ref={meshRef} position={[0, -6.5, 0]}>
      <cylinderGeometry args={[0.5, 0.8, 2, 16]} />
      <meshStandardMaterial
        color="#8B4513"
        roughness={0.8}
        metalness={0.1}
        transparent
        opacity={1}
      />
    </mesh>
  );
}
