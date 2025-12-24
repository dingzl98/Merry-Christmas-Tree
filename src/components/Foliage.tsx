import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';
import { generateChaosPosition, generateTreePosition, generateFoliageColor, hexToRgb } from '../utils';

const PARTICLE_COUNT = 10000;

export function Foliage() {
  const pointsRef = useRef<THREE.Points>(null);
  const treeState = useStore((state) => state.treeState);

  // 生成粒子数据
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      data.push({
        chaosPosition: generateChaosPosition(15),
        targetPosition: generateTreePosition(i, PARTICLE_COUNT),
        color: generateFoliageColor(),
      });
    }
    return data;
  }, []);

  // 创建几何体和材质
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    particleData.forEach((particle, i) => {
      const pos = particle.targetPosition;
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      const rgb = hexToRgb(particle.color);
      colors[i * 3] = rgb.r;
      colors[i * 3 + 1] = rgb.g;
      colors[i * 3 + 2] = rgb.b;
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        pointSize: { value: 0.8 },
        time: { value: 0.0 },
      },
      vertexShader: `
        attribute vec3 color;
        varying vec3 vColor;
        varying float vRandom;
        uniform float pointSize;
        uniform float time;
        
        float random(vec3 pos) {
          return fract(sin(dot(pos.xyz, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
        }
        
        void main() {
          vColor = color;
          vRandom = random(position);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = pointSize * (120.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vRandom;
        uniform float time;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          // 闪烁效果
          float twinkle = 0.4 + 0.6 * sin(time * 3.0 + vRandom * 20.0);
          
          float alpha = (1.0 - smoothstep(0.2, 0.5, dist)) * twinkle * 0.9;
          gl_FragColor = vec4(vColor * 0.8, alpha);
        }
      `,
      transparent: true,
      depthWrite: true,
      blending: THREE.NormalBlending,
    });

    return { geometry: geo, material: mat };
  }, [particleData]);

  // 动画更新
  useFrame((state) => {
    if (!pointsRef.current) return;

    // 更新时间 uniform
    const mat = pointsRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.time.value = state.clock.elapsedTime;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const lerpFactor = 0.05;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = particleData[i];
      const targetPos = treeState === 'FORMED' ? particle.targetPosition : particle.chaosPosition;

      positions[i * 3] += (targetPos.x - positions[i * 3]) * lerpFactor;
      positions[i * 3 + 1] += (targetPos.y - positions[i * 3 + 1]) * lerpFactor;
      positions[i * 3 + 2] += (targetPos.z - positions[i * 3 + 2]) * lerpFactor;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
