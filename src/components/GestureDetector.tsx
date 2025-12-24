import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';

// MediaPipe Hands 类型定义
interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

interface HandsResults {
  multiHandLandmarks?: HandLandmark[][];
}

export function GestureDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const setHandOpen = useStore((state) => state.setHandOpen);
  const setShowHearts = useStore((state) => state.setShowHearts);
  const handOpen = useStore((state) => state.handOpen);
  const showHearts = useStore((state) => state.showHearts);

  // 手动切换状态
  const toggleHandState = () => {
    setHandOpen(!handOpen);
  };

  // 检测手是否张开
  const detectHandOpen = (landmarks: HandLandmark[]): boolean => {
    // 检测每根手指是否伸开
    // 食指伸开：指尖(8)比中节(6)更高
    const indexUp = landmarks[8].y < landmarks[6].y;
    // 中指伸开
    const middleUp = landmarks[12].y < landmarks[10].y;
    // 无名指伸开
    const ringUp = landmarks[16].y < landmarks[14].y;
    // 小指伸开
    const pinkyUp = landmarks[20].y < landmarks[18].y;
    
    // 至少3根手指伸开就认为是张开状态
    const fingersUp = [indexUp, middleUp, ringUp, pinkyUp].filter(Boolean).length;
    return fingersUp >= 3;
  };

  // 检测"爱你"手势（大拇指、食指、小拇指竖起，中指和无名指弯曲）
  const detectLoveGesture = (landmarks: HandLandmark[]): boolean => {
    // 大拇指竖起：指尖(4)比指根(2)更高（y更小）或更远离掌心
    const thumbUp = landmarks[4].y < landmarks[2].y || 
                    Math.abs(landmarks[4].x - landmarks[0].x) > 0.1;
    
    // 食指竖起：指尖(8)比指根(5)更高
    const indexUp = landmarks[8].y < landmarks[5].y;
    
    // 中指弯曲：指尖(12)比指根(9)更低或相近
    const middleDown = landmarks[12].y > landmarks[10].y;
    
    // 无名指弯曲：指尖(16)比指根(13)更低或相近
    const ringDown = landmarks[16].y > landmarks[14].y;
    
    // 小拇指竖起：指尖(20)比指根(17)更高
    const pinkyUp = landmarks[20].y < landmarks[17].y;
    
    return thumbUp && indexUp && middleDown && ringDown && pinkyUp;
  };

  // 绘制手部关键点
  const drawLandmarks = (
    ctx: CanvasRenderingContext2D,
    landmarks: HandLandmark[],
    width: number,
    height: number
  ) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffd700';
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;

    // 绘制关键点
    landmarks.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x * width, point.y * height, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // 绘制连线
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [5, 9], [9, 10], [10, 11], [11, 12],
      [9, 13], [13, 14], [14, 15], [15, 16],
      [13, 17], [17, 18], [18, 19], [19, 20],
      [0, 17]
    ];

    connections.forEach(([start, end]) => {
      ctx.beginPath();
      ctx.moveTo(landmarks[start].x * width, landmarks[start].y * height);
      ctx.lineTo(landmarks[end].x * width, landmarks[end].y * height);
      ctx.stroke();
    });
  };

  useEffect(() => {
    let hands: any = null;
    let camera: any = null;

    const initializeHands = async () => {
      try {
        // 动态导入 MediaPipe
        const { Hands } = await import('@mediapipe/hands');
        const { Camera } = await import('@mediapipe/camera_utils');

        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // 初始化 Hands
        hands = new Hands({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          },
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: HandsResults) => {
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            const isOpen = detectHandOpen(landmarks);
            const isLove = detectLoveGesture(landmarks);
            setHandOpen(isOpen);
            setShowHearts(isLove);
            drawLandmarks(ctx, landmarks, canvas.width, canvas.height);
          } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        });

        // 初始化摄像头
        camera = new Camera(video, {
          onFrame: async () => {
            await hands.send({ image: video });
          },
          width: 320,
          height: 240,
        });

        await camera.start();
        setIsInitialized(true);
        setStatus('ready');
      } catch (error) {
        console.error('Failed to initialize gesture detection:', error);
        setStatus('error');
      }
    };

    initializeHands();

    return () => {
      if (camera) {
        camera.stop();
      }
      if (hands) {
        hands.close();
      }
    };
  }, [setHandOpen, setShowHearts]);

  return (
    <div className="camera-container glass-panel">
      <video
        ref={videoRef}
        style={{ transform: 'scaleX(-1)' }}
        autoPlay
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        width={320}
        height={240}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'scaleX(-1)',
        }}
      />
      
      {/* 状态指示器 - 可点击切换 */}
      <div
        onClick={toggleHandState}
        className={`status-indicator absolute bottom-2 left-2 cursor-pointer active:scale-95 ${
          showHearts ? 'status-love' : handOpen ? 'status-open' : 'status-closed'
        }`}
      >
        <span>{showHearts ? '❤️ 爱你' : handOpen ? '✋ 张开' : '✊ 闭合'}</span>
      </div>

      {/* 加载状态 */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-gold-luxury text-sm pulse">初始化摄像头...</div>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-red-500 text-sm text-center p-2">
            无法访问摄像头<br />
            请检查权限设置
          </div>
        </div>
      )}
    </div>
  );
}
