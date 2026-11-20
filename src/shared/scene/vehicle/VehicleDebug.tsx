import { button, useControls } from "leva";
import type { Object3D } from "three";
import { copyJson, round, roundVec } from "../debug/copyJson";

type VehicleDebugProps = {
  getObject: () => Object3D | null;
};

export function VehicleDebug({ getObject }: VehicleDebugProps) {
  useControls("Авто", {
    копировать: button(() => {
      const object = getObject();
      if (!object) {
        return;
      }
      copyJson("авто", {
        modelPosition: roundVec(object.position),
        modelRotation: [round(object.rotation.x), round(object.rotation.y), round(object.rotation.z)],
        modelRotationY: round(object.rotation.y),
        modelScale: round(object.scale.x),
      });
    }),
  }, { collapsed: true });

  return null;
}
