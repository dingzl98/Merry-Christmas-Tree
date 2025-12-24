import { useRef, ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';
import { randomAxis } from '../utils';

interface AutoRotateGroupProps {
  children: ReactNode;
}

export function AutoRotateGroup({ children }: AutoRotateGroupProps) {
  const groupRef = useRef<THREE.Group>(null);
  const treeState = useStore((state) => state.treeState);
  
  // 随机旋转轴
  const rotationAxis = useRef(randomAxis());
  const lastAxisChangeTime = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (treeState === 'CHAOS') {
      // 混沌状态：绕随机轴缓慢旋转
      const time = state.clock.elapsedTime;
      
      // 每 3-5 秒随机改变一次旋转轴方向
      if (time - lastAxisChangeTime.current > 3 + Math.random() * 2) {
        rotationAxis.current = randomAxis();
        lastAxisChangeTime.current = time;
      }

      // 绕随机轴旋转
      const axis = new THREE.Vector3(
        rotationAxis.current.x,
        rotationAxis.current.y,
        rotationAxis.current.z
      ).normalize();
      
      const quaternion = new THREE.Quaternion();
      quaternion.setFromAxisAngle(axis, delta * 0.3);
      groupRef.current.quaternion.multiplyQuaternions(quaternion, groupRef.current.quaternion);
    } else {
      // 圣诞树状态：恢复正立
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.05);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}
