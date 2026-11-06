import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export const sceneControls: { current: OrbitControlsImpl | null } = {
  current: null,
};
