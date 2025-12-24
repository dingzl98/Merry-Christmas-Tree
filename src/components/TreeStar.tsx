import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';

// 创建五角星形状
function createStarShape(): THREE.Shape {
  const shape = new THREE.Shape();
  const outerRadius = 0.8;
  const innerRadius = 0.35;
  const points = 5;

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  shape.closePath();
  return shape;
}

export function TreeStar() {
  const meshRef = useRef<THREE.Mesh>(null);
  const treeState = useStore((state) => state.treeState);
  const currentScale = useRef(1);
  const currentOpacity = useRef(1);

  const geometry = useMemo(() => {
    const shape = createStarShape();
    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 2,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const targetScale = treeState === 'FORMED' ? 1 : 0.5;
    const targetOpacity = treeState === 'FORMED' ? 1 : 0.3;

    currentScale.current += (targetScale - currentScale.current) * 0.05;
    currentOpacity.current += (targetOpacity - currentOpacity.current) * 0.05;

    // 缩放
    const scale = currentScale.current;
    meshRef.current.scale.set(scale, scale, scale);

    // 轻微旋转
    meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;

    // 更新材质
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = 0.8 + Math.sin(time * 2) * 0.2;
  });

  return (
    <mesh ref={meshRef} position={[0, 6.2, 0]} rotation={[0, 0, 0]} geometry={geometry}>
      <meshStandardMaterial
        color="#ffd700"
        emissive="#ffd700"
        emissiveIntensity={0.8}
        metalness={0.9}
        roughness={0.1}
        transparent
      />
    </mesh>
  );
}
