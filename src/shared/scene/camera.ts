export function getCameraSettings(width: number): {
  position: [number, number, number];
  maxDistance: number;
} {
  if (width < 480) {
    return { position: [4.7, 3.1, 8.5], maxDistance: 10 };
  }

  if (width <= 1200) {
    return { position: [3.2, 2.3, 5.6], maxDistance: 8 };
  }

  return { position: [2.5, 2, 4.5], maxDistance: 6 };
}
