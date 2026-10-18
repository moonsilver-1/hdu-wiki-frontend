// vanta 无官方类型声明；这里声明两个 dist 入口，避免 TS7016 并收敛 `any` 面。
// 本文件为脚本（非模块），顶层 interface 直接进入全局作用域，
// `declare module` 作为环境模块声明被 tsc 正确拾取。

interface VantaBird {
  geometry: {
    attributes: { position: { count: number } };
    setAttribute: (name: string, attr: unknown) => void;
  };
  material: { vertexColors?: boolean; needsUpdate?: boolean };
}

interface VantaBirdsInstance {
  birds: VantaBird[];
  getNewCol: (t: number) => { r: number; g: number; b: number };
  destroy: () => void;
}

interface VantaCloudsInstance {
  destroy: () => void;
}

interface VantaCloudsOptions {
  el: HTMLElement;
  THREE: unknown;
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  minHeight?: number;
  minWidth?: number;
  skyColor?: number;
  cloudColor?: number;
  cloudShadowColor?: number;
  sunColor?: number;
  sunGlareColor?: number;
  sunlightColor?: number;
  scale?: number;
  scaleMobile?: number;
  speed?: number;
}

interface VantaBirdsOptions {
  el: HTMLElement;
  THREE: unknown;
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  scale?: number;
  scaleMobile?: number;
  backgroundColor?: number;
  backgroundAlpha?: number;
  color1?: number;
  color2?: number;
  colorMode?: string;
  birdSize?: number;
  wingSpan?: number;
  speedLimit?: number;
  separation?: number;
  alignment?: number;
  cohesion?: number;
  quantity?: number;
}

// 观猹文化墙：全局图片预览入口，供子组件 <img> 触发主组件预览层
interface Window {
  __previewImage?: (src: string) => void;
}

declare module 'vanta/dist/vanta.clouds.min' {
  const CLOUDS: (opts: VantaCloudsOptions) => VantaCloudsInstance;
  export default CLOUDS;
}

declare module 'vanta/dist/vanta.birds.min' {
  const BIRDS: (opts: VantaBirdsOptions) => VantaBirdsInstance;
  export default BIRDS;
}
