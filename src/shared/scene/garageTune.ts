export const roomPosition: [number, number, number] = [0, 0.12, 2.5];

export const spotColor = "#fff4e6";
export const spotCandela = 25;
export const spotDistance = 14;
export const spotAngle = Math.PI / 3;
export const spotPenumbra = 0.6;
export const spotDecay = 2;
export const spotOffset: [number, number, number] = [0, -0.08, 0];
export const lampGlow = 1;
export const fadeSeconds = 2;

export type CeilingTune = {
  led: number;
  followSwitch: boolean;
};

export function createCeilingTune(): CeilingTune {
  return {
    led: lampGlow,
    followSwitch: true,
  };
}
