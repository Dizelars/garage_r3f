import { useEffect, useLayoutEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { button, useControls } from "leva";
import { Mesh, MeshStandardMaterial, type Object3D } from "three";
import { copyJson, round, roundVec } from "./debug/copyJson";
import type { HandRig } from "./LightPointer";

const coddLogoUrl = "models/codd_logo/MTCC.gltf";
const draco = "/draco/";
const logoColor = "#67a843";
const logoEmissive = 100;
const logoScale = 0.72;
const toDeg = 180 / Math.PI;
const toRad = Math.PI / 180;

type Vec3 = [number, number, number];

type LogoPlace = {
  id: string;
  title: string;
  position: Vec3;
  rotationY: number;
};

type LogoTune = {
  position: Vec3;
  rotation: Vec3;
  emissive: number;
};

type LogoRig = HandRig & {
  tune: LogoTune;
};

type LogoPanel = {
  позиция: Vec3;
  "поворот °": Vec3;
  масштаб: number;
  "цвет модели": string;
  "цвет свечения": string;
  свечение: number;
};

const places: LogoPlace[] = [
  { id: "left", title: "Левый", position: [0, 0.4, 13.83], rotationY: Math.PI / 2 },
  { id: "right", title: "Правый", position: [0, 0.4, -9.29], rotationY: -Math.PI / 2 },
];

function ClosedFolder({ path }: { path: string }) {
  useControls(path, {}, { collapsed: true });
  return null;
}

function copyVec(value: Vec3): Vec3 {
  return [value[0], value[1], value[2]];
}

function paintLogo(root: Object3D, material: MeshStandardMaterial) {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) {
      return;
    }
    child.material = material;
    child.castShadow = false;
    child.receiveShadow = false;
  });
}

function attachLogoRig(root: Object3D, material: MeshStandardMaterial): LogoRig {
  const tune: LogoTune = {
    position: [root.position.x, root.position.y, root.position.z],
    rotation: [root.rotation.x * toDeg, root.rotation.y * toDeg, root.rotation.z * toDeg],
    emissive: material.emissiveIntensity,
  };
  const rig: LogoRig = {
    light: root,
    pick: [root],
    dragging: false,
    wheel: false,
    tune,
    getIntensity: () => tune.emissive,
    setIntensity: (value) => {
      tune.emissive = Math.max(0, value);
      material.emissiveIntensity = tune.emissive;
    },
    readTransform: () => {
      tune.position = [root.position.x, root.position.y, root.position.z];
      tune.rotation = [root.rotation.x * toDeg, root.rotation.y * toDeg, root.rotation.z * toDeg];
      tune.emissive = material.emissiveIntensity;
    },
    commit: () => {},
  };
  root.traverse((child) => {
    child.userData.rig = rig;
  });
  return rig;
}

function LogoDebug({
  root,
  material,
  place,
  rig,
}: {
  root: Object3D;
  material: MeshStandardMaterial;
  place: LogoPlace;
  rig: LogoRig;
}) {
  const [values, set] = useControls(`Логотипы.${place.title}`, () => ({
    позиция: { value: place.position, step: 0.01 },
    "поворот °": { value: [0, place.rotationY * toDeg, 0] as Vec3, step: 1 },
    масштаб: { value: logoScale, min: 0.01, step: 0.01 },
    "цвет модели": logoColor,
    "цвет свечения": logoColor,
    свечение: { value: logoEmissive, min: 0, step: 0.05 },
    копировать: button(() => {
      copyJson(place.title, {
        position: roundVec(root.position),
        rotation: [
          round(root.rotation.x * toDeg),
          round(root.rotation.y * toDeg),
          round(root.rotation.z * toDeg),
        ],
        scale: round(root.scale.x),
        color: `#${material.color.getHexString()}`,
        emissiveColor: `#${material.emissive.getHexString()}`,
        emissive: round(material.emissiveIntensity),
      });
    }),
  }), { collapsed: true }) as unknown as [LogoPanel, (next: Partial<LogoPanel>) => void];

  rig.commit = () => {
    set({
      позиция: copyVec(rig.tune.position),
      "поворот °": copyVec(rig.tune.rotation),
      свечение: rig.tune.emissive,
    });
  };

  useLayoutEffect(() => {
    if (rig.dragging) {
      return;
    }
    const rotation = values["поворот °"];
    root.position.set(values.позиция[0], values.позиция[1], values.позиция[2]);
    root.rotation.set(rotation[0] * toRad, rotation[1] * toRad, rotation[2] * toRad);
    root.scale.setScalar(values.масштаб);
    material.color.set(values["цвет модели"]);
    material.emissive.set(values["цвет свечения"]);
    material.emissiveIntensity = values.свечение;
    rig.tune.position = copyVec(values.позиция);
    rig.tune.rotation = copyVec(rotation);
    rig.tune.emissive = values.свечение;
  }, [material, rig, root, values]);

  return null;
}

export function CoddLogos() {
  const gltf = useGLTF(coddLogoUrl, draco);
  const logos = useMemo(() => {
    return places.map((place) => {
      const material = new MeshStandardMaterial({
        color: logoColor,
        emissive: logoColor,
        emissiveIntensity: logoEmissive,
        roughness: 0.4,
        metalness: 0,
      });
      const root = gltf.scene.clone(true);
      paintLogo(root, material);
      root.scale.setScalar(logoScale);
      root.position.set(place.position[0], place.position[1], place.position[2]);
      root.rotation.y = place.rotationY;
      const rig = attachLogoRig(root, material);
      return { place, root, material, rig };
    });
  }, [gltf.scene]);

  useEffect(() => {
    return () => {
      logos.forEach((logo) => {
        logo.material.dispose();
      });
    };
  }, [logos]);

  return (
    <>
      {logos.map((logo) => (
        <primitive key={logo.place.id} object={logo.root} />
      ))}
      {import.meta.env.DEV ? <ClosedFolder path="Логотипы" /> : null}
      {import.meta.env.DEV ? logos.map((logo) => (
        <LogoDebug
          key={logo.place.id}
          root={logo.root}
          material={logo.material}
          place={logo.place}
          rig={logo.rig}
        />
      )) : null}
    </>
  );
}

useGLTF.preload(coddLogoUrl, draco);
