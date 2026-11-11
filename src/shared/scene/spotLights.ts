import {
  Euler,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  Quaternion,
  SphereGeometry,
  SpotLight,
  SpotLightHelper,
  Vector3,
} from "three";
import { keepSource, spotPoses, spotSources, type SpotLightPose } from "./garageLights";
import {
  spotAngle,
  spotCandela,
  spotColor,
  spotDecay,
  spotDistance,
  spotOffset,
  spotPenumbra,
} from "./garageTune";

const ledDrop = 0.02;
const toRad = Math.PI / 180;
const toDeg = 180 / Math.PI;
const grabGeometry = new SphereGeometry(0.18, 16, 12);
const aimEuler = new Euler();
const worldQuat = new Quaternion();
const beam = new Vector3();
const beamOrigin = new Vector3();
const coneUp = new Vector3();

export type SpotTune = {
  enabled: boolean;
  color: string;
  intensity: number;
  distance: number;
  angle: number;
  penumbra: number;
  decay: number;
  position: [number, number, number];
  rotation: [number, number, number];
  helper: boolean;
};

export type SpotRig = {
  id: string;
  name: string;
  light: SpotLight;
  led: MeshStandardMaterial | null;
  helper: SpotLightHelper | null;
  grab: Mesh | null;
  tune: SpotTune;
  pick: Object3D[];
  dragging: boolean;
  getIntensity: () => number;
  setIntensity: (value: number) => void;
  readTransform: () => void;
  commit: () => void;
};

function findLed(node: Object3D): Mesh | null {
  let found: Mesh | null = null;
  const visit = (mesh: Mesh) => {
    const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    if (list.some((material) => material.name === "Led")) {
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

function ownLed(mesh: Mesh, shared: MeshStandardMaterial): MeshStandardMaterial {
  const copy = shared.clone();
  if (Array.isArray(mesh.material)) {
    mesh.material = mesh.material.map((material) => material === shared ? copy : material);
  } else {
    mesh.material = copy;
  }
  return copy;
}

function applySpotPose(tune: SpotTune, pose: SpotLightPose | undefined): void {
  if (!pose) {
    return;
  }
  if (pose.enabled !== undefined) {
    tune.enabled = pose.enabled;
  }
  if (pose.color !== undefined) {
    tune.color = pose.color;
  }
  if (pose.intensity !== undefined) {
    tune.intensity = pose.intensity;
  }
  if (pose.distance !== undefined) {
    tune.distance = pose.distance;
  }
  if (pose.angle !== undefined) {
    tune.angle = pose.angle;
  }
  if (pose.penumbra !== undefined) {
    tune.penumbra = pose.penumbra;
  }
  if (pose.decay !== undefined) {
    tune.decay = pose.decay;
  }
  if (pose.position) {
    tune.position = [...pose.position];
  }
  if (pose.rotation) {
    tune.rotation = [...pose.rotation];
  }
}

function createTune(): SpotTune {
  return {
    enabled: true,
    color: spotColor,
    intensity: spotCandela,
    distance: spotDistance,
    angle: (spotAngle * 180) / Math.PI,
    penumbra: spotPenumbra,
    decay: spotDecay,
    position: [...spotOffset],
    rotation: [0, 0, 0],
    helper: false,
  };
}

export function attachSpotLights(root: Object3D): SpotRig[] {
  const rigs: SpotRig[] = [];

  root.traverse((child) => {
    if (!child.name.startsWith("Ceilinglight_")) {
      return;
    }
    const mesh = findLed(child);
    if (!mesh) {
      return;
    }
    const foundLed = exposeLed(mesh);
    const led = foundLed ? ownLed(mesh, foundLed) : null;
    if (!keepSource(child.name, spotSources)) {
      if (led) {
        led.emissiveIntensity = 0;
      }
      return;
    }

    const pose = spotPoses[child.name];
    const tune = createTune();
    applySpotPose(tune, pose);
    const light = new SpotLight(
      tune.color,
      0,
      tune.distance,
      (tune.angle * Math.PI) / 180,
      tune.penumbra,
      tune.decay,
    );
    light.name = child.name;
    light.position.set(tune.position[0], tune.position[1], tune.position[2]);
    if (pose?.rotation) {
      light.rotation.set(tune.rotation[0] * toRad, tune.rotation[1] * toRad, tune.rotation[2] * toRad);
    } else {
      child.getWorldQuaternion(worldQuat);
      light.quaternion.copy(worldQuat).invert();
      aimEuler.setFromQuaternion(light.quaternion, "XYZ");
      light.quaternion.setFromEuler(aimEuler);
      tune.rotation = [aimEuler.x * toDeg, aimEuler.y * toDeg, aimEuler.z * toDeg];
    }
    const target = new Object3D();
    target.position.set(0, -1, 0);
    light.add(target);
    light.target = target;
    child.add(light);

    const pick: Object3D[] = [];
    let helper: SpotLightHelper | null = null;
    let grab: Mesh | null = null;
    if (import.meta.env.DEV) {
      helper = new SpotLightHelper(light);
      helper.visible = true;
      grab = new Mesh(grabGeometry, new MeshBasicMaterial({
        color: "#ffb45a",
        depthTest: false,
        depthWrite: false,
        transparent: true,
        opacity: 0.95,
        toneMapped: false,
      }));
      grab.name = `${child.name}_grab`;
      grab.renderOrder = 20;
      light.add(grab);
      pick.push(grab);
    }

    const rig: SpotRig = {
      id: child.name,
      name: child.name,
      light,
      led,
      helper,
      grab,
      tune,
      pick,
      dragging: false,
      getIntensity: () => tune.intensity,
      setIntensity: (value) => {
        tune.intensity = Math.max(0, value);
      },
      readTransform: () => {
        tune.position = [light.position.x, light.position.y, light.position.z];
        aimEuler.setFromQuaternion(light.quaternion, "XYZ");
        tune.rotation = [aimEuler.x * toDeg, aimEuler.y * toDeg, aimEuler.z * toDeg];
      },
      commit: () => {},
    };
    pick.forEach((object) => {
      object.userData.rig = rig;
    });
    rigs.push(rig);
  });

  rigs.sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }));
  return rigs;
}

export function applySpotRig(rig: SpotRig, level: number, glow: number): void {
  const { light, led, helper, grab, tune } = rig;
  const power = tune.enabled ? 1 : 0;
  if (!rig.dragging) {
    light.position.set(tune.position[0], tune.position[1], tune.position[2]);
    light.rotation.set(tune.rotation[0] * toRad, tune.rotation[1] * toRad, tune.rotation[2] * toRad);
    light.distance = tune.distance;
    light.angle = (Math.min(Math.max(tune.angle, 0), 90) * Math.PI) / 180;
    light.penumbra = tune.penumbra;
    light.decay = tune.decay;
    light.color.set(tune.color);
  }
  light.intensity = Math.max(level, 0) * Math.max(tune.intensity, 0) * power;
  if (led) {
    led.emissiveIntensity = Math.max(level, 0) * Math.max(glow, 0) * power;
  }
  if (helper) {
    helper.visible = tune.helper;
    light.target.getWorldPosition(beam);
    light.getWorldPosition(beamOrigin);
    beam.sub(beamOrigin);
    coneUp.set(0, 1, 0);
    if (beam.lengthSq() < 1e-8 || Math.abs(beam.normalize().dot(coneUp)) > 0.95) {
      coneUp.set(1, 0, 0);
    }
    helper.cone.up.copy(coneUp);
    helper.update();
  }
  if (grab) {
    grab.visible = tune.helper;
  }
}
