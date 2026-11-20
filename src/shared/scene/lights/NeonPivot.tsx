import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PivotControls } from "@react-three/drei";
import { Matrix4, Vector3 } from "three";
import type { NeonRig } from "./neonLights";

const unit = new Vector3(1, 1, 1);

export function NeonPivot({ rig }: { rig: NeonRig }) {
  const matrix = useMemo(() => new Matrix4(), []);
  const scale = useMemo(() => new Vector3(), []);
  const shown = useRef(false);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }
    matrix.compose(rig.light.position, rig.light.quaternion, unit);
  }, [matrix, open, rig]);

  useFrame(() => {
    const next = rig.tune.helper;
    if (shown.current !== next) {
      shown.current = next;
      setOpen(next);
      return;
    }
    if (!next || rig.dragging) {
      return;
    }
    matrix.compose(rig.light.position, rig.light.quaternion, unit);
  });

  if (!open) {
    return null;
  }

  return (
    <PivotControls
      matrix={matrix}
      autoTransform
      disableScaling
      fixed
      scale={100}
      lineWidth={3}
      depthTest={false}
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
  );
}
