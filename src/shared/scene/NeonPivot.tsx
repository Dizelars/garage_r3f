import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PivotControls } from "@react-three/drei";
import { Group, Matrix4, Vector3 } from "three";
import type { NeonRig } from "./neonLights";

const unit = new Vector3(1, 1, 1);

export function NeonPivot({ rig }: { rig: NeonRig }) {
  const matrix = useMemo(() => new Matrix4(), []);
  const scale = useMemo(() => new Vector3(), []);
  const group = useRef<Group>(null);

  useFrame(() => {
    if (group.current) {
      group.current.visible = rig.tune.helper;
    }
    if (rig.dragging) {
      return;
    }
    matrix.compose(rig.light.position, rig.light.quaternion, unit);
  });

  return (
    <group ref={group}>
      <PivotControls
        matrix={matrix}
        autoTransform
        disableScaling
        fixed
        scale={100}
        lineWidth={3}
        depthTest={false}
        annotations
        userData={{ pivot: true, rig }}
        onDragStart={() => {
          rig.dragging = true;
        }}
        onDrag={(local) => {
          local.decompose(rig.light.position, rig.light.quaternion, scale);
          rig.light.scale.set(1, 1, 1);
        }}
        onDragEnd={() => {
          rig.readTransform();
          rig.dragging = false;
          rig.commit();
        }}
      />
    </group>
  );
}
