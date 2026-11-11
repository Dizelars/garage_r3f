import { useLayoutEffect, useRef } from "react";
import { button, useControls } from "leva";
import type { Object3D } from "three";
import type { SceneConfig } from "entities/model/types";
import { copyJson, round, roundVec } from "./copyJson";

type VehicleDebugProps = {
  object: Object3D;
  config: SceneConfig;
};

export function VehicleDebug({ object, config }: VehicleDebugProps) {
  const applied = useRef("");
  const {
    позиция,
    поворот,
    масштаб,
  } = useControls("Авто", {
    позиция: { value: config.modelPosition, step: 0.01 },
    поворот: {
      value: [0, config.modelRotationY, 0] as [number, number, number],
      step: 0.01,
    },
    масштаб: { value: config.modelScale, min: 0.01, step: 0.01 },
    копировать: button(() => {
      copyJson("авто", {
        modelUrl: config.modelUrl,
        modelPosition: roundVec(object.position),
        modelRotation: [round(object.rotation.x), round(object.rotation.y), round(object.rotation.z)],
        modelRotationY: round(object.rotation.y),
        modelScale: round(object.scale.x),
      });
    }),
  }, { collapsed: true });

  const signature = `${позиция.join(",")}|${поворот.join(",")}|${масштаб}`;

  useLayoutEffect(() => {
    if (applied.current === signature) {
      return;
    }
    applied.current = signature;
    object.position.set(позиция[0], позиция[1], позиция[2]);
    object.rotation.set(поворот[0], поворот[1], поворот[2]);
    object.scale.setScalar(масштаб);
  }, [масштаб, object, signature, позиция, поворот]);

  return null;
}
