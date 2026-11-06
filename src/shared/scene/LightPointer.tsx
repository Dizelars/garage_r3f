import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Object3D, Raycaster, Scene, Vector2, Vector3, type Camera } from "three";
import { sceneControls } from "./sceneControls";

export type HandRig = {
  light: Object3D;
  pick: Object3D[];
  dragging: boolean;
  getIntensity: () => number;
  setIntensity: (value: number) => void;
  readTransform: () => void;
  commit: () => void;
};

const raycaster = new Raycaster();
const pointer = new Vector2();
const worldPoint = new Vector3();
const right = new Vector3();
const up = new Vector3();

raycaster.params.Line.threshold = 0.12;

function rigFrom(object: Object3D | null): HandRig | null {
  let current = object;
  while (current) {
    const rig = current.userData.rig as HandRig | undefined;
    if (rig) {
      return rig;
    }
    current = current.parent;
  }
  return null;
}

function isShown(object: Object3D): boolean {
  let current: Object3D | null = object;
  while (current) {
    if (!current.visible) {
      return false;
    }
    current = current.parent;
  }
  return true;
}

function parentsVisible(object: Object3D): boolean {
  let current = object.parent;
  while (current) {
    if (!current.visible) {
      return false;
    }
    current = current.parent;
  }
  return true;
}

function handleAt(
  event: PointerEvent | WheelEvent,
  camera: Camera,
  dom: HTMLCanvasElement,
  scene: Scene,
): { pivot: true; rig: HandRig | null } | { pivot: false; rig: HandRig } | null {
  const rect = dom.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const targets: Object3D[] = [];
  scene.traverse((object) => {
    if (object.userData.pivot || object.userData.rig) {
      targets.push(object);
    }
  });
  const hits = raycaster.intersectObjects(targets, true);
  for (const hit of hits) {
    let current: Object3D | null = hit.object;
    while (current) {
      if (current.userData.pivot) {
        if (!parentsVisible(current)) {
          break;
        }
        return { pivot: true, rig: rigFrom(current) };
      }
      const rig = current.userData.rig as HandRig | undefined;
      if (rig && isShown(hit.object)) {
        return { pivot: false, rig };
      }
      current = current.parent;
    }
  }
  return null;
}

function moveLight(rig: HandRig, camera: Camera, dx: number, dy: number): void {
  const { light } = rig;
  light.getWorldPosition(worldPoint);
  right.setFromMatrixColumn(camera.matrixWorld, 0).normalize();
  up.setFromMatrixColumn(camera.matrixWorld, 1).normalize();
  const span = Math.max(camera.position.distanceTo(worldPoint), 0.5) * 0.0018;
  worldPoint.addScaledVector(right, dx * span);
  worldPoint.addScaledVector(up, -dy * span);
  const parent = light.parent;
  if (parent) {
    parent.worldToLocal(worldPoint);
  }
  light.position.copy(worldPoint);
}

function rotateLight(rig: HandRig, camera: Camera, dx: number, dy: number): void {
  up.setFromMatrixColumn(camera.matrixWorld, 1).normalize();
  right.setFromMatrixColumn(camera.matrixWorld, 0).normalize();
  rig.light.rotateOnWorldAxis(up, -dx * 0.008);
  rig.light.rotateOnWorldAxis(right, -dy * 0.008);
  rig.light.scale.set(1, 1, 1);
}

export function LightPointer() {
  const gl = useThree((state) => state.gl);
  const get = useThree((state) => state.get);

  useEffect(() => {
    const dom = gl.domElement;
    let active: HandRig | null = null;
    let rotating = false;
    let lastX = 0;
    let lastY = 0;
    let orbitPaused = false;

    const pauseOrbit = () => {
      const controls = sceneControls.current;
      if (!controls?.enabled) {
        return;
      }
      controls.enabled = false;
      orbitPaused = true;
    };

    const resumeOrbit = () => {
      if (!orbitPaused) {
        return;
      }
      orbitPaused = false;
      const controls = sceneControls.current;
      if (controls) {
        controls.enabled = true;
      }
    };

    const finish = () => {
      if (!active) {
        return;
      }
      active.readTransform();
      active.dragging = false;
      active.commit();
      active = null;
      dom.style.cursor = "";
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.button !== 2) {
        return;
      }
      const handle = handleAt(event, get().camera, dom, get().scene);
      if (!handle) {
        return;
      }
      if (handle.pivot) {
        pauseOrbit();
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      active = handle.rig;
      rotating = event.button === 2 || event.shiftKey;
      lastX = event.clientX;
      lastY = event.clientY;
      handle.rig.dragging = true;
      dom.style.cursor = rotating ? "crosshair" : "grabbing";
    };

    const onPointerMove = (event: PointerEvent) => {
      const camera = get().camera;
      if (!active) {
        if (event.target !== dom) {
          dom.style.cursor = "";
          return;
        }
        const hover = handleAt(event, camera, dom, get().scene);
        dom.style.cursor = hover && !hover.pivot ? "grab" : "";
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      if (dx === 0 && dy === 0) {
        return;
      }
      if (rotating || event.shiftKey) {
        rotateLight(active, camera, dx, dy);
      } else {
        moveLight(active, camera, dx, dy);
      }
      active.readTransform();
    };

    const onPointerUp = (event: PointerEvent) => {
      resumeOrbit();
      if (!active) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      finish();
    };

    const onWheel = (event: WheelEvent) => {
      const handle = handleAt(event, get().camera, dom, get().scene);
      if (!handle?.rig) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      const down = event.deltaY > 0;
      const next = handle.rig.getIntensity() * (down ? 0.9 : 1.1);
      handle.rig.setIntensity(down && next < 0.05 ? 0 : next);
      handle.rig.commit();
    };

    const onContextMenu = (event: Event) => {
      if (handleAt(event as PointerEvent, get().camera, dom, get().scene)) {
        event.preventDefault();
      }
    };

    const onBlur = () => {
      resumeOrbit();
      finish();
    };

    dom.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("pointermove", onPointerMove, true);
    window.addEventListener("pointerup", onPointerUp, true);
    dom.addEventListener("wheel", onWheel, { capture: true, passive: false });
    dom.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("blur", onBlur);

    return () => {
      resumeOrbit();
      dom.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointermove", onPointerMove, true);
      window.removeEventListener("pointerup", onPointerUp, true);
      dom.removeEventListener("wheel", onWheel, true);
      dom.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("blur", onBlur);
      dom.style.cursor = "";
    };
  }, [get, gl]);

  return null;
}
