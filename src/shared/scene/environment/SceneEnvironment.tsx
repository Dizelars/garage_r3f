import { useEffect, useLayoutEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useCurrentSheet } from "@theatre/r3f";
import { types } from "@theatre/core";
import { button, useControls } from "leva";
import type { SceneConfig } from "entities/model/types";
import { copyJson, round } from "../debug/copyJson";
import { setEnvProjection } from "./envProjection";

const environmentYaw: [number, number, number] = [0, Math.PI / 2, 0];
const fadeSeconds = 1;
const groundScale = 50;

type GroundTune = {
  files: string;
  height: number;
  radius: number;
  scale: number;
  lightsOn: boolean;
  baseIntensity: number;
};

function EnvironmentIntensity({ lightsOn, base }: { lightsOn: boolean; base: number }) {
  const scene = useThree((state) => state.scene);
  const sheet = useCurrentSheet();
  // fade — множитель кнопки света (0..1), анимируется линейно.
  // theatreValue — значение из theatre, применяется напрямую, без своей интерполяции.
  const fade = useRef(lightsOn ? 1 : 0);
  const theatreValue = useRef(base);
  const lightsOnRef = useRef(lightsOn);
  lightsOnRef.current = lightsOn;

  useEffect(() => {
    if (!sheet) {
      return;
    }
    const object = sheet.object("environment", {
      intensity: types.number(base, { range: [0, 4] }),
    });
    return object.onValuesChange((values) => {
      theatreValue.current = Math.max(values.intensity, 0);
      scene.environmentIntensity = theatreValue.current * fade.current;
    });
  }, [sheet, base, scene]);

  useLayoutEffect(() => {
    scene.environmentIntensity = theatreValue.current * fade.current;
  });

  useFrame((_, delta) => {
    const destination = lightsOnRef.current ? 1 : 0;
    const distance = destination - fade.current;
    if (distance === 0) {
      return;
    }
    const step = delta / fadeSeconds;
    fade.current = Math.abs(distance) <= step
      ? destination
      : fade.current + Math.sign(distance) * step;
    scene.environmentIntensity = theatreValue.current * fade.current;
  });

  return null;
}

function SceneEnvironmentView({ files, height, radius, scale, lightsOn, baseIntensity }: GroundTune) {
  useLayoutEffect(() => {
    setEnvProjection(radius, height, scale);
  }, [height, radius, scale]);

  return (
    <>
      <Environment
        files={files}
        environmentRotation={environmentYaw}
        background={false}
      />
      <EnvironmentIntensity lightsOn={lightsOn} base={baseIntensity} />
    </>
  );
}

function SceneEnvironmentDebug({ config, lightsOn }: { config: SceneConfig; lightsOn: boolean }) {
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
      lightsOn={lightsOn}
      baseIntensity={config.environmentIntensity}
    />
  );
}

export function SceneEnvironment({ config, lightsOn }: { config: SceneConfig; lightsOn: boolean }) {
  // if (import.meta.env.DEV) {
  //   return <SceneEnvironmentDebug key={config.modelUrl} config={config} lightsOn={lightsOn} />;
  // }

  return (
    <SceneEnvironmentView
      files={config.environment}
      height={config.skyHeight}
      radius={config.skyRadius}
      scale={groundScale}
      lightsOn={lightsOn}
      baseIntensity={config.environmentIntensity}
    />
  );
}
