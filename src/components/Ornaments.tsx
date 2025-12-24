import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';
import { generateChaosPosition, generateTreePosition, generateOrnamentColor } from '../utils';
import { OrnamentData, OrnamentType } from '../types';

const GIFT_COUNT = 15;
const BALL_COUNT = 50;
const LIGHT_COUNT = 60;

// 均匀分布在圆锥形圣诞树上
function generateTreeOrnamentPosition(index: number, total: number) {
  const treeHeight = 13;
  const baseRadius = 4.5;
  
  // 均匀分布在不同高度
  const heightRatio = index / total;
  const y = heightRatio * treeHeight - treeHeight / 2;
  
  // 根据高度计算半径
  const radiusAtHeight = baseRadius * Math.pow(1 - heightRatio, 1.1);
  
  // 随机角度和半径
  const angle = Math.random() * Math.PI * 2;
  const r = (0.3 + Math.random() * 0.7) * radiusAtHeight;
  
  return {
    x: r * Math.cos(angle),
    y: y,
    z: r * Math.sin(angle),
  };
}

function generateOrnaments(
  count: number,
  type: OrnamentType,
  startIndex: number,
  totalItems: number
): OrnamentData[] {
  const ornaments: OrnamentData[] = [];
  for (let i = 0; i < count; i++) {
    ornaments.push({
      id: startIndex + i,
      type,
      chaosPosition: generateChaosPosition(20),
      targetPosition: generateTreeOrnamentPosition(startIndex + i, totalItems),
      color: generateOrnamentColor(type),
      scale: type === 'gift' ? 0.25 : type === 'ball' ? 0.15 : 0.06,
    });
  }
  return ornaments;
}

// 礼物盒组件
function Gifts({ ornaments }: { ornaments: OrnamentData[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const treeState = useStore((state) => state.treeState);
  const currentPositions = useRef<{ x: number; y: number; z: number }[]>(
    ornaments.map((o) => ({ ...o.targetPosition }))
  );

  useFrame(() => {
    if (!meshRef.current) return;
    const lerpFactor = 0.03; // 礼物最慢

    ornaments.forEach((ornament, i) => {
      const targetPos = treeState === 'FORMED' ? ornament.targetPosition : ornament.chaosPosition;
      const current = currentPositions.current[i];

      current.x += (targetPos.x - current.x) * lerpFactor;
      current.y += (targetPos.y - current.y) * lerpFactor;
      current.z += (targetPos.z - current.z) * lerpFactor;

      const matrix = new THREE.Matrix4();
      matrix.setPosition(current.x, current.y, current.z);
      matrix.scale(new THREE.Vector3(ornament.scale, ornament.scale, ornament.scale));
      meshRef.current!.setMatrixAt(i, matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, ornaments.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ff0000" metalness={0.3} roughness={0.7} />
    </instancedMesh>
  );
}

// 彩球组件
function Balls({ ornaments }: { ornaments: OrnamentData[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const treeState = useStore((state) => state.treeState);
  const currentPositions = useRef<{ x: number; y: number; z: number }[]>(
    ornaments.map((o) => ({ ...o.targetPosition }))
  );

  useFrame(() => {
    if (!meshRef.current) return;
    const lerpFactor = 0.05;

    ornaments.forEach((ornament, i) => {
      const targetPos = treeState === 'FORMED' ? ornament.targetPosition : ornament.chaosPosition;
      const current = currentPositions.current[i];

      current.x += (targetPos.x - current.x) * lerpFactor;
      current.y += (targetPos.y - current.y) * lerpFactor;
      current.z += (targetPos.z - current.z) * lerpFactor;

      const matrix = new THREE.Matrix4();
      matrix.setPosition(current.x, current.y, current.z);
      matrix.scale(new THREE.Vector3(ornament.scale, ornament.scale, ornament.scale));
      meshRef.current!.setMatrixAt(i, matrix);

      // 设置颜色
      const color = new THREE.Color(ornament.color);
      meshRef.current!.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, ornaments.length]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial metalness={0.8} roughness={0.2} />
    </instancedMesh>
  );
}

// 点缀灯光组件
function Lights({ ornaments }: { ornaments: OrnamentData[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const treeState = useStore((state) => state.treeState);
  const currentPositions = useRef<{ x: number; y: number; z: number }[]>(
    ornaments.map((o) => ({ ...o.targetPosition }))
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const lerpFactor = 0.08; // 灯光最快
    const time = state.clock.elapsedTime;

    ornaments.forEach((ornament, i) => {
      const targetPos = treeState === 'FORMED' ? ornament.targetPosition : ornament.chaosPosition;
      const current = currentPositions.current[i];

      current.x += (targetPos.x - current.x) * lerpFactor;
      current.y += (targetPos.y - current.y) * lerpFactor;
      current.z += (targetPos.z - current.z) * lerpFactor;

      // 闪烁效果
      const flicker = 0.8 + 0.2 * Math.sin(time * 3 + i);
      const scale = ornament.scale * flicker;

      const matrix = new THREE.Matrix4();
      matrix.setPosition(current.x, current.y, current.z);
      matrix.scale(new THREE.Vector3(scale, scale, scale));
      meshRef.current!.setMatrixAt(i, matrix);

      const color = new THREE.Color(ornament.color);
      meshRef.current!.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, ornaments.length]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial emissive="#fffacd" emissiveIntensity={0.8} />
    </instancedMesh>
  );
}

export function Ornaments() {
  const totalItems = GIFT_COUNT + BALL_COUNT + LIGHT_COUNT;

  const { gifts, balls, lights } = useMemo(() => {
    return {
      gifts: generateOrnaments(GIFT_COUNT, 'gift', 0, totalItems),
      balls: generateOrnaments(BALL_COUNT, 'ball', GIFT_COUNT, totalItems),
      lights: generateOrnaments(LIGHT_COUNT, 'light', GIFT_COUNT + BALL_COUNT, totalItems),
    };
  }, []);

  return (
    <group>
      <Gifts ornaments={gifts} />
      <Balls ornaments={balls} />
      <Lights ornaments={lights} />
    </group>
  );
}
