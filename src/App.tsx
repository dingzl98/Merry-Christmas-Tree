import { useEffect } from 'react';
import { Scene } from './components/Scene';
import { GestureDetector } from './components/GestureDetector';
import { MusicPlayer } from './components/MusicPlayer';
import { useStore } from './store';

// 硬编码 public/img 文件夹中的照片
const LOCAL_PHOTOS = [
  '/img/微信图片_20251224182020_60_140.jpg',
  '/img/微信图片_20251224182021_61_140.jpg',
  '/img/微信图片_20251224182022_62_140.jpg',
  '/img/微信图片_20251224182022_63_140.jpg',
  '/img/微信图片_20251224182024_64_140.jpg',
  '/img/微信图片_20251224182025_65_140.jpg',
  '/img/微信图片_20251224182026_66_140.jpg',
  '/img/微信图片_20251224182027_67_140.jpg',
  '/img/微信图片_20251224201416_70_140.jpg',
  '/img/微信图片_20251224201418_71_140.jpg',
  '/img/微信图片_20251224201419_72_140.jpg',
  '/img/微信图片_20251224201420_73_140.jpg',
  '/img/微信图片_20251224201420_74_140.jpg',
  '/img/微信图片_20251224201421_75_140.jpg',
  '/img/微信图片_20251224201422_76_140.jpg',
  '/img/微信图片_20251224201535_77_140.jpg',
  '/img/微信图片_20251224201536_78_140.jpg',
  '/img/微信图片_20251224201537_79_140.jpg',
  '/img/微信图片_20251224201538_80_140.jpg',
  '/img/微信图片_20251224201539_81_140.jpg',
  '/img/微信图片_20251224201540_82_140.jpg',
  '/img/微信图片_20251224201541_83_140.jpg',
  '/img/微信图片_20251224201543_84_140.jpg',
  '/img/微信图片_20251224201544_85_140.jpg',
  '/img/微信图片_20251224203304_86_140.jpg',
  '/img/微信图片_20251224203305_87_140.jpg',
  '/img/微信图片_20251224203306_88_140.jpg',
  '/img/微信图片_20251224203307_89_140.jpg',
  '/img/微信图片_20251224203307_90_140.jpg',
  '/img/微信图片_20251224203308_91_140.jpg',
  '/img/微信图片_20251224203309_92_140.jpg',
  '/img/微信图片_20251224203310_93_140.jpg',
  '/img/微信图片_20251224203311_94_140.jpg',
  '/img/微信图片_20251224203544_95_140.jpg',
  '/img/微信图片_20251224203545_96_140.jpg',
  '/img/微信图片_20251224203547_97_140.jpg',
  '/img/微信图片_20251224203548_98_140.jpg',
  '/img/微信图片_20251224203548_99_140.jpg',
  '/img/微信图片_20251224203549_100_140.jpg',
  '/img/微信图片_20251224203550_101_140.jpg',
  '/img/微信图片_20251224203551_102_140.jpg',
  '/img/微信图片_20251224203551_103_140.jpg',
];

function App() {
  const setPhotos = useStore((state) => state.setPhotos);

  // 初始化照片
  useEffect(() => {
    if (LOCAL_PHOTOS.length > 0) {
      setPhotos(LOCAL_PHOTOS);
    }
  }, [setPhotos]);

  return (
    <div className="w-full h-full relative">
      {/* 3D 场景 */}
      <Scene />

      {/* 标题 */}
      <div className="title-container glass-panel">
        <h1 className="gold-text text-2xl font-bold glow">
          🎄 豪华互动圣诞树
        </h1>
      </div>

      {/* 手势检测 */}
      <GestureDetector />

      {/* 音乐播放器 */}
      <MusicPlayer />
    </div>
  );
}

export default App;
