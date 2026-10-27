import {
  CanvasTexture,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
} from "three";

export type ConcreteTextures = {
  map: Texture;
  normalMap: Texture;
  roughnessMap: Texture;
};

function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function createNoise(size: number, cells: number, seed: number): Float32Array {
  const random = createRandom(seed);
  const grid = new Float32Array(cells * cells);
  for (let index = 0; index < grid.length; index += 1) {
    grid[index] = random();
  }

  const output = new Float32Array(size * size);
  const smooth = (value: number) => value * value * (3 - 2 * value);

  for (let y = 0; y < size; y += 1) {
    const fy = (y / size) * cells;
    const y0 = Math.floor(fy);
    const ty = smooth(fy - y0);
    const ya = y0 % cells;
    const yb = (y0 + 1) % cells;

    for (let x = 0; x < size; x += 1) {
      const fx = (x / size) * cells;
      const x0 = Math.floor(fx);
      const tx = smooth(fx - x0);
      const xa = x0 % cells;
      const xb = (x0 + 1) % cells;
      const top = grid[ya * cells + xa] * (1 - tx) + grid[ya * cells + xb] * tx;
      const bottom = grid[yb * cells + xa] * (1 - tx) + grid[yb * cells + xb] * tx;
      output[y * size + x] = top * (1 - ty) + bottom * ty;
    }
  }

  return output;
}

function requireContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Не удалось получить 2d-контекст");
  }
  return context;
}

export function makeConcrete(
  size: number,
  tileMeters: number,
  slabs: number,
  anisotropy: number,
): ConcreteTextures {
  const octaves: Array<[Float32Array, number]> = [
    [4, 0.3, 11],
    [12, 0.22, 12],
    [30, 0.18, 13],
    [72, 0.14, 14],
    [165, 0.1, 15],
    [384, 0.06, 16],
  ].map(([cells, weight, seed]) => [createNoise(size, cells, seed), weight]);

  const blotch = createNoise(size, 8, 99);
  const pores = createNoise(size, 270, 77);
  const fine = createNoise(size, 768, 55);
  const height = new Float32Array(size * size);
  const pore = new Float32Array(size * size);

  for (let index = 0; index < size * size; index += 1) {
    let value = 0;
    for (const [noise, weight] of octaves) {
      value += noise[index] * weight;
    }
    pore[index] = Math.min(1, Math.max(0, (pores[index] - 0.84) * 4));
    height[index] = value - pore[index] * 0.45 + (fine[index] - 0.5) * 0.05;
  }

  const slabMeters = tileMeters / slabs;
  const jointWidth = 0.007;
  const random = createRandom(2024);
  const slabTone: number[] = [];
  const slabRough: number[] = [];
  const slabStep: number[] = [];

  for (let index = 0; index < slabs * slabs; index += 1) {
    slabTone.push((random() - 0.5) * 16);
    slabRough.push((random() - 0.5) * 0.14);
    slabStep.push((random() - 0.5) * 0.1);
  }

  const joint = new Float32Array(size * size);
  const tone = new Float32Array(size * size);
  const rough = new Float32Array(size * size);

  for (let y = 0; y < size; y += 1) {
    const vy = (y / size) * slabs;
    const sy = Math.floor(vy);
    const fy = vy - sy;
    const dv = Math.min(fy, 1 - fy) * slabMeters;

    for (let x = 0; x < size; x += 1) {
      const ux = (x / size) * slabs;
      const sx = Math.floor(ux);
      const fx = ux - sx;
      const du = Math.min(fx, 1 - fx) * slabMeters;
      const index = y * size + x;
      const id = sy * slabs + sx;
      const distance = Math.min(du, dv);

      tone[index] = slabTone[id];
      rough[index] = slabRough[id];
      height[index] += slabStep[id];

      if (distance < jointWidth) {
        const t = 1 - distance / jointWidth;
        const edge = t * t * (3 - 2 * t);
        joint[index] = edge;
        height[index] -= edge * 0.5;
      } else if (distance < jointWidth * 2.2) {
        height[index] -= (1 - (distance - jointWidth) / (jointWidth * 1.2)) * 0.06;
      }
    }
  }

  const createCanvas = () => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    return canvas;
  };

  const albedoCanvas = createCanvas();
  const normalCanvas = createCanvas();
  const roughnessCanvas = createCanvas();
  const albedoImage = requireContext(albedoCanvas).createImageData(size, size);
  const normalImage = requireContext(normalCanvas).createImageData(size, size);
  const roughnessImage = requireContext(roughnessCanvas).createImageData(size, size);
  const slope = 9;
  const sample = (x: number, y: number) => height[((y + size) % size) * size + ((x + size) % size)];

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = y * size + x;
      const channel = index * 4;
      const nx = -(sample(x + 1, y) - sample(x - 1, y)) * slope;
      const ny = (sample(x, y + 1) - sample(x, y - 1)) * slope;
      const length = Math.hypot(nx, ny, 1);

      normalImage.data[channel] = ((nx / length) * 0.5 + 0.5) * 255;
      normalImage.data[channel + 1] = ((ny / length) * 0.5 + 0.5) * 255;
      normalImage.data[channel + 2] = ((1 / length) * 0.5 + 0.5) * 255;
      normalImage.data[channel + 3] = 255;

      const shade = 70 + tone[index] + (blotch[index] - 0.5) * 26
        + (height[index] - 0.5) * 36 - pore[index] * 22 - joint[index] * 34;

      albedoImage.data[channel] = shade;
      albedoImage.data[channel + 1] = shade * 0.99;
      albedoImage.data[channel + 2] = shade * 0.96;
      albedoImage.data[channel + 3] = 255;

      const roughness = Math.max(0, Math.min(1,
        0.6 + rough[index] + (blotch[index] - 0.5) * 0.3
        + (0.5 - height[index]) * 0.45 + pore[index] * 0.2 + joint[index] * 0.3,
      ));

      roughnessImage.data[channel] = 255;
      roughnessImage.data[channel + 1] = roughness * 255;
      roughnessImage.data[channel + 2] = 0;
      roughnessImage.data[channel + 3] = 255;
    }
  }

  requireContext(albedoCanvas).putImageData(albedoImage, 0, 0);
  requireContext(normalCanvas).putImageData(normalImage, 0, 0);
  requireContext(roughnessCanvas).putImageData(roughnessImage, 0, 0);

  const createTexture = (canvas: HTMLCanvasElement, srgb: boolean) => {
    const texture = new CanvasTexture(canvas);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.anisotropy = anisotropy;
    if (srgb) {
      texture.colorSpace = SRGBColorSpace;
    }
    return texture;
  };

  return {
    map: createTexture(albedoCanvas, true),
    normalMap: createTexture(normalCanvas, false),
    roughnessMap: createTexture(roughnessCanvas, false),
  };
}

export function createRadialTexture(
  size: number,
  stops: Array<[number, string]>,
): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = requireContext(canvas);
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([offset, color]) => {
    gradient.addColorStop(offset, color);
  });
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}
