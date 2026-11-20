import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { CameraControls } from "@react-three/drei";
import { editable as e, useCurrentSheet } from "@theatre/r3f";
import { onChange } from "@theatre/core";
import { Vector3, type Mesh } from "three";
import { getCameraSettings } from "./camera";

const initialTarget: [number, number, number] = [0, 0.75, 0];

// Прокси-ручки камеры для Theatre Studio: двигаешь их гизмо
// (или ключи на таймлайне) — CameraControls следует за ними.
// Применяем setLookAt только при изменении позиций, чтобы не
// драться с обычным управлением камерой мышью.
export function TheatreCameraRig() {
  const controls = useThree((state) => state.controls) as CameraControls | null;
  const scene = useThree((state) => state.scene);
  const sheet = useCurrentSheet();
  const cameraRef = useRef<Mesh>(null);
  const targetRef = useRef<Mesh>(null);
  const lastCamera = useRef(new Vector3(Number.NaN, 0, 0));
  const lastTarget = useRef(new Vector3(Number.NaN, 0, 0));

  useEffect(() => {
    (window as unknown as { __scene: unknown }).__scene = scene;
  }, [scene]);

  useEffect(() => {
    if (!controls || !sheet) {
      return;
    }
    return onChange(sheet.sequence.pointer.playing, (playing) => {
      controls.enabled = !playing;
    });
  }, [controls, sheet]);

  useFrame(() => {
    const camera = cameraRef.current;
    const target = targetRef.current;
    if (!controls || !camera || !target) {
      return;
    }
    const moved = !camera.position.equals(lastCamera.current)
      || !target.position.equals(lastTarget.current);
    if (!moved) {
      return;
    }
    lastCamera.current.copy(camera.position);
    lastTarget.current.copy(target.position);
    void controls.setLookAt(
      camera.position.x,
      camera.position.y,
      camera.position.z,
      target.position.x,
      target.position.y,
      target.position.z,
      false,
    );
  });

  const initialCamera = getCameraSettings(window.innerWidth);

  return (
    <>
      <e.mesh
        theatreKey="camera"
        ref={cameraRef}
        position={initialCamera.position}
        visible="editor"
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#4fc3f7" wireframe toneMapped={false} />
      </e.mesh>
      <e.mesh
        theatreKey="cameraTarget"
        ref={targetRef}
        position={initialTarget}
        visible="editor"
      >
        <octahedronGeometry args={[0.05, 0]} />
        <meshBasicMaterial color="#ffee58" wireframe toneMapped={false} />
      </e.mesh>
    </>
  );
}
