import { useLayoutEffect } from "react";
import { Environment } from "@react-three/drei";
import { button, useControls } from "leva";
import type { SceneConfig } from "entities/model/types";
import { copyJson, round } from "../debug/copyJson";
import { setEnvProjection } from "./envProjection";

const environmentYaw: [number, number, number] = [0, Math.PI / 2, 0];
const groundScale = 50;

type GroundTune = {
  files: string;
  height: number;
  radius: number;
  scale: number;
};

function SceneEnvironmentView({ files, height, radius, scale }: GroundTune) {
  useLayoutEffect(() => {
    setEnvProjection(radius, height, scale);
  }, [height, radius, scale]);

  return (
    <Environment
      files={files}
      environmentRotation={environmentYaw}
      background={false}
    />
  );
}

function SceneEnvironmentDebug({ config }: { config: SceneConfig }) {
  const { высота, радиус, масштаб } = useControls("Окружение", {
    высота: { value: config.skyHeight, min: 0.1, max: 80, step: 0.1 },
    радиус: { value: config.skyRadius, min: 1, max: 400, step: 0.5 },
    масштаб: { value: groundScale, min: 10, max: 1000, step: 1 },
    копировать: button((get) => {
      copyJson("окружение", {
        skyHeight: round(get("Окружение.высота")),
        skyRadius: round(get("Окружение.радиус")),
        scale: round(get("Окружение.масштаб")),
      });
    }),
  }, { collapsed: true });

  return (
    <SceneEnvironmentView
      files={config.environment}
      height={высота}
      radius={радиус}
      scale={масштаб}
    />
  );
}

export function SceneEnvironment({ config }: { config: SceneConfig }) {
  if (import.meta.env.DEV) {
    return <SceneEnvironmentDebug key={config.modelUrl} config={config} />;
  }

  return (
    <SceneEnvironmentView
      files={config.environment}
      height={config.skyHeight}
      radius={config.skyRadius}
      scale={groundScale}
    />
  );
}
