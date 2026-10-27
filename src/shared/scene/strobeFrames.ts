import type { Object3D } from "three";

const framePattern = /^STROBE_(\d+)/;

export function collectStrobeFrames(root: Object3D): Object3D[][] {
  const frames = new Map<string, Object3D[]>();

  root.traverse((child) => {
    const match = framePattern.exec(child.name);
    const frame = match?.[1];
    if (!frame) {
      return;
    }

    const objects = frames.get(frame) ?? [];
    objects.push(child);
    frames.set(frame, objects);
  });

  return [...frames.keys()].sort().map((key) => frames.get(key) ?? []);
}

export function showStrobeFrame(frames: Object3D[][], index: number) {
  frames.forEach((objects, frameIndex) => {
    const visible = frameIndex === index;
    objects.forEach((object) => {
      object.visible = visible;
    });
  });
}
