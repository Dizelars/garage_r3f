import { getProject } from "@theatre/core";
import type { ISheet } from "@theatre/core";
import type { CameraControls } from "@react-three/drei";
import type { CameraShot } from "entities/model/types";
import { Vector3 } from "three";

const projectName = "garage";
const sheetName = "Scene";

export const cameraKey = "camera";
export const cameraTargetKey = "cameraTarget";

export type CameraPose = {
  position: [number, number, number];
  target: [number, number, number];
};

let projectSheet: ISheet | null = null;

export function getCameraSheet(): ISheet {
  if (!projectSheet) {
    projectSheet = getProject(projectName).sheet(sheetName);
  }
  return projectSheet;
}

const vecA = new Vector3();
const vecB = new Vector3();

export function captureCameraPose(controls: CameraControls): CameraPose {
  const pos = controls.getPosition(vecA, false);
  const tgt = controls.getTarget(vecB, false);
  return {
    position: [round(pos.x), round(pos.y), round(pos.z)],
    target: [round(tgt.x), round(tgt.y), round(tgt.z)],
  };
}

function round(value: number): number {
  return Number(value.toFixed(3));
}

function writeProxyPosition(key: string, position: [number, number, number]): void {
  const object = getCameraSheet().object(key, {});
  const current = object.value as Record<string, unknown>;
  object.initialValue = {
    ...current,
    position: { x: position[0], y: position[1], z: position[2] },
  } as typeof current;
}

// Переносит текущую позу камеры в theatre-прокси (camera + cameraTarget),
// чтобы записать её ключами на таймлайне.
export function setTheatreCameraValues(shot: CameraShot): void {
  writeProxyPosition(cameraKey, shot.position);
  writeProxyPosition(cameraTargetKey, shot.target);
}
