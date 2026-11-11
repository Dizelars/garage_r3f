import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { CoddLogos } from "./CoddLogo";
import { GarageDebug } from "./GarageDebug";
import { LightPointer } from "./LightPointer";
import { NeonPivot } from "./NeonPivot";
import { createCeilingTune, fadeSeconds, roomPosition, type CeilingTune } from "./garageTune";
import { applyNeonRig, attachNeonLights } from "./neonLights";
import { applySpotRig, attachSpotLights } from "./spotLights";

const garageUrl = "models/garage/gltf_action/ModernDarkGarage.gltf";
const draco = "/draco/";

export function GarageRoom({ lightsOn }: { lightsOn: boolean }) {
  const scene = useThree((state) => state.scene);
  const gltf = useGLTF(garageUrl, draco);
  const ceiling = useMemo(() => createCeilingTune(), []);
  const built = useMemo(() => {
    const root = gltf.scene.clone(true);
    root.position.set(roomPosition[0], roomPosition[1], roomPosition[2]);
    const spots = attachSpotLights(root);
    const neons = attachNeonLights(root);
    return { root, spots, neons };
  }, [gltf.scene]);

  const ceilingRef = useRef<CeilingTune>(ceiling);
  ceilingRef.current = ceiling;
  const master = useRef(lightsOn ? 1 : 0);
  const lightsOnRef = useRef(lightsOn);
  lightsOnRef.current = lightsOn;

  useLayoutEffect(() => {
    const helpers = built.spots.flatMap((spot) => (spot.helper ? [spot.helper] : []));
    helpers.forEach((helper) => {
      scene.add(helper);
    });
    return () => {
      helpers.forEach((helper) => {
        helper.removeFromParent();
        helper.dispose();
      });
      built.spots.forEach((spot) => {
        const material = spot.grab?.material;
        if (material && !Array.isArray(material)) {
          material.dispose();
        }
      });
    };
  }, [built.spots, scene]);

  useFrame((_, delta) => {
    const tune = ceilingRef.current;
    const destination = lightsOnRef.current ? 1 : 0;
    const blend = 1 - Math.exp(-delta / fadeSeconds);
    master.current += (destination - master.current) * blend;
    const level = tune.followSwitch ? master.current : 1;

    built.spots.forEach((spot) => {
      applySpotRig(spot, level, tune.led);
    });
    built.neons.forEach((neon) => {
      applyNeonRig(neon, level);
    });
  });

  return (
    <>
      <primitive object={built.root}>
        <CoddLogos />
        {import.meta.env.DEV ? built.neons.map((neon) => (
          <NeonPivot key={neon.id} rig={neon} />
        )) : null}
      </primitive>
      {import.meta.env.DEV ? (
        <>
      <LightPointer />
          <GarageDebug
            root={built.root}
            neons={built.neons}
            spots={built.spots}
            ceiling={ceiling}
          />
        </>
      ) : null}
    </>
  );
}

useGLTF.preload(garageUrl, draco);
