import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';

export function FocusedPhotoViewer() {
  const meshRef = useRef<THREE.Mesh>(null);
  const photos = useStore((state) => state.photos);
  const handOpen = useStore((state) => state.handOpen);
  const focusedPhotoIndex = useStore((state) => state.focusedPhotoIndex);
  const togglePhotoView = useStore((state) => state.togglePhotoView);
  const nextPhoto = useStore((state) => state.nextPhoto);

  const [currentTexture, setCurrentTexture] = useState<THREE.Texture | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { camera } = useThree();

  // 检测是否是移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 加载当前聚焦的照片纹理
  useEffect(() => {
    if (focusedPhotoIndex >= 0 && focusedPhotoIndex < photos.length) {
      const loader = new THREE.TextureLoader();
      loader.load(photos[focusedPhotoIndex], (texture) => {
        setCurrentTexture(texture);
      });
    } else {
      setCurrentTexture(null);
    }
  }, [focusedPhotoIndex, photos]);

  // 监听键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && focusedPhotoIndex >= 0) {
        nextPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedPhotoIndex, nextPhoto]);

  // 监听点击事件
  useEffect(() => {
    const handleClick = () => {
      if (!handOpen) return;
      togglePhotoView();
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [togglePhotoView, handOpen]);

  // 自动播放照片
  useEffect(() => {
    if (focusedPhotoIndex >= 0 && handOpen) {
      const timer = setInterval(() => {
        nextPhoto();
      }, 1000); // 1秒切换
      return () => clearInterval(timer);
    }
  }, [focusedPhotoIndex, handOpen, nextPhoto]);

  useFrame(() => {
    if (!meshRef.current) return;

    const shouldShow = handOpen && focusedPhotoIndex >= 0 && currentTexture !== null;
    
    // 缩放动画 - 移动端用更小的尺寸
    const targetScale = shouldShow ? (isMobile ? 2 : 4) : 0.01;
    const currentScale = meshRef.current.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * 0.1;
    meshRef.current.scale.set(newScale, newScale, newScale);

    // 位置：相机前方 6 单位
    const direction = new THREE.Vector3(0, 0, -6);
    direction.applyQuaternion(camera.quaternion);
    const targetPos = camera.position.clone().add(direction);
    meshRef.current.position.lerp(targetPos, 0.1);

    // 面向相机
    meshRef.current.lookAt(camera.position);

    // 透明度
    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    const targetOpacity = shouldShow ? 1 : 0;
    material.opacity += (targetOpacity - material.opacity) * 0.1;
  });

  // 计算宽高比
  let width = 1;
  let height = 1;
  if (currentTexture && currentTexture.image) {
    const aspect = currentTexture.image.width / currentTexture.image.height;
    width = 1;
    height = 1 / aspect;
  }

  return (
    <mesh ref={meshRef} scale={[0.01, 0.01, 0.01]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={currentTexture}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        depthTest={false}
      />
    </mesh>
  );
}
