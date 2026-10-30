import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ACESFilmicToneMapping } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { SceneConfig } from "entities/model/types";
import { getCameraSettings } from "./camera";
import { Bloom } from "./Bloom";
import { ConcreteFloor } from "./ConcreteFloor";
import { DockReflection } from "./DockReflection";
import { GainmapEnvironment } from "./GainmapEnvironment";
import { VehicleModel } from "./VehicleModel";
import { PointPlacerPanel } from "./PointPlacer";
import {
  fromInterestPoints,
  readPlacedPoints,
  writePlacedPoints,
  type PlacedPoint,
  type PointFieldPatch,
  type PointHover,
  type Vec3,
} from "./pointDraft";

type GarageSceneProps = {
  config: SceneConfig;
  interiorOpen: boolean;
  sceneScaled: boolean;
  animationPlaying: boolean;
};

function ResponsiveDistance({ minDistance }: { minDistance: number }) {
  const controls = useThree((state) => state.controls) as OrbitControlsImpl | null;
  const width = useThree((state) => state.size.width);

  useEffect(() => {
    if (!controls) {
      return;
    }
    controls.minDistance = minDistance;
    controls.maxDistance = getCameraSettings(width).maxDistance;
  }, [controls, minDistance, width]);

  return null;
}

export function GarageScene({ config, interiorOpen, sceneScaled, animationPlaying }: GarageSceneProps) {
  const initialCamera = getCameraSettings(window.innerWidth);
  const [placing, setPlacing] = useState(false);
  const [drafts, setDrafts] = useState<PlacedPoint[]>(() => (
    import.meta.env.DEV ? readPlacedPoints(config.modelUrl) : []
  ));
  const [hover, setHover] = useState<PointHover | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const loadedUrl = useRef(config.modelUrl);
  const placingActive = import.meta.env.DEV && placing && !interiorOpen;

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }
    if (loadedUrl.current !== config.modelUrl) {
      loadedUrl.current = config.modelUrl;
      setDrafts(readPlacedPoints(config.modelUrl));
      setPlacing(false);
      setHover(null);
      setEditingKey(null);
      return;
    }
    writePlacedPoints(config.modelUrl, drafts);
  }, [config.modelUrl, drafts]);

  const placePoint = (point: PlacedPoint) => {
    setDrafts((current) => [...current, point]);
  };

  const updatePoint = (key: string, patch: PointFieldPatch) => {
    setDrafts((current) => current.map((point) => (
      point.key === key ? { ...point, ...patch } : point
    )));
  };

  const retargetPoint = (key: string, position: Vec3) => {
    setDrafts((current) => current.map((point) => (
      point.key === key ? { ...point, position } : point
    )));
  };

  const removePoint = (key: string) => {
    setDrafts((current) => current.filter((point) => point.key !== key));
  };

  return (
    <>
    <Canvas
      id="webgl"
      className={sceneScaled ? "threeJSScene active" : "threeJSScene"}
      dpr={[1, 2]}
      camera={{
        fov: 75,
        near: 0.1,
        far: 100,
        position: initialCamera.position,
      }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: ACESFilmicToneMapping,
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      onCreated={({ gl, scene }) => {
        gl.toneMappingExposure = config.toneMappingExposure;
        gl.shadowMap.enabled = false;
        scene.environmentIntensity = config.environmentIntensity;
      }}
    >
      <OrbitControls
        makeDefault
        target={[0, 0.75, 0]}
        maxPolarAngle={Math.PI * 0.5}
        minDistance={config.minDistance}
        maxDistance={initialCamera.maxDistance}
        enableDamping
        enablePan={false}
        enabled={!interiorOpen}
      />
      <ResponsiveDistance minDistance={config.minDistance} />
      {config.floor ? <ConcreteFloor floor={config.floor} /> : null}
      {config.reflection ? <DockReflection reflection={config.reflection} /> : null}
      <GainmapEnvironment
        url={config.environment}
        skyHeight={config.skyHeight}
        skyRadius={config.skyRadius}
        skyResolution={config.skyResolution}
        intensity={config.environmentIntensity}
      />
      <Suspense fallback={null}>
        <VehicleModel
          config={config}
          animationPlaying={animationPlaying}
          showInterestPoints={!interiorOpen}
          placing={placingActive}
          drafts={drafts}
          editingKey={editingKey}
          onPlace={placePoint}
          onRetarget={retargetPoint}
          onHover={setHover}
        />
      </Suspense>
      {config.bloomEnabled && config.glow > 0 ? <Bloom glow={config.glow} /> : null}
    </Canvas>
    {import.meta.env.DEV ? (
      <PointPlacerPanel
        active={placingActive}
        label="Точки"
        hint="Короткий клик ставит точку. У раскрытой точки клик по модели заменяет координаты. Протяжка только крутит камеру."
        points={drafts}
        hover={hover}
        onToggle={() => {
          setPlacing((value) => !value);
          setHover(null);
        }}
        onUpdate={updatePoint}
        onRemove={removePoint}
        onClear={() => setDrafts([])}
        onEditingChange={setEditingKey}
        onLoadCurrent={() => setDrafts(fromInterestPoints(config.interestPoints ?? []))}
      />
    ) : null}
    </>
  );
}
