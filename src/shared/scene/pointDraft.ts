import type { Object3D } from "three";
import type { InterestPoint, Vec3 } from "entities/model/types";

export type { Vec3 };

export type PlacedPoint = {
  key: string;
  id: string;
  title: string;
  description: string;
  mesh: string;
  position: Vec3;
};

export type PointFieldPatch = {
  id: string;
  title: string;
  description: string;
  position: Vec3;
};

export type PointHover = {
  mesh: string;
  position: Vec3;
};

const storagePrefix = "interest-point-drafts:";

export function createPointKey(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function roundCoord(value: number): number {
  return Number(value.toFixed(2));
}

export function roundPosition(x: number, y: number, z: number): Vec3 {
  return [roundCoord(x), roundCoord(y), roundCoord(z)];
}

export function meshName(object: Object3D, root: Object3D): string {
  let current: Object3D | null = object;
  while (current && current !== root) {
    if (current.name) {
      return current.name;
    }
    current = current.parent;
  }
  return root.name || "point";
}

export function nextPointId(mesh: string, points: PlacedPoint[]): string {
  const base = mesh.trim().replace(/\s+/g, "-").toLowerCase() || "point";
  const taken = new Set(points.map((point) => point.id));
  if (!taken.has(base)) {
    return base;
  }
  let index = 2;
  while (taken.has(`${base}-${index}`)) {
    index += 1;
  }
  return `${base}-${index}`;
}

function escapeTs(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, "\\\"")
    .replace(/\r/g, "")
    .replace(/\n/g, "\\n");
}

export function formatPlacedPoint(point: PlacedPoint): string {
  const [x, y, z] = point.position;
  return [
    "      {",
    `        id: "${escapeTs(point.id)}",`,
    `        title: "${escapeTs(point.title)}",`,
    `        description: "${escapeTs(point.description)}",`,
    `        position: [${x}, ${y}, ${z}],`,
    "      },",
  ].join("\n");
}

export function formatPlacedPoints(points: PlacedPoint[]): string {
  return points.map((point) => formatPlacedPoint(point)).join("\n");
}

export function formatPosition(position: Vec3): string {
  return `[${position[0]}, ${position[1]}, ${position[2]}]`;
}

export function fromInterestPoints(points: InterestPoint[]): PlacedPoint[] {
  return points.map((point) => ({
    key: point.id,
    id: point.id,
    title: point.title,
    description: point.description,
    mesh: point.title,
    position: [point.position[0], point.position[1], point.position[2]],
  }));
}

function toInterestPoint(point: PlacedPoint): InterestPoint {
  return {
    id: point.id,
    title: point.title,
    description: point.description,
    position: [point.position[0], point.position[1], point.position[2]],
  };
}

export function visibleInterestPoints(
  configPoints: InterestPoint[] | undefined,
  drafts: PlacedPoint[],
  editingKey: string | null,
): InterestPoint[] {
  const editing = drafts.find((point) => point.key === editingKey) ?? null;
  const configIds = new Set((configPoints ?? []).map((point) => point.id));
  const overrides = new Map<string, PlacedPoint>();
  const extras: InterestPoint[] = [];

  drafts.forEach((point) => {
    if (point.key === editingKey) {
      return;
    }
    if (configIds.has(point.id)) {
      overrides.set(point.id, point);
      return;
    }
    extras.push(toInterestPoint(point));
  });

  const merged = (configPoints ?? []).flatMap((point) => {
    if (editing?.id === point.id) {
      return [];
    }
    const draft = overrides.get(point.id);
    return [draft ? toInterestPoint(draft) : point];
  });

  return [...merged, ...extras];
}

function isVec3(value: unknown): value is Vec3 {
  return Array.isArray(value)
    && value.length === 3
    && value.every((item) => typeof item === "number");
}

function readPoint(value: unknown, index: number): PlacedPoint | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const point = value as Record<string, unknown>;
  if (!isVec3(point.position)) {
    return null;
  }
  const mesh = typeof point.mesh === "string" && point.mesh ? point.mesh : "point";
  const id = typeof point.id === "string" && point.id ? point.id : mesh;
  const title = typeof point.title === "string" ? point.title : mesh;
  const description = typeof point.description === "string" ? point.description : "";
  const key = typeof point.key === "string" && point.key ? point.key : `${id}-${index}`;
  return {
    key,
    id,
    title,
    description,
    mesh,
    position: point.position,
  };
}

export function readPlacedPoints(modelUrl: string): PlacedPoint[] {
  try {
    const raw = sessionStorage.getItem(storagePrefix + modelUrl);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const used = new Set<string>();
    return parsed.flatMap((item, index) => {
      const point = readPoint(item, index);
      if (!point) {
        return [];
      }
      let key = point.key;
      while (used.has(key)) {
        key = `${key}-${used.size}`;
      }
      used.add(key);
      return [{ ...point, key }];
    });
  } catch {
    return [];
  }
}

export function writePlacedPoints(modelUrl: string, points: PlacedPoint[]): void {
  sessionStorage.setItem(storagePrefix + modelUrl, JSON.stringify(points));
}
