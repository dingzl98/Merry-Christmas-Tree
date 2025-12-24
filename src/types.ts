// 树状态类型
export type TreeState = 'CHAOS' | 'FORMED';

// 粒子数据
export interface ParticleData {
  chaosPosition: { x: number; y: number; z: number };
  targetPosition: { x: number; y: number; z: number };
  color: string;
}

// 装饰物类型
export type OrnamentType = 'gift' | 'ball' | 'light';

// 装饰物数据
export interface OrnamentData {
  id: number;
  type: OrnamentType;
  chaosPosition: { x: number; y: number; z: number };
  targetPosition: { x: number; y: number; z: number };
  color: string;
  scale: number;
}

// 照片数据
export interface PhotoData {
  id: number;
  url: string;
  chaosPosition: { x: number; y: number; z: number };
  targetPosition: { x: number; y: number; z: number };
}

// 应用状态
export interface AppState {
  treeState: TreeState;
  progress: number;
  photos: string[];
  chaosMusic: string | null;
  formedMusic: string | null;
  handOpen: boolean;
  focusedPhotoIndex: number;
  setTreeState: (state: TreeState) => void;
  setProgress: (progress: number) => void;
  addPhoto: (photo: string) => void;
  setPhotos: (photos: string[]) => void;
  setChaosMusic: (url: string | null) => void;
  setFormedMusic: (url: string | null) => void;
  setHandOpen: (open: boolean) => void;
  togglePhotoView: () => void;
  nextPhoto: () => void;
  prevPhoto: () => void;
}
