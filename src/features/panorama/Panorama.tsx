import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { MathUtils, Mesh, NoToneMapping, PerspectiveCamera, SRGBColorSpace, BackSide } from "three";
import type { PanoramaRoom, PanoramaSpot, PanoramaTour } from "entities/model/types";
import { panoramaHotspotSrc } from "entities/model/panoramas";
import { GyroDialog } from "features/panorama/GyroDialog";
import { LookControls } from "features/panorama/LookControls";

const lookFov = 80;
const zoomFov = 50;
const fadeInMs = 2000;
const fadeOutMs = 1000;

type PanoramaProps = {
  tour: PanoramaTour;
  active: boolean;
};

type SkySphereProps = {
  src: string;
  phiStart: number;
};

function SkySphere({ src, phiStart }: SkySphereProps) {
  const texture = useTexture(src);
  texture.colorSpace = SRGBColorSpace;
  const phi = MathUtils.degToRad(phiStart);

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 64, 32, phi]} />
      <meshBasicMaterial map={texture} side={BackSide} toneMapped={false} />
    </mesh>
  );
}

type HotspotMarkerProps = {
  spot: PanoramaSpot;
  enabled: boolean;
  onTeleport: (spot: PanoramaSpot) => void;
};

function HotspotMarker({ spot, enabled, onTeleport }: HotspotMarkerProps) {
  const texture = useTexture(panoramaHotspotSrc);
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    meshRef.current?.lookAt(camera.position);
  });

  useEffect(() => {
    if (!enabled) {
      gl.domElement.style.cursor = "";
    }
    return () => {
      gl.domElement.style.cursor = "";
    };
  }, [enabled, gl]);

  const showPointer = () => {
    if (!enabled) {
      return;
    }
    gl.domElement.style.cursor = "pointer";
  };

  const hidePointer = () => {
    gl.domElement.style.cursor = "";
  };

  return (
    <mesh
      ref={meshRef}
      position={spot.position}
      userData={{ panoramaHotspot: true }}
      onPointerOver={(event) => {
        event.stopPropagation();
        showPointer();
      }}
      onPointerOut={hidePointer}
      onPointerDown={(event) => {
        if (!enabled) {
          return;
        }
        event.stopPropagation();
        onTeleport(spot);
      }}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}

type FovZoomProps = {
  target: number;
  duration: number;
};

function FovZoom({ target, duration }: FovZoomProps) {
  const camera = useThree((state) => state.camera as PerspectiveCamera);
  const from = useRef(camera.fov);
  const elapsed = useRef(0);
  const currentTarget = useRef(target);

  useEffect(() => {
    from.current = camera.fov;
    elapsed.current = 0;
    currentTarget.current = target;
  }, [camera, target, duration]);

  useFrame((_, delta) => {
    if (Math.abs(camera.fov - currentTarget.current) < 0.01) {
      camera.fov = currentTarget.current;
      camera.updateProjectionMatrix();
      return;
    }
    elapsed.current += delta * 1000;
    const t = Math.min(1, elapsed.current / duration);
    camera.fov = MathUtils.lerp(from.current, currentTarget.current, t);
    camera.updateProjectionMatrix();
  });

  return null;
}

function needsGyroPrompt(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const touch = window.matchMedia("(hover: none)").matches;
  const orientation = "DeviceOrientationEvent" in window;
  return touch && orientation;
}

export function Panorama({ tour, active }: PanoramaProps) {
  const rooms = useMemo(() => {
    const map = new Map<string, PanoramaRoom>();
    tour.rooms.forEach((room) => map.set(room.id, room));
    return map;
  }, [tour]);

  const [roomId, setRoomId] = useState(tour.initialRoom);
  const [phiStart, setPhiStart] = useState(() => rooms.get(tour.initialRoom)?.phiStart ?? 0);
  const [fov, setFov] = useState(lookFov);
  const [zoomDuration, setZoomDuration] = useState(fadeOutMs);
  const [fade, setFade] = useState(0);
  const [busy, setBusy] = useState(false);
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [gyroPrompt, setGyroPrompt] = useState(false);
  const timers = useRef<number[]>([]);

  const room = rooms.get(roomId) ?? tour.rooms[0];

  useEffect(() => {
    tour.rooms.forEach((item) => {
      useTexture.preload(item.src);
    });
    useTexture.preload(panoramaHotspotSrc);
  }, [tour]);

  useEffect(() => {
    if (!active) {
      setRoomId(tour.initialRoom);
      setPhiStart(rooms.get(tour.initialRoom)?.phiStart ?? 0);
      setFov(lookFov);
      setFade(0);
      setBusy(false);
      setGyroPrompt(false);
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
      return;
    }
    if (needsGyroPrompt() && !gyroEnabled) {
      setGyroPrompt(true);
    }
  }, [active, gyroEnabled, rooms, tour.initialRoom]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const teleport = (spot: PanoramaSpot) => {
    if (busy || !active) {
      return;
    }
    setBusy(true);
    setFade(1);
    setZoomDuration(fadeInMs);
    setFov(zoomFov);

    const swap = window.setTimeout(() => {
      setRoomId(spot.toRoom);
      setPhiStart(spot.phiStart);
      setZoomDuration(fadeOutMs);
      setFov(lookFov);
      setFade(0);
      const unlock = window.setTimeout(() => {
        setBusy(false);
      }, fadeOutMs);
      timers.current.push(unlock);
    }, fadeInMs);
    timers.current.push(swap);
  };

  const allowGyro = async () => {
    setGyroPrompt(false);
    const DeviceOrientation = window.DeviceOrientationEvent as
      | (typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> })
      | undefined;
    if (DeviceOrientation?.requestPermission) {
      try {
        const result = await DeviceOrientation.requestPermission();
        setGyroEnabled(result === "granted");
      } catch {
        setGyroEnabled(false);
      }
      return;
    }
    setGyroEnabled(true);
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  if (!room) {
    return null;
  }

  return (
    <div className={active ? "panorama-scene active" : "panorama-scene"}>
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ fov: lookFov, near: 0.1, far: 1000, position: [0, 1.6, 0] }}
        gl={{
          antialias: true,
          toneMapping: NoToneMapping,
          powerPreference: "high-performance",
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <LookControls enabled={active && !busy} gyroEnabled={gyroEnabled} />
        <FovZoom target={fov} duration={zoomDuration} />
        <Suspense fallback={null}>
          <SkySphere src={room.src} phiStart={phiStart} />
          {room.spots.map((spot) => (
            <HotspotMarker
              key={`${room.id}-${spot.toRoom}-${spot.position.join(",")}`}
              spot={spot}
              enabled={active && !busy}
              onTeleport={teleport}
            />
          ))}
        </Suspense>
      </Canvas>
      <div
        className="panorama-fade"
        style={{
          opacity: fade,
          transition: `opacity ${fade ? fadeInMs : fadeOutMs}ms linear`,
        }}
      />
      <GyroDialog open={gyroPrompt && active} onAllow={() => void allowGyro()} onDeny={() => setGyroPrompt(false)} />
    </div>
  );
}
