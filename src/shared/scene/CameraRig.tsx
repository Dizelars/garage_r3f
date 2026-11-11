import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraControlsImpl, type CameraControls } from "@react-three/drei";
import { Vector3 } from "three";
import type { CameraLock } from "entities/model/types";
import { subscribeCameraFocus, type CameraEvent } from "./cameraFocus";
import { collectBlockers, planCameraPath } from "./cameraPath";
import { sceneControls } from "./sceneControls";

const { ACTION } = CameraControlsImpl;

type MouseButtons = CameraControls["mouseButtons"];
type Touches = CameraControls["touches"];

type ControlSnapshot = {
  minPolarAngle: number;
  maxPolarAngle: number;
  minAzimuthAngle: number;
  maxAzimuthAngle: number;
  minDistance: number;
  maxDistance: number;
  left: MouseButtons["left"];
  middle: MouseButtons["middle"];
  right: MouseButtons["right"];
  wheel: MouseButtons["wheel"];
  one: Touches["one"];
  two: Touches["two"];
  three: Touches["three"];
};

function readSnapshot(controls: CameraControls): ControlSnapshot {
  return {
    minPolarAngle: controls.minPolarAngle,
    maxPolarAngle: controls.maxPolarAngle,
    minAzimuthAngle: controls.minAzimuthAngle,
    maxAzimuthAngle: controls.maxAzimuthAngle,
    minDistance: controls.minDistance,
    maxDistance: controls.maxDistance,
    left: controls.mouseButtons.left,
    middle: controls.mouseButtons.middle,
    right: controls.mouseButtons.right,
    wheel: controls.mouseButtons.wheel,
    one: controls.touches.one,
    two: controls.touches.two,
    three: controls.touches.three,
  };
}

function applySnapshot(controls: CameraControls, snapshot: ControlSnapshot): void {
  controls.minPolarAngle = snapshot.minPolarAngle;
  controls.maxPolarAngle = snapshot.maxPolarAngle;
  controls.minAzimuthAngle = snapshot.minAzimuthAngle;
  controls.maxAzimuthAngle = snapshot.maxAzimuthAngle;
  controls.minDistance = snapshot.minDistance;
  controls.maxDistance = snapshot.maxDistance;
  controls.mouseButtons.left = snapshot.left;
  controls.mouseButtons.middle = snapshot.middle;
  controls.mouseButtons.right = snapshot.right;
  controls.mouseButtons.wheel = snapshot.wheel;
  controls.touches.one = snapshot.one;
  controls.touches.two = snapshot.two;
  controls.touches.three = snapshot.three;
}

function applyLock(controls: CameraControls, lock: CameraLock): void {
  if (lock.minPolarAngle !== undefined) {
    controls.minPolarAngle = lock.minPolarAngle;
  }
  if (lock.maxPolarAngle !== undefined) {
    controls.maxPolarAngle = lock.maxPolarAngle;
  }
  if (lock.minAzimuthAngle !== undefined) {
    controls.minAzimuthAngle = lock.minAzimuthAngle;
  }
  if (lock.maxAzimuthAngle !== undefined) {
    controls.maxAzimuthAngle = lock.maxAzimuthAngle;
  }
  if (lock.minDistance !== undefined) {
    controls.minDistance = lock.minDistance;
  }
  if (lock.maxDistance !== undefined) {
    controls.maxDistance = lock.maxDistance;
  }

  const rotate = lock.enableRotate ?? true;
  const zoom = lock.enableZoom ?? false;
  const pan = lock.enablePan ?? false;
  controls.mouseButtons.left = rotate ? ACTION.ROTATE : ACTION.NONE;
  controls.mouseButtons.middle = zoom ? ACTION.DOLLY : ACTION.NONE;
  controls.mouseButtons.right = pan ? ACTION.TRUCK : ACTION.NONE;
  controls.mouseButtons.wheel = zoom ? ACTION.DOLLY : ACTION.NONE;
  controls.touches.one = rotate ? ACTION.TOUCH_ROTATE : ACTION.NONE;
  controls.touches.two = zoom ? ACTION.TOUCH_DOLLY_TRUCK : (pan ? ACTION.TOUCH_TRUCK : ACTION.NONE);
  controls.touches.three = pan ? ACTION.TOUCH_TRUCK : ACTION.NONE;
}

export function CameraRig({ interactive }: { interactive: boolean }) {
  const scene = useThree((state) => state.scene);
  const interactiveRef = useRef(interactive);
  const activeToken = useRef(0);
  const flying = useRef(false);
  const baseline = useRef<ControlSnapshot | null>(null);
  const queued = useRef<CameraEvent | null>(null);
  const savedHome = useRef(false);
  const runRef = useRef<(event: CameraEvent) => void>(() => {});
  interactiveRef.current = interactive;

  const releaseInput = (controls: CameraControls, token: number) => {
    if (activeToken.current !== token) {
      return;
    }
    flying.current = false;
    controls.enabled = interactiveRef.current;
  };

  const run = (event: CameraEvent) => {
    const controls = sceneControls.current;
    if (!controls) {
      queued.current = event;
      return;
    }

    const token = event.token;
    activeToken.current = token;
    flying.current = true;
    controls.enabled = false;

    if (event.kind === "release") {
      if (baseline.current) {
        applySnapshot(controls, baseline.current);
        baseline.current = null;
      }
      void controls.reset(true).then(() => {
        releaseInput(controls, token);
      });
      return;
    }

    if (event.kind === "fit") {
      const padding = event.fit.padding ?? 0;
      void controls.fitToBox(event.fit.target, true, {
        cover: event.fit.cover ?? false,
        paddingLeft: padding,
        paddingRight: padding,
        paddingTop: padding,
        paddingBottom: padding,
      }).then(() => {
        if (activeToken.current !== token) {
          return;
        }
        if (event.fit.lock) {
          if (!baseline.current) {
            baseline.current = readSnapshot(controls);
          }
          applyLock(controls, event.fit.lock);
        }
        releaseInput(controls, token);
      });
      return;
    }

    if (baseline.current) {
      applySnapshot(controls, baseline.current);
      baseline.current = null;
    }

    const start = controls.getPosition(new Vector3(), false);
    const end = new Vector3(event.shot.position[0], event.shot.position[1], event.shot.position[2]);
    const points = planCameraPath(start, end, collectBlockers(scene));
    const fromTarget = controls.getTarget(new Vector3(), false);
    const toTarget = new Vector3(event.shot.target[0], event.shot.target[1], event.shot.target[2]);
    const look = new Vector3();

    const fly = async () => {
      for (let index = 1; index < points.length; index += 1) {
        if (activeToken.current !== token) {
          return;
        }
        const amount = index / (points.length - 1);
        look.copy(fromTarget).lerp(toTarget, amount);
        const point = points[index];
        await controls.setLookAt(point.x, point.y, point.z, look.x, look.y, look.z, true);
      }
      if (activeToken.current !== token) {
        return;
      }
      if (event.lock) {
        baseline.current = readSnapshot(controls);
        applyLock(controls, event.lock);
      }
      releaseInput(controls, token);
    };

    void fly().catch(() => {
      releaseInput(controls, token);
    });
  };
  runRef.current = run;

  useEffect(() => {
    const controls = sceneControls.current;
    if (controls && !flying.current) {
      controls.enabled = interactive;
    }
  }, [interactive]);

  useEffect(() => {
    return subscribeCameraFocus((event) => {
      runRef.current(event);
    });
  }, []);

  useFrame(() => {
    const controls = sceneControls.current;
    if (controls && !savedHome.current) {
      controls.saveState();
      savedHome.current = true;
      if (!flying.current) {
        controls.enabled = interactiveRef.current;
      }
    }
    const event = queued.current;
    if (!event || !sceneControls.current) {
      return;
    }
    queued.current = null;
    runRef.current(event);
  });

  return null;
}
