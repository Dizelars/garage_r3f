type Vec3 = [number, number, number];

export type SpotLightPose = {
  enabled?: boolean;
  color?: string;
  intensity?: number;
  distance?: number;
  angle?: number;
  penumbra?: number;
  decay?: number;
  position?: Vec3;
  rotation?: Vec3;
};

export type NeonLightPose = {
  enabled?: boolean;
  color?: string;
  intensity?: number;
  width?: number;
  height?: number;
  position?: Vec3;
  rotation?: Vec3;
};

// null = все ноды из gltf. Список имён = только эти источники.
export const spotSources: string[] | null = null;
export const neonSources: string[] | null = null;

// Вставка из кнопки «копировать». position спота — метры от ноды Ceilinglight_*.
// rotation спота — градусы; если поля нет, луч смотрит вниз.
// position неона — метры от трубки. rotation неона — градусы поверх прицела внутрь гаража.
export const spotPoses: Record<string, SpotLightPose> = {
  Ceilinglight_1: {
    enabled: false,
    color: "#fff4e6",
    intensity: 25,
    distance: 14,
    angle: 59.99999999999999,
    penumbra: 0.6,
    decay: 2,
    position: [0, -0.08, 0],
    rotation: [0, 0, 0],
  },
  Ceilinglight_2: {
    enabled: true,
    color: "#ffffff",
    intensity: 10,
    distance: 3,
    angle: 16.69999999999999,
    penumbra: 0.5,
    decay: 2,
    position: [-0.028971312739348432, -0.04430135661646806, -0.25],
    rotation: [-45.07945944316286, 19.143945758417264, 0.8583083021080783],
  },
  Ceilinglight_3: {
    enabled: false,
    color: "#fff4e6",
    intensity: 25,
    distance: 14,
    angle: 59.99999999999999,
    penumbra: 0.6,
    decay: 2,
    position: [0, -0.08, 0],
    rotation: [0, 0, 0],
  },
  Ceilinglight_4: {
    enabled: false,
    color: "#fff4e6",
    intensity: 25,
    distance: 14,
    angle: 59.99999999999999,
    penumbra: 0.6,
    decay: 2,
    position: [0, -0.08, 0],
    rotation: [0, 0, 0],
  },
  Ceilinglight_5: {
    enabled: false,
    color: "#fff4e6",
    intensity: 10,
    distance: 14,
    angle: 59.99999999999999,
    penumbra: 0.6,
    decay: 2,
    position: [0, -0.08, 0],
    rotation: [0, 0, 0],
  },
  Ceilinglight_6: {
    enabled: false,
    color: "#fff4e6",
    intensity: 25,
    distance: 14,
    angle: 59.99999999999999,
    penumbra: 0.6,
    decay: 2,
    position: [0, -0.08, 0],
    rotation: [0, 0, 0],
  },
  Ceilinglight_7: {
    enabled: true,
    color: "#fff4e6",
    intensity: 10,
    distance: 3,
    angle: 23,
    penumbra: 0.5,
    decay: 2,
    position: [0, -0.08, 0.5],
    rotation: [40.871155966384315, 7.588406084965217, 11.973079304542145],
  },
  Ceilinglight_8: {
    enabled: true,
    color: "#fff4e6",
    intensity: 10,
    distance: 3,
    angle: 59.99999999999999,
    penumbra: 0.6,
    decay: 2,
    position: [0, -0.08, 0],
    rotation: [0, 0, 0],
  },
  Ceilinglight_9: {
    enabled: false,
    color: "#fff4e6",
    intensity: 25,
    distance: 14,
    angle: 59.99999999999999,
    penumbra: 0.6,
    decay: 2,
    position: [0, -0.08, 0],
    rotation: [0, 0, 0],
  },
  Ceilinglight_10: {
    enabled: false,
    color: "#fff4e6",
    intensity: 25,
    distance: 14,
    angle: 59.99999999999999,
    penumbra: 0.6,
    decay: 2,
    position: [0, -0.08, 0],
    rotation: [0, 0, 0],
  },
  Ceilinglight_11: {
    enabled: false,
    color: "#fff4e6",
    intensity: 25,
    distance: 14,
    angle: 59.99999999999999,
    penumbra: 0.6,
    decay: 2,
    position: [0, -0.08, 0],
    rotation: [0, 0, 0],
  },
  Ceilinglight_12: {
    enabled: false,
    color: "#fff4e6",
    intensity: 25,
    distance: 14,
    angle: 59.99999999999999,
    penumbra: 0.6,
    decay: 2,
    position: [0, -0.08, 0],
    rotation: [0, 0, 0],
  },
  Ceilinglight_13: {
    enabled: false,
    color: "#fff4e6",
    intensity: 25,
    distance: 14,
    angle: 59.99999999999999,
    penumbra: 0.6,
    decay: 2,
    position: [0, -0.08, 0],
    rotation: [0, 0, 0],
  },
  Ceilinglight_14: {
    enabled: false,
    color: "#fff4e6",
    intensity: 25,
    distance: 14,
    angle: 59.99999999999999,
    penumbra: 0.6,
    decay: 2,
    position: [0, -0.08, 0],
    rotation: [0, 0, 0],
  },
  Ceilinglight_15: {
    enabled: false,
    color: "#fff4e6",
    intensity: 25,
    distance: 14,
    angle: 59.99999999999999,
    penumbra: 0.6,
    decay: 2,
    position: [0, -0.08, 0],
    rotation: [0, 0, 0],
  },
  Ceilinglight_16: {
    enabled: false,
    color: "#fff4e6",
    intensity: 25,
    distance: 14,
    angle: 59.99999999999999,
    penumbra: 0.6,
    decay: 2,
    position: [0, -0.08, 0],
    rotation: [0, 0, 0],
  },
  Ceilinglight_17: {
    enabled: false,
    color: "#fff4e6",
    intensity: 25,
    distance: 14,
    angle: 59.99999999999999,
    penumbra: 0.6,
    decay: 2,
    position: [0, -0.08, 0],
    rotation: [0, 0, 0],
  },
  Ceilinglight_18: {
    enabled: false,
    color: "#fff4e6",
    intensity: 25,
    distance: 14,
    angle: 59.99999999999999,
    penumbra: 0.6,
    decay: 2,
    position: [0, -0.08, 0],
    rotation: [0, 0, 0],
  },
};

export const neonPoses: Record<string, NeonLightPose> = {
  Neon1: {
    enabled: true,
    color: "#FFF5E4",
    intensity: 90,
    width: 0.04,
    position: [
      0.006578896894271935, -0.12859486912955864, 0.0067012751535795445,
    ],
    rotation: [-0.12150754191874995, -22.618344532597057, -179.82012542684015],
  },
  Neon2: {
    enabled: true,
    color: "#FFF5E4",
    intensity: 90,
    width: 0.04,
    position: [
      0.0053285643545248895, -0.011558819780320473, -1.018131217046982,
    ],
    rotation: [138.2242934482479, -77.32647406223872, -0.24211574214214587],
  },
  Neon3: {
    enabled: true,
    color: "#FFF5E4",
    intensity: 90,
    width: 0.04,
    height: 1.2993792166610483,
    position: [0, -0.13809489596512925, 0],
    rotation: [0, 21.93781417464671, 0],
  },
  Neon4: {
    enabled: true,
    color: "#FFF5E4",
    intensity: 90,
    width: 0.04,
    height: 9.630186713810218,
    position: [
      -0.05530334778012813, -0.003229033715464791, -0.9900388101565225,
    ],
    rotation: [-36.843660604647084, 89.06847178742365, -3.141876722798392],
  },
  Neon5: {
    enabled: true,
    color: "#FFF5E4",
    intensity: 90,
    width: 0.04,
    position: [
      0.0013261043354622082, -0.11951534722192236, 0.012954691475886904,
    ],
    rotation: [0, 55.373526584028724, 0],
  },
  Neon6: {
    enabled: true,
    color: "#FFF5E4",
    intensity: 90,
    width: 0.04,
    height: 1.2993792166610483,
    position: [
      0.001903948998373206, -0.133793127854277, -0.00016184084143944233,
    ],
    rotation: [0, -50.21126291879258, 0],
  },
};

export function keepSource(
  name: string,
  sources: readonly string[] | null,
): boolean {
  if (!sources) {
    return true;
  }
  return sources.includes(name);
}
