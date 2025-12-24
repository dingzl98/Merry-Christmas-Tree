import { create } from 'zustand';
import { AppState, TreeState } from './types';

export const useStore = create<AppState & { showHearts: boolean; setShowHearts: (show: boolean) => void }>((set, get) => ({
  treeState: 'FORMED',
  progress: 1,
  photos: [],
  chaosMusic: null,
  formedMusic: null,
  handOpen: false,
  focusedPhotoIndex: -1,
  showHearts: false,

  setTreeState: (state: TreeState) => set({ treeState: state }),
  
  setProgress: (progress: number) => set({ progress }),
  
  addPhoto: (photo: string) => set((state) => ({ photos: [...state.photos, photo] })),
  
  setPhotos: (photos: string[]) => set({ photos }),
  
  setChaosMusic: (url: string | null) => set({ chaosMusic: url }),
  
  setFormedMusic: (url: string | null) => set({ formedMusic: url }),
  
  setHandOpen: (open: boolean) => {
    const currentState = get();
    if (open !== currentState.handOpen) {
      set({ 
        handOpen: open,
        treeState: open ? 'CHAOS' : 'FORMED'
      });
    }
  },

  setShowHearts: (show: boolean) => set({ showHearts: show }),
  
  togglePhotoView: () => {
    const state = get();
    if (state.focusedPhotoIndex === -1 && state.photos.length > 0) {
      // 随机选择一张照片
      const randomIndex = Math.floor(Math.random() * state.photos.length);
      set({ focusedPhotoIndex: randomIndex });
    } else {
      set({ focusedPhotoIndex: -1 });
    }
  },
  
  nextPhoto: () => {
    const state = get();
    if (state.photos.length > 0 && state.focusedPhotoIndex >= 0) {
      // 随机选择下一张（避免重复）
      let newIndex = Math.floor(Math.random() * state.photos.length);
      if (state.photos.length > 1) {
        while (newIndex === state.focusedPhotoIndex) {
          newIndex = Math.floor(Math.random() * state.photos.length);
        }
      }
      set({ focusedPhotoIndex: newIndex });
    }
  },
  
  prevPhoto: () => {
    const state = get();
    if (state.photos.length > 0 && state.focusedPhotoIndex >= 0) {
      set({ 
        focusedPhotoIndex: (state.focusedPhotoIndex - 1 + state.photos.length) % state.photos.length 
      });
    }
  },
}));
