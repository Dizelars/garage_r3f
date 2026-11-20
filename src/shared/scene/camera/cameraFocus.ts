import type { Box3, Object3D } from "three";
import type { CameraLock, CameraShot } from "entities/model/types";

export type CameraFit = {
  target: Object3D | Box3;
  cover?: boolean;
  padding?: number;
  lock?: CameraLock | null;
};

export type CameraEvent =
  | { kind: "focus"; token: number; shot: CameraShot; lock: CameraLock | null }
  | { kind: "fit"; token: number; fit: CameraFit }
  | { kind: "release"; token: number };

const listeners = new Set<(event: CameraEvent) => void>();
let token = 0;

function emit(event: CameraEvent): void {
  listeners.forEach((listener) => {
    listener(event);
  });
}

export function focusCamera(shot: CameraShot, lock: CameraLock | null = null): void {
  token += 1;
  emit({ kind: "focus", token, shot, lock });
}

export function fitCamera(target: Object3D | Box3, options: Omit<CameraFit, "target"> = {}): void {
  token += 1;
  emit({
    kind: "fit",
    token,
    fit: {
      target,
      cover: options.cover,
      padding: options.padding,
      lock: options.lock ?? null,
    },
  });
}

export function releaseCamera(): void {
  token += 1;
  emit({ kind: "release", token });
}

export function subscribeCameraFocus(listener: (event: CameraEvent) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
