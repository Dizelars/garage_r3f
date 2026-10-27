export type Vec3 = [number, number, number];

export type FloorConfig = {
  radius: number;
  textureSize: number;
  tileMeters: number;
  slabs: number;
  y: number;
  normalScale: [number, number];
};

export type ReflectionConfig = {
  mirrorY: number;
  strength: number;
  scale: number;
};

export type InterestPoint = {
  id: string;
  title: string;
  description: string;
  position: Vec3;
};

export type SceneConfig = {
  modelUrl: string;
  draco: string;
  environment: string;
  modelScale: number;
  modelPosition: Vec3;
  modelRotationY: number;
  metalness?: number;
  skyHeight: number;
  skyRadius: number;
  skyResolution: number;
  environmentIntensity: number;
  toneMappingExposure: number;
  bloomEnabled: boolean;
  glow: number;
  minDistance: number;
  floor: FloorConfig | null;
  reflection: ReflectionConfig | null;
  animated?: boolean;
  interestPoints?: InterestPoint[];
};

export type OutfitItem = {
  src: string;
  alt: string;
  labelHtml: string;
};

export type GallerySlide = {
  href: string;
  src: string;
  alt: string;
  active: boolean;
};

export type InteriorContent = {
  id: string;
  title: string;
  enterLabel: string;
  exitLabel: string;
};

export type PageContent = {
  backHref: string;
  title: string;
  missionHtml: string;
  outfit: OutfitItem[];
  gallery: GallerySlide[];
  interior: InteriorContent | null;
  qrSrc: string;
  arSrc: string;
  panoramaHtml: string | null;
};

export type ModelPageData = PageContent & {
  id: string;
  scene: SceneConfig;
};
