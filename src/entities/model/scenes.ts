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
  glow: 0.01,
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
    interestPoints: [
      {
        id: "сases",
        title: "Кофры",
        description: "Ремонтный комплект для велосипеда и Аптечка",
        position: [0, 0.38, -0.23],
      },
    ],
  },
  bus: {
    ...garageSky,
    modelUrl: "models/bus/bus.gltf",
    modelScale: 3,
    modelPosition: [0, 0, 0],
    modelRotationY: 0,
    minDistance: 4.5,
    floor: floor(4, 14, [0.5, 0.5]),
    interestPoints: [
      {
        id: "сamera_extension",
        title: "Камера на задней пристройке",
        description: "Цифровая телескопическая система",
        position: [0.2, 0.42, -1.28],
      },
      {
        id: "television_inspection_cameras",
        title: "Камеры по периметру",
        description: "Камеры телеобзора",
        position: [0.26, 0.55, 0],
      },
      {
        id: "thermal_camera",
        title: "Камера над лобовым",
        description: "Тепловизор",
        position: [0.1, 0.53, 0.93],
      },
      {
        id: "telecommunications_equipment",
        title: "Телекоммуникационное оборудование",
        description: "Комплекс аппаратных средств и сетевых систем, который обеспечивает сбор, передачу и обработку информации с улиц города в единый ситуационный центр",
        position: [0.06, 0.61, 0.45],
      },
    ],
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
        id: "roof_screen",
        title: "Экран на крыше",
        description: "Табло отображение информации",
        position: [0, 0.68, 0.73],
      },
      {
        id: "winch",
        title: "Лебедка",
        description: "Тяговое устройство, предназначенное для самостоятельного вытаскивания застрявшего автомобиля и буксировки техники",
        position: [-0.06, 0.19, -0.89],
      },
      {
        id: "flashing_beacons",
        title: "Проблесковые маячки",
        description: "Служит для предупреждения других участников движения об опасности и обозначения дорожных или коммунальных работ",
        position: [-0.02, 0.65, 0.07],
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
    interestPoints: [
      {
        id: "audible_warn_system",
        title: "Сигнальная громкоговорящая установка",
        description: "Подача звуковых и световых сигналов для привлечения внимания других судов, катеров, гидроциклов и пловцов",
        position: [0.02, 0.86, -0.08],
      },
    ],
  },
};
