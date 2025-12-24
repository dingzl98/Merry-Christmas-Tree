import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';
import { generateChaosPosition, generateTreePosition } from '../utils';

interface PhotoMeshData {
  chaosPosition: { x: number; y: number; z: number };
  targetPosition: { x: number; y: number; z: number };
  texture: THREE.Texture | null;
}

export function PhotoFrames() {
  const groupRef = useRef<THREE.Group>(null);
  const photos = useStore((state) => state.photos);
  const treeState = useStore((state) => state.treeState);
  const handOpen = useStore((state) => state.handOpen);

  const [photoData, setPhotoData] = useState<PhotoMeshData[]>([]);

  // 加载照片纹理
  useEffect(() => {
    if (photos.length === 0) {
      setPhotoData([]);
      return;
    }

    const loader = new THREE.TextureLoader();
    const loadPromises = photos.map((photoUrl, index) => {
      return new Promise<PhotoMeshData>((resolve) => {
        loader.load(
          photoUrl,
          (texture) => {
            resolve({
              chaosPosition: generateChaosPosition(12),
              targetPosition: generateTreePosition(index, photos.length, 10, 5),
              texture,
            });
          },
          undefined,
          () => {
            resolve({
              chaosPosition: generateChaosPosition(12),
              targetPosition: generateTreePosition(index, photos.length, 10, 5),
              texture: null,
            });
          }
        );
      });
    });

    Promise.all(loadPromises).then(setPhotoData);
  }, [photos]);

  if (photoData.length === 0) return null;

  return (
    <group ref={groupRef}>
      {photoData.map((data, index) => (
        <PhotoMesh
          key={index}
          data={data}
          treeState={treeState}
          handOpen={handOpen}
        />
      ))}
    </group>
  );
}

function PhotoMesh({
  data,
  treeState,
  handOpen,
}: {
  data: PhotoMeshData;
  treeState: 'CHAOS' | 'FORMED';
  handOpen: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentPosition = useRef({ ...data.chaosPosition });
  const currentOpacity = useRef(0);

  useFrame((state) => {
    if (!meshRef.current || !data.texture) return;

    const lerpFactor = 0.05;
    const targetPos = treeState === 'FORMED' ? data.targetPosition : data.chaosPosition;

    // 位置插值
    currentPosition.current.x += (targetPos.x - currentPosition.current.x) * lerpFactor;
    currentPosition.current.y += (targetPos.y - currentPosition.current.y) * lerpFactor;
    currentPosition.current.z += (targetPos.z - currentPosition.current.z) * lerpFactor;

    meshRef.current.position.set(
      currentPosition.current.x,
      currentPosition.current.y,
      currentPosition.current.z
    );

    // 透明度：仅在混沌状态且手张开时可见
    const targetOpacity = handOpen && treeState === 'CHAOS' ? 0.9 : 0;
    currentOpacity.current += (targetOpacity - currentOpacity.current) * 0.1;

    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = currentOpacity.current;

    // 面向相机
    meshRef.current.lookAt(state.camera.position);
  });

  if (!data.texture) return null;

  // 计算纹理宽高比
  const aspect = data.texture.image.width / data.texture.image.height;
  const width = 1.5;
  const height = width / aspect;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={data.texture}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
