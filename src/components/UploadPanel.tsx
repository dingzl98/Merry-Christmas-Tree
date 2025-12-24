import { useStore } from '../store';

export function UploadPanel() {
  const setChaosMusic = useStore((state) => state.setChaosMusic);
  const setFormedMusic = useStore((state) => state.setFormedMusic);
  const chaosMusic = useStore((state) => state.chaosMusic);
  const formedMusic = useStore((state) => state.formedMusic);
  const treeState = useStore((state) => state.treeState);
  const photos = useStore((state) => state.photos);
  const focusedPhotoIndex = useStore((state) => state.focusedPhotoIndex);

  const handleChaosMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setChaosMusic(url);
    }
  };

  const handleFormedMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormedMusic(url);
    }
  };

  return (
    <div className="control-panel glass-panel">
      <h3 className="gold-text text-lg font-bold mb-4">控制面板</h3>
      
      {/* 状态显示 */}
      <div className="mb-4 p-2 rounded bg-black/30">
        <div className="text-sm text-gray-300">当前状态</div>
        <div className="gold-text font-bold">
          {treeState === 'CHAOS' ? '🌀 混沌模式' : '🎄 圣诞树模式'}
        </div>
      </div>

      {/* 手势提示 */}
      <div className="mb-4 p-2 rounded bg-black/30 text-sm text-gray-300">
        <div className="mb-1">✋ 张开手 → 混沌状态</div>
        <div>✊ 握拳 → 圣诞树状态</div>
      </div>

      {/* 音乐上传 */}
      <div className="mb-4">
        <div className="text-sm text-gray-300 mb-2">背景音乐</div>
        
        <div className="mb-2">
          <div className="file-input-wrapper">
            <button className="btn-gold text-sm">
              {chaosMusic ? '✓ 混沌音乐' : '上传混沌音乐'}
            </button>
            <input
              type="file"
              accept="audio/*"
              onChange={handleChaosMusicUpload}
            />
          </div>
        </div>
        
        <div>
          <div className="file-input-wrapper">
            <button className="btn-gold text-sm">
              {formedMusic ? '✓ 圣诞音乐' : '上传圣诞音乐'}
            </button>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFormedMusicUpload}
            />
          </div>
        </div>
      </div>

      {/* 照片信息 */}
      <div className="p-2 rounded bg-black/30 text-sm">
        <div className="text-gray-300 mb-1">照片: {photos.length} 张</div>
        {focusedPhotoIndex >= 0 && (
          <div className="text-gold-luxury">
            查看中: {focusedPhotoIndex + 1} / {photos.length}
          </div>
        )}
        <div className="text-gray-400 text-xs mt-1">
          混沌状态下点击查看照片<br />
          按 → 键切换照片
        </div>
      </div>
    </div>
  );
}
