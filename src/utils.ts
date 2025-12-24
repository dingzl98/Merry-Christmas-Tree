// 工具函数

// 混沌位置：球形随机分布
export function generateChaosPosition(radius: number = 25) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = radius * Math.cbrt(Math.random());
  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.sin(phi) * Math.sin(theta),
    z: r * Math.cos(phi),
  };
}

// 圣诞树位置：使用黄金角分布的圆锥形
export function generateTreePosition(
  index: number,
  total: number,
  treeHeight: number = 14,
  baseRadius: number = 5
) {
  const layers = 40;
  const layer = Math.floor((index / total) * layers);
  const normalizedLayer = layer / layers;
  const y = normalizedLayer * treeHeight - treeHeight / 2;
  const radiusAtHeight = baseRadius * Math.pow(1 - normalizedLayer, 1.2);
  const goldenAngle = 137.5077640500378;
  const angle = (index * goldenAngle * Math.PI) / 180;
  const normalizedIndex = (index % Math.ceil(total / layers)) / Math.ceil(total / layers);
  const r = Math.pow(normalizedIndex, 0.5) * radiusAtHeight;
  return {
    x: r * Math.cos(angle),
    y: y,
    z: r * Math.sin(angle),
  };
}

// 生成随机颜色（五颜六色）
export function generateFoliageColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8B500', '#FF69B4', '#00CED1', '#32CD32', '#FFD700',
    '#FF4500', '#DA70D6', '#00FA9A', '#FF1493', '#7B68EE'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 生成装饰物颜色
export function generateOrnamentColor(type: 'gift' | 'ball' | 'light'): string {
  const colorSets = {
    gift: ['#DC143C', '#FFD700', '#228B22', '#8B0000', '#B22222'],
    ball: ['#FFD700', '#FF6347', '#4169E1', '#32CD32', '#FF69B4', '#9400D3', '#00CED1', '#FF4500', '#C0C0C0'],
    light: ['#FFD700', '#FFFACD', '#FFF8DC', '#FFEFD5', '#FFE4B5'],
  };
  const colors = colorSets[type];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 线性插值
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

// 向量线性插值
export function lerpVector3(
  start: { x: number; y: number; z: number },
  end: { x: number; y: number; z: number },
  t: number
) {
  return {
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t),
    z: lerp(start.z, end.z, t),
  };
}

// 随机旋转轴
export function randomAxis() {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  return {
    x: Math.sin(phi) * Math.cos(theta),
    y: Math.sin(phi) * Math.sin(theta),
    z: Math.cos(phi),
  };
}

// 颜色转换为 RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0.4, b: 0 };
}
