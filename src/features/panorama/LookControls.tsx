import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, Vector2 } from "three";

const pitchLimit = Math.PI / 2 - 0.05;
const pointerSpeed = 0.005;

type LookControlsProps = {
  enabled: boolean;
  gyroEnabled: boolean;
};

export function LookControls({ enabled, gyroEnabled }: LookControlsProps) {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const raycaster = useThree((state) => state.raycaster);
  const size = useThree((state) => state.size);
  const ndc = useRef(new Vector2());
  const pointerYaw = useRef(0);
  const pointerPitch = useRef(0);
  const gyroYaw = useRef(0);
  const gyroPitch = useRef(0);
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    camera.rotation.order = "YXZ";
  }, [camera]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const element = gl.domElement;

    const onPointerDown = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      ndc.current.x = ((event.clientX - rect.left) / size.width) * 2 - 1;
      ndc.current.y = -((event.clientY - rect.top) / size.height) * 2 + 1;
      raycaster.setFromCamera(ndc.current, camera);
      const hitHotspot = raycaster.intersectObjects(scene.children, true).some(
        (hit) => hit.object.userData.panoramaHotspot === true,
      );
      if (hitHotspot) {
        return;
      }
      dragging.current = true;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      element.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging.current) {
        return;
      }
      const dx = event.clientX - lastPointer.current.x;
      const dy = event.clientY - lastPointer.current.y;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      pointerYaw.current -= dx * pointerSpeed;
      pointerPitch.current = MathUtils.clamp(
        pointerPitch.current - dy * pointerSpeed,
        -pitchLimit,
        pitchLimit,
      );
    };

    const onPointerUp = (event: PointerEvent) => {
      dragging.current = false;
      if (element.hasPointerCapture(event.pointerId)) {
        element.releasePointerCapture(event.pointerId);
      }
    };

    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerUp);

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);
    };
  }, [camera, enabled, gl, raycaster, scene, size.height, size.width]);

  useEffect(() => {
    if (!enabled || !gyroEnabled) {
      return;
    }

    const onOrient = (event: DeviceOrientationEvent) => {
      if (event.alpha === null || event.beta === null) {
        return;
      }
      const screenAngle = window.screen.orientation?.angle ?? 0;
      gyroYaw.current = MathUtils.degToRad(event.alpha) + MathUtils.degToRad(screenAngle);
      gyroPitch.current = MathUtils.clamp(
        MathUtils.degToRad(event.beta) - Math.PI / 2,
        -pitchLimit,
        pitchLimit,
      );
    };

    window.addEventListener("deviceorientation", onOrient);
    return () => window.removeEventListener("deviceorientation", onOrient);
  }, [enabled, gyroEnabled]);

  useFrame(() => {
    if (!enabled) {
      return;
    }
    camera.rotation.y = (gyroEnabled ? gyroYaw.current : 0) + pointerYaw.current;
    camera.rotation.x = (gyroEnabled ? gyroPitch.current : 0) + pointerPitch.current;
  });

  return null;
}
