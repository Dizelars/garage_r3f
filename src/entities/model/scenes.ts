import type { FloorConfig, SceneConfig } from "entities/model/types";

const draco = "/draco/";
const garage = "/environmentMaps/jpg/garage.jpg";

function floor(
  tileMeters: number,
  slabs: number,
  normalScale: [number, number],
): FloorConfig {
  return {
    radius: 14,
    textureSize: 1024,
    tileMeters,
    slabs,
    y: 0.003,
    normalScale,
  };
}

const garageSky = {
  environment: garage,
  skyHeight: 2.5,
  skyRadius: 12,
  skyResolution: 17,
  environmentIntensity: 1,
  toneMappingExposure: 1.4,
  bloomEnabled: true,
  glow: 0.1,
  draco,
  reflection: null,
} as const;

export const sceneConfigs: Record<string, SceneConfig> = {
  moto: {
    ...garageSky,
    modelUrl: "models/moto/moto.gltf",
    modelScale: 2.6,
    modelPosition: [0.03, 0, 0],
    modelRotationY: -3.14,
    skyHeight: 2,
    skyRadius: 14,
    minDistance: 3.5,
    floor: floor(4, 8, [1.1, 1.1]),
  },
  velo: {
    ...garageSky,
    modelUrl: "models/velo/bicycle.gltf",
    modelScale: 3,
    modelPosition: [0, 0, 0],
    modelRotationY: 0,
    minDistance: 2.5,
    floor: floor(4, 8, [1.1, 1.1]),
  },
  bus: {
    ...garageSky,
    modelUrl: "models/bus/bus.gltf",
    modelScale: 3,
    modelPosition: [0, 0, 0],
    modelRotationY: 0,
    minDistance: 4.5,
    floor: floor(4, 14, [0.5, 0.5]),
  },
  moskvich: {
    ...garageSky,
    modelUrl: "models/moskvich/moskvich.gltf",
    modelScale: 3,
    modelPosition: [0, 0, 0],
    modelRotationY: 0,
    minDistance: 3.5,
    floor: floor(6, 12, [1.1, 1.1]),
  },
  pickup: {
    ...garageSky,
    modelUrl: "models/pickup/untitled.gltf",
    modelScale: 3,
    modelPosition: [0, 0, 0],
    modelRotationY: Math.PI,
    skyResolution: 32,
    minDistance: 4,
    floor: floor(6, 12, [0.5, 0.5]),
    animated: true,
    interestPoints: [
      {
        id: "lightbar",
        title: "Световая балка",
        description: "Проблесковая балка на крыше. Кнопка «Анимация» включает цикл вспышек.",
        position: [0.04, 2.15, 0.22],
      },
      {
        id: "front-strobes",
        title: "Передние модули",
        description: "Проблесковые модули над кабиной. Загораются своими кадрами того же цикла.",
        position: [0.04, 2.15, 1.95],
      },
      {
        id: "rear-strobes",
        title: "Задние секции",
        description: "Задние проблесковые секции. Нужны, чтобы обозначить патруль сзади.",
        position: [0.04, 1.05, -2.75],
      },
      {
        id: "cabin",
        title: "Кабина",
        description: "Место экипажа: регулировка движения на сложных участках и оформление европротокола.",
        position: [1.15, 1.35, 0.9],
      },
      {
        id: "bed",
        title: "Кузов",
        description: "Отсек с экипировкой: огнетушитель, аптечка, трос, домкрат и дорожные конусы.",
        position: [-1.15, 1.2, -0.6],
      },
    ],
  },
  kamaz: {
    ...garageSky,
    modelUrl: "models/kamaz/kamaz.gltf",
    modelScale: 4,
    modelPosition: [0.05, 0, 0.3],
    modelRotationY: -0.02,
    toneMappingExposure: 2,
    minDistance: 3.5,
    floor: floor(6, 14, [1.1, 1.1]),
  },
  kater: {
    ...garageSky,
    modelUrl: "models/kater/kater.gltf",
    environment: "/environmentMaps/jpg/dok_kater.jpg",
    modelScale: 3,
    modelPosition: [0, -0.44, 0.18],
    modelRotationY: 0,
    metalness: 1.5,
    skyHeight: 2,
    skyRadius: 14,
    minDistance: 4.5,
    floor: null,
    reflection: {
      mirrorY: 0.001,
      strength: 0.2,
      scale: 0.3,
    },
  },
};
