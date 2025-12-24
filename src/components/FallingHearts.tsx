import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';

interface Heart {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotationSpeed: THREE.Vector3;
  scale: number;
  color: string;
}

// 创建心形几何体
function createHeartShape() {
  const shape = new THREE.Shape();
  const x = 0, y = 0;
  
  shape.moveTo(x + 0.25, y + 0.25);
  shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
  shape.bezierCurveTo(x - 0.35, y, x - 0.35, y + 0.35, x - 0.35, y + 0.35);
  shape.bezierCurveTo(x - 0.35, y + 0.55, x - 0.25, y + 0.77, x + 0.25, y + 0.95);
  shape.bezierCurveTo(x + 0.75, y + 0.77, x + 0.85, y + 0.55, x + 0.85, y + 0.35);
  shape.bezierCurveTo(x + 0.85, y + 0.35, x + 0.85, y, x + 0.5, y);
  shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);
  
  return shape;
}

export function FallingHearts() {
  const groupRef = useRef<THREE.Group>(null);
  const showHearts = useStore((state) => state.showHearts);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  
  const heartGeometry = useMemo(() => {
    const shape = createHeartShape();
    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const colors = ['#FF1493', '#FF69B4', '#DC143C', '#FF6347', '#FF4500', '#FFD700'];

  // 当显示心形时，生成新的心形
  useEffect(() => {
    if (showHearts) {
      const newHearts: Heart[] = [];
      for (let i = 0; i < 5; i++) {
        newHearts.push({
          position: new THREE.Vector3(
            (Math.random() - 0.5) * 20,
            15 + Math.random() * 5,
            (Math.random() - 0.5) * 10
          ),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            -0.03 - Math.random() * 0.02,
            (Math.random() - 0.5) * 0.02
          ),
          rotation: new THREE.Euler(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          ),
          rotationSpeed: new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
          ),
          scale: 0.3 + Math.random() * 0.4,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      setHearts(prev => [...prev, ...newHearts]);
    }
  }, [showHearts]);

  // 定期添加心形（当showHearts为true时）
  useEffect(() => {
    if (!showHearts) return;
    
    const interval = setInterval(() => {
      const newHeart: Heart = {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          15 + Math.random() * 3,
          (Math.random() - 0.5) * 10
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          -0.03 - Math.random() * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        scale: 0.3 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      setHearts(prev => [...prev.slice(-50), newHeart]); // 最多保留50个心形
    }, 200);
    
    return () => clearInterval(interval);
  }, [showHearts]);

  // 动画更新
  useFrame(() => {
    setHearts(prevHearts => {
      return prevHearts.map(heart => {
        const newPos = heart.position.clone().add(heart.velocity);
        const newRot = new THREE.Euler(
          heart.rotation.x + heart.rotationSpeed.x,
          heart.rotation.y + heart.rotationSpeed.y,
          heart.rotation.z + heart.rotationSpeed.z
        );
        
        // 如果落到底部，移除
        if (newPos.y < -10) {
          return null;
        }
        
        return {
          ...heart,
          position: newPos,
          rotation: newRot
        };
      }).filter(h => h !== null) as Heart[];
    });
  });

  return (
    <group ref={groupRef}>
      {hearts.map((heart, index) => (
        <mesh
          key={index}
          ref={el => meshRefs.current[index] = el}
          geometry={heartGeometry}
          position={heart.position}
          rotation={heart.rotation}
          scale={heart.scale}
        >
          <meshStandardMaterial
            color={heart.color}
            emissive={heart.color}
            emissiveIntensity={0.5}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}
