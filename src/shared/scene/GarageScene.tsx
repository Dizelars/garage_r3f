import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ACESFilmicToneMapping } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { SceneConfig } from "entities/model/types";
import { getCameraSettings } from "shared/scene/camera";
import { Bloom } from "shared/scene/Bloom";
import { ConcreteFloor } from "shared/scene/ConcreteFloor";
import { DockReflection } from "shared/scene/DockReflection";
import { GainmapEnvironment } from "shared/scene/GainmapEnvironment";
import { VehicleModel } from "shared/scene/VehicleModel";

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

  return (
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
        />
      </Suspense>
      {config.bloomEnabled && config.glow > 0 ? <Bloom glow={config.glow} /> : null}
    </Canvas>
  );
}
