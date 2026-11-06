export function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function roundVec(vector: { x: number; y: number; z: number }): [number, number, number] {
  return [round(vector.x), round(vector.y), round(vector.z)];
}

export function formatVec(vector: { x: number; y: number; z: number } | null | undefined): string {
  if (!vector) {
    return "—";
  }
  const [x, y, z] = roundVec(vector);
  return `${x}  ${y}  ${z}`;
}

export function copyJson(label: string, data: unknown): void {
  const text = JSON.stringify(data, null, 2);
  console.log(label, data);
  if (navigator.clipboard) {
    void navigator.clipboard.writeText(text);
  }
}
