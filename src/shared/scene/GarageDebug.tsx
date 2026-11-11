import { useLayoutEffect, useRef } from "react";
import { button, useControls } from "leva";
import { Vector3, type Object3D } from "three";
import { copyJson, round, roundVec } from "./debug/copyJson";
import { roomPosition, type CeilingTune } from "./garageTune";
import type { NeonRig } from "./neonLights";
import type { SpotRig } from "./spotLights";

const neonWorld = new Vector3();

type Vec3 = [number, number, number];

type NeonPanel = {
  включен: boolean;
  цвет: string;
  интенсивность: number;
  ширина: number;
  высота: number;
  позиция: Vec3;
  "поворот °": Vec3;
  хелпер: boolean;
};

type SpotPanel = {
  включен: boolean;
  цвет: string;
  интенсивность: number;
  дальность: number;
  "угол °": number;
  полутень: number;
  спад: number;
  позиция: Vec3;
  "поворот °": Vec3;
  хелпер: boolean;
};

type GarageDebugProps = {
  root: Object3D;
  neons: NeonRig[];
  spots: SpotRig[];
  ceiling: CeilingTune;
};

function copyVec(value: Vec3): Vec3 {
  return [value[0], value[1], value[2]];
}

function RoomDebug({ root }: { root: Object3D }) {
  const applied = useRef("");
  const { позиция, поворот, масштаб } = useControls("Гараж", {
    позиция: { value: roomPosition, step: 0.01 },
    поворот: { value: [0, 0, 0] as Vec3, step: 0.01 },
    масштаб: { value: 1, min: 0.01, step: 0.01 },
    копировать: button(() => {
      copyJson("гараж", {
        position: roundVec(root.position),
        rotation: [round(root.rotation.x), round(root.rotation.y), round(root.rotation.z)],
        scale: round(root.scale.x),
      });
    }),
  }, { collapsed: true });

  const signature = `${позиция.join(",")}|${поворот.join(",")}|${масштаб}`;

  useLayoutEffect(() => {
    if (applied.current === signature) {
      return;
    }
    applied.current = signature;
    root.position.set(позиция[0], позиция[1], позиция[2]);
    root.rotation.set(поворот[0], поворот[1], поворот[2]);
    root.scale.setScalar(масштаб);
  }, [масштаб, root, signature, позиция, поворот]);

  return null;
}

function ClosedFolder({ path }: { path: string }) {
  useControls(path, {}, { collapsed: true });
  return null;
}

function CeilingDebug({ ceiling }: { ceiling: CeilingTune }) {
  const values = useControls("Свет.Ceilinglight", {
    свечение: { value: ceiling.led, min: 0, step: 0.05 },
    "кнопка света": ceiling.followSwitch,
  }, { collapsed: true });

  useLayoutEffect(() => {
    ceiling.led = values.свечение;
    ceiling.followSwitch = values["кнопка света"];
  }, [ceiling, values]);

  return null;
}

function SpotDebug({ rig }: { rig: SpotRig }) {
  const { tune } = rig;
  const [values, set] = useControls(`Свет.Ceilinglight.${rig.name}`, () => ({
    включен: tune.enabled,
    цвет: tune.color,
    интенсивность: { value: tune.intensity, min: 0, step: 0.1 },
    дальность: { value: tune.distance, min: 0, step: 0.1 },
    "угол °": { value: tune.angle, min: 0, max: 90, step: 0.1 },
    полутень: { value: tune.penumbra, min: 0, max: 1, step: 0.01 },
    спад: { value: tune.decay, min: 0, step: 0.1 },
    позиция: { value: tune.position, step: 0.01 },
    "поворот °": { value: tune.rotation, step: 1 },
    хелпер: tune.helper,
    копировать: button(() => {
      rig.readTransform();
      copyJson(rig.name, { ...rig.tune });
    }),
  }), { collapsed: true }) as unknown as [SpotPanel, (next: Partial<SpotPanel>) => void];

  rig.commit = () => {
    set({
      интенсивность: rig.tune.intensity,
      позиция: copyVec(rig.tune.position),
      "поворот °": copyVec(rig.tune.rotation),
    });
  };

  useLayoutEffect(() => {
    if (rig.dragging) {
      return;
    }
    tune.enabled = values.включен;
    tune.color = values.цвет;
    tune.intensity = values.интенсивность;
    tune.distance = values.дальность;
    tune.angle = values["угол °"];
    tune.penumbra = values.полутень;
    tune.decay = values.спад;
    tune.position = values.позиция;
    tune.rotation = values["поворот °"];
    tune.helper = values.хелпер;
  }, [rig, tune, values]);

  return null;
}

function NeonDebug({ rig }: { rig: NeonRig }) {
  const { tune } = rig;
  const [values, set] = useControls(`Свет.Neon.${rig.name}`, () => ({
    включен: tune.enabled,
    цвет: tune.color,
    интенсивность: { value: tune.intensity, min: 0, step: 0.1 },
    ширина: { value: tune.width, min: 0.01, step: 0.01 },
    высота: { value: tune.height, min: 0.01, step: 0.01 },
    позиция: { value: tune.position, step: 0.01 },
    "поворот °": { value: tune.rotation, step: 1 },
    хелпер: tune.helper,
    копировать: button(() => {
      rig.light.getWorldPosition(neonWorld);
      rig.readTransform();
      copyJson(rig.name, {
        ...rig.tune,
        world: roundVec(neonWorld),
      });
    }),
  }), { collapsed: true }) as unknown as [NeonPanel, (next: Partial<NeonPanel>) => void];

  rig.commit = () => {
    set({
      интенсивность: rig.tune.intensity,
      позиция: copyVec(rig.tune.position),
      "поворот °": copyVec(rig.tune.rotation),
    });
  };

  useLayoutEffect(() => {
    if (rig.dragging) {
      return;
    }
    tune.enabled = values.включен;
    tune.color = values.цвет;
    tune.intensity = values.интенсивность;
    tune.width = values.ширина;
    tune.height = values.высота;
    tune.position = values.позиция;
    tune.rotation = values["поворот °"];
    tune.helper = values.хелпер;
  }, [rig, tune, values]);

  return null;
}

export function GarageDebug({ root, neons, spots, ceiling }: GarageDebugProps) {
  return (
    <>
      <ClosedFolder path="Свет" />
      <ClosedFolder path="Свет.Neon" />
      <RoomDebug root={root} />
      <CeilingDebug ceiling={ceiling} />
      {spots.map((spot) => (
        <SpotDebug key={spot.name} rig={spot} />
      ))}
      {neons.map((neon) => (
        <NeonDebug key={neon.name} rig={neon} />
      ))}
    </>
  );
}
