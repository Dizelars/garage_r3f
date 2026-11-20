export function getCameraSettings(width: number): {
  position: [number, number, number];
  maxDistance: number;
} {
  if (width < 480) {
    return { position: [1.049, 0.961, 2.48], maxDistance: 2.8 };
  }

  if (width <= 1200) {
    return { position: [1.049, 0.961, 2.48], maxDistance: 2.8 };
  }

  return { position: [1.049, 0.961, 2.48], maxDistance: 2.8 };
}
