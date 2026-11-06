import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { button, levaStore, monitor, useControls } from "leva";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { getCameraSettings } from "../camera";
import { copyJson, formatVec, roundVec } from "./copyJson";

type CameraPose = {
  позиция: [number, number, number];
  цель: [number, number, number];
};

type Vec3 = [number, number, number];

function readVec(value: unknown): Vec3 | null {
  if (!Array.isArray(value) || value.length < 3) {
    return null;
  }
  const x = Number(value[0]);
  const y = Number(value[1]);
  const z = Number(value[2]);
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
    return null;
  }
  return [x, y, z];
}

export function CameraDebug() {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as OrbitControlsImpl | null;
  const cameraRef = useRef(camera);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const applyLive = useRef<() => void>(() => {});
  cameraRef.current = camera;
  controlsRef.current = controls;

  const initial = getCameraSettings(window.innerWidth);
  const [, setPose] = useControls("Камера", () => ({
    "позиция сейчас": monitor(() => formatVec(cameraRef.current.position), { interval: 100 }),
    "цель сейчас": monitor(() => formatVec(controlsRef.current?.target), { interval: 100 }),
    позиция: {
      value: initial.position,
      step: 0.01,
    },
    цель: {
      value: [0, 0.75, 0] as [number, number, number],
      step: 0.01,
    },
    "взять текущую": button(() => {
      applyLive.current();
    }),
    копировать: button(() => {
      const orbit = controlsRef.current;
      copyJson("камера", {
        position: roundVec(cameraRef.current.position),
        target: orbit ? roundVec(orbit.target) : null,
      });
    }),
  })) as unknown as [CameraPose, (next: Partial<CameraPose>) => void];

  applyLive.current = () => {
    const orbit = controlsRef.current;
    setPose({
      позиция: roundVec(cameraRef.current.position),
      цель: orbit ? roundVec(orbit.target) : [0, 0.75, 0],
    });
  };

  useEffect(() => {
    let last = "";

    const apply = () => {
      const position = readVec(levaStore.get("Камера.позиция"));
      const target = readVec(levaStore.get("Камера.цель"));
      if (!position || !target) {
        return;
      }
      const signature = `${position.join(",")}|${target.join(",")}`;
      if (signature === last) {
        return;
      }
      last = signature;
      camera.position.set(position[0], position[1], position[2]);
      const orbit = controlsRef.current;
      if (!orbit) {
        return;
      }
      orbit.target.set(target[0], target[1], target[2]);
      orbit.update();
    };

    apply();
    return levaStore.useStore.subscribe(apply);
  }, [camera]);

  return null;
}
