import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Mesh, MeshStandardMaterial, Object3D, SpotLight, Vector3 } from "three";

const garageUrl = "models/garage/scene_2/gltf_action/ModernDarkGarage.gltf";
const draco = "/draco/";

const roomPosition: [number, number, number] = [0, 0.12, 0];
const spotCandela = 25;
const lampGlow = 1;
const fadeSeconds = 2;

type CeilingLamp = {
  light: SpotLight;
  target: Object3D;
};

const ledDrop = 0.02;
const lampWorld = new Vector3();
const aimPoint = new Vector3();

function findLed(node: Object3D): Mesh | null {
  let found: Mesh | null = null;
  const visit = (mesh: Mesh) => {
    const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const hasLed = list.some((material) => material.name === "Led");
    if (hasLed) {
      found = mesh;
    }
  };
  if (node instanceof Mesh) {
    visit(node);
  }
  node.traverse((child) => {
    if (child !== node && child instanceof Mesh) {
      visit(child);
    }
  });
  return found;
}

function exposeLed(mesh: Mesh): MeshStandardMaterial | null {
  const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  const led = list.find((material) => material instanceof MeshStandardMaterial && material.name === "Led");
  if (!(led instanceof MeshStandardMaterial)) {
    return null;
  }
  if (mesh.userData.ledDropped !== true) {
    mesh.position.y -= ledDrop;
    mesh.userData.ledDropped = true;
  }
  led.emissive.set("#ffffff");
  led.toneMapped = false;
  return led;
}

function addCeilingLights(root: Object3D, lamps: Map<string, CeilingLamp>): MeshStandardMaterial | null {
  let found: MeshStandardMaterial | null = null;
  root.traverse((child) => {
    if (!child.name.startsWith("Ceilinglight_")) {
      return;
    }

    const mesh = findLed(child);
    if (!mesh) {
      return;
    }
    const led = exposeLed(mesh);

    const light = new SpotLight("#fff4e6", 0, 14, Math.PI / 3, 0.6, 2);
    light.name = child.name;
    light.position.set(0, -0.08, 0);
    const target = new Object3D();
    child.add(light);
    child.add(target);
    light.target = target;
    lamps.set(child.name, { light, target });
    if (led) {
      found = led;
    }
  });
  return found;
}

export function GarageRoom({ lightsOn }: { lightsOn: boolean }) {
  const gltf = useGLTF(garageUrl, draco);
  const ceilingLamps = useRef(new Map<string, CeilingLamp>());
  const ledMaterial = useRef<MeshStandardMaterial | null>(null);
  const master = useRef(lightsOn ? 1 : 0);
  const lightsOnRef = useRef(lightsOn);
  lightsOnRef.current = lightsOn;
  const room = useMemo(() => {
    const object = gltf.scene.clone(true);
    const lamps = new Map<string, CeilingLamp>();
    ledMaterial.current = addCeilingLights(object, lamps);
    ceilingLamps.current = lamps;
    return object;
  }, [gltf.scene]);

  useFrame((_, delta) => {
    const destination = lightsOnRef.current ? 1 : 0;
    const blend = 1 - Math.exp(-delta / fadeSeconds);
    master.current += (destination - master.current) * blend;
    const level = master.current;
    if (ledMaterial.current) {
      ledMaterial.current.emissiveIntensity = level * lampGlow;
    }

    ceilingLamps.current.forEach((lamp) => {
      lamp.light.getWorldPosition(lampWorld);
      aimPoint.set(lampWorld.x, lampWorld.y - 1, lampWorld.z);
      const parent = lamp.target.parent;
      if (parent) {
        parent.worldToLocal(aimPoint);
        lamp.target.position.copy(aimPoint);
        lamp.target.updateMatrixWorld();
      }

      lamp.light.intensity = level * spotCandela;
    });
  });

  return <primitive object={room} position={roomPosition} />;
}

useGLTF.preload(garageUrl, draco);
