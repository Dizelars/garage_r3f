import type { Object3D } from "three";

// rig живёт в userData неперечислимым: иначе Object3D.clone()
// (который копирует userData через JSON.stringify) падает
// на круговой ссылке rig -> light -> ... -> userData.
export function attachHiddenRig(object: Object3D, rig: unknown): void {
  Object.defineProperty(object.userData, "rig", {
    value: rig,
    enumerable: false,
    writable: true,
    configurable: true,
  });
}
