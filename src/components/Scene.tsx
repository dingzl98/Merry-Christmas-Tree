import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense } from 'react';
import { Foliage } from './Foliage';
import { Ornaments } from './Ornaments';
import { TreeTrunk } from './TreeTrunk';
import { TreeStar } from './TreeStar';
import { PhotoFrames } from './PhotoFrames';
import { FocusedPhotoViewer } from './FocusedPhotoViewer';
import { FallingHearts } from './FallingHearts';
import { AutoRotateGroup } from './AutoRotateGroup';

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 4, 20], fov: 50 }}
      gl={{
        antialias: true,
        toneMapping: 2, // ACESFilmicToneMapping
        toneMappingExposure: 1.2,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <Environment preset="lobby" />
        
        {/* 基础光照 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffd700" />
        <pointLight position={[0, 5, 0]} intensity={1.5} color="#ffffff" />
        
        {/* 自动旋转容器 */}
        <AutoRotateGroup>
          <Foliage />
          <Ornaments />
          <TreeTrunk />
          <TreeStar />
          <PhotoFrames />
        </AutoRotateGroup>
        
        {/* 放大照片查看器 */}
        <FocusedPhotoViewer />
        
        {/* 心形飘落 */}
        <FallingHearts />
        
        {/* 后期处理 */}
        <EffectComposer>
          <Bloom
            intensity={0.3}
            luminanceThreshold={0.85}
            luminanceSmoothing={0.3}
            mipmapBlur={true}
          />
        </EffectComposer>
        
        {/* 轨道控制 */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={10}
          maxDistance={40}
        />
      </Suspense>
    </Canvas>
  );
}
