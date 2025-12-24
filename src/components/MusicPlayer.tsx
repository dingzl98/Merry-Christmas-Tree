import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';

export function MusicPlayer() {
  const chaosAudioRef = useRef<HTMLAudioElement>(null);
  const formedAudioRef = useRef<HTMLAudioElement>(null);
  const treeState = useStore((state) => state.treeState);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 获取当前活动的音频元素
  const getCurrentAudio = () => {
    return treeState === 'CHAOS' ? chaosAudioRef.current : formedAudioRef.current;
  };

  const getOtherAudio = () => {
    return treeState === 'CHAOS' ? formedAudioRef.current : chaosAudioRef.current;
  };

  // 初始化时立即播放
    useEffect(() => {
      const timer = setTimeout(() => {
        const audio = getCurrentAudio();
        if (audio && isPlaying) {
          audio.play().catch(console.error);
        }
      }, 100);
      return () => clearTimeout(timer);
    }, []);
  
    // 状态切换时切换音乐
  useEffect(() => {
    const currentAudio = getCurrentAudio();
    const otherAudio = getOtherAudio();

    if (currentAudio && otherAudio) {
      // 暂停另一个
      otherAudio.pause();
      
      // 播放当前状态的音乐
      if (isPlaying) {
        currentAudio.play().catch(console.error);
      }
    }
  }, [treeState]);

  // 更新播放状态
  useEffect(() => {
    const currentAudio = getCurrentAudio();
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.play().catch(console.error);
      } else {
        currentAudio.pause();
      }
    }
  }, [isPlaying, treeState]);

  // 更新进度条
  useEffect(() => {
    const updateProgress = () => {
      const audio = getCurrentAudio();
      if (audio) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration || 0);
      }
    };

    const interval = setInterval(updateProgress, 100);
    return () => clearInterval(interval);
  }, [treeState]);

  // 切换播放/暂停
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  // 拖动进度条
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = getCurrentAudio();
    if (audio) {
      const newTime = parseFloat(e.target.value);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // 格式化时间
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* 隐藏的音频元素 */}
      <audio
        ref={chaosAudioRef}
        src="/music/天外来物.mp3"
        loop
        preload="auto"
      />
      <audio
        ref={formedAudioRef}
        src="/music/merryChristmas.mp3"
        loop
        preload="auto"
      />

      {/* 底部音乐控制栏 */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-panel px-6 py-3 flex items-center gap-4 z-50">
        {/* 播放/暂停按钮 */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-gold-luxury text-black flex items-center justify-center hover:scale-110 transition-transform"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        {/* 当前播放的音乐名称 */}
        <div className="text-gold-luxury text-sm min-w-[100px]">
          {treeState === 'CHAOS' ? '🌀 天外来物' : '🎄 Merry Christmas'}
        </div>

        {/* 进度条 */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs w-10">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            onClick={(e) => e.stopPropagation()}
            className="w-40 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-gold-luxury"
          />
          <span className="text-gray-400 text-xs w-10">{formatTime(duration)}</span>
        </div>
      </div>
    </>
  );
}
