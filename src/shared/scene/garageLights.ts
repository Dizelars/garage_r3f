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
  // Ceilinglight_1: {
  //   intensity: 25,
  //   position: [0, -0.08, 0],
  //   rotation: [0, 0, 0],
  // },
};

export const neonPoses: Record<string, NeonLightPose> = {
  Neon1: {
    intensity: 200,
    width: 0.04,
    position:  [
      0.006578896894271935,
      -0.12859486912955864,
      0.0067012751535795445
    ],
    rotation: [
      -0.12150754191874995,
      -22.618344532597057,
      -179.82012542684015
    ],
  },
  Neon2: {
    intensity: 200,
    width: 0.04,
    position: [
      0.0053285643545248895,
      -0.011558819780320473,
      -1.018131217046982
    ],
    rotation: [
      138.2242934482479,
      -77.32647406223872,
      -0.24211574214214587
    ],
  },
  Neon5: {
    intensity: 200,
    width: 0.04,
    position: [
      0.0013261043354622082,
      -0.11951534722192236,
      0.012954691475886904
    ],
    rotation: [
      0,
      55.373526584028724,
      0
    ],
  },
};

export function keepSource(name: string, sources: readonly string[] | null): boolean {
  if (!sources) {
    return true;
  }
  return sources.includes(name);
}
