import {
  Box3,
  DoubleSide,
  Euler,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  Quaternion,
  RectAreaLight,
  Vector3,
} from "three";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { keepSource, neonPoses, neonSources, type NeonLightPose } from "./garageLights";

const neonWidth = 0.3;
const neonIntensity = 5;
const toRad = Math.PI / 180;
const toDeg = 180 / Math.PI;

const box = new Box3();
const size = new Vector3();
const tubeLocal = new Vector3();
const inward = new Vector3();
const inwardLocal = new Vector3();
const zAxis = new Vector3();
const xAxis = new Vector3();
const yAxis = new Vector3();
const basis = new Matrix4();
const extraEuler = new Euler();
const extraQuat = new Quaternion();
const invAlign = new Quaternion();
const invMesh = new Quaternion();
const pickGeometry = new PlaneGeometry(1, 1);
const pickMaterial = new MeshBasicMaterial({
  transparent: true,
  opacity: 0,
  depthWrite: false,
  side: DoubleSide,
});

let rectAreaReady = false;

export type NeonTune = {
  enabled: boolean;
  color: string;
  intensity: number;
  width: number;
  height: number;
  position: [number, number, number];
  rotation: [number, number, number];
  helper: boolean;
};

export type NeonRig = {
  id: string;
  name: string;
  mesh: Mesh;
  light: RectAreaLight;
  helper: RectAreaLightHelper;
  emissive: MeshStandardMaterial | null;
  emissiveOn: number;
  pickMesh: Mesh;
  align: Quaternion;
  tune: NeonTune;
  pick: Object3D[];
  dragging: boolean;
  getIntensity: () => number;
  setIntensity: (value: number) => void;
  readTransform: () => void;
  commit: () => void;
};

function ownEmissive(mesh: Mesh, name: string): MeshStandardMaterial | null {
  const list = Array.isArray(mesh.material) ? mesh.material.slice() : [mesh.material];
  const index = list.findIndex((material) => material instanceof MeshStandardMaterial && material.name === name);
  const source = list[index];
  if (!(source instanceof MeshStandardMaterial)) {
    return null;
  }
  const copy = source.clone();
  list[index] = copy;
  mesh.material = list.length === 1 ? copy : list;
  return copy;
}

function applyNeonPose(tune: NeonTune, pose: NeonLightPose | undefined): void {
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
  if (pose.width !== undefined) {
    tune.width = pose.width;
  }
  if (pose.height !== undefined) {
    tune.height = pose.height;
  }
  if (pose.position) {
    tune.position = [...pose.position];
  }
  if (pose.rotation) {
    tune.rotation = [...pose.rotation];
  }
}

function initRectAreaLights(): void {
  if (rectAreaReady) {
    return;
  }
  RectAreaLightUniformsLib.init();
  rectAreaReady = true;
}

function isNeonMesh(mesh: Mesh): boolean {
  if (mesh.name.startsWith("Neon")) {
    return true;
  }
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return materials.some((material) => material.name === "Neon");
}

function tubeLength(mesh: Mesh): number {
  const geometry = mesh.geometry;
  if (!geometry.boundingBox) {
    geometry.computeBoundingBox();
  }
  box.copy(geometry.boundingBox ?? new Box3());
  box.getSize(size);
  size.multiply(mesh.scale);

  const axis = size.x >= size.y && size.x >= size.z
    ? "x"
    : size.z >= size.y
      ? "z"
      : "y";

  tubeLocal.set(axis === "x" ? 1 : 0, axis === "y" ? 1 : 0, axis === "z" ? 1 : 0);
  return Math.max(size[axis], 0.05);
}

function alignInMesh(mesh: Mesh): Quaternion {
  inward.set(-mesh.position.x, 0, -mesh.position.z);
  if (inward.lengthSq() < 1e-8) {
    inward.set(0, 0, 1);
  }
  inward.normalize();
  inwardLocal.copy(inward).applyQuaternion(mesh.quaternion.clone().invert());

  // RectAreaLight shines along local -Z. Keep local Y on the tube.
  zAxis.copy(inwardLocal).negate();
  if (zAxis.lengthSq() < 1e-8) {
    zAxis.set(0, 0, -1);
  }
  zAxis.normalize();

  xAxis.crossVectors(tubeLocal, zAxis);
  if (xAxis.lengthSq() < 1e-8) {
    const fallback = Math.abs(tubeLocal.y) > 0.9 ? new Vector3(1, 0, 0) : new Vector3(0, 1, 0);
    xAxis.crossVectors(fallback, zAxis);
  }
  xAxis.normalize();
  yAxis.crossVectors(zAxis, xAxis).normalize();
  return new Quaternion().setFromRotationMatrix(basis.makeBasis(xAxis, yAxis, zAxis));
}

function readNeonFromLight(rig: NeonRig): void {
  const { mesh, light, align, tune } = rig;
  tune.position = [
    light.position.x - mesh.position.x,
    light.position.y - mesh.position.y,
    light.position.z - mesh.position.z,
  ];
  invAlign.copy(align).invert();
  invMesh.copy(mesh.quaternion).invert();
  extraQuat.copy(invAlign).multiply(invMesh).multiply(light.quaternion);
  extraEuler.setFromQuaternion(extraQuat, "XYZ");
  tune.rotation = [
    extraEuler.x * toDeg,
    extraEuler.y * toDeg,
    extraEuler.z * toDeg,
  ];
}

export function attachNeonLights(root: Object3D): NeonRig[] {
  initRectAreaLights();
  const rigs: NeonRig[] = [];

  root.traverse((child) => {
    if (!(child instanceof Mesh) || !isNeonMesh(child)) {
      return;
    }
    if (!keepSource(child.name, neonSources)) {
      const unused = ownEmissive(child, "Neon");
      if (unused) {
        unused.emissiveIntensity = 0;
      }
      return;
    }

    const length = tubeLength(child);
    const align = alignInMesh(child);
    const light = new RectAreaLight("#ffffff", neonIntensity, neonWidth, length);
    light.name = child.name;
    light.position.copy(child.position);
    light.quaternion.copy(child.quaternion).multiply(align);
    const helper = new RectAreaLightHelper(light);
    helper.visible = import.meta.env.DEV;
    const pickMesh = new Mesh(pickGeometry, pickMaterial);
    pickMesh.name = `${child.name}_pick`;
    pickMesh.visible = import.meta.env.DEV;
    light.add(helper);
    light.add(pickMesh);
    (child.parent ?? root).add(light);

    const emissive = ownEmissive(child, "Neon");
    const tune: NeonTune = {
      enabled: true,
      color: "#ffffff",
      intensity: neonIntensity,
      width: neonWidth,
      height: length,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      helper: false,
    };
    applyNeonPose(tune, neonPoses[child.name]);
    const pick = [pickMesh];
    const rig: NeonRig = {
      id: child.name,
      name: child.name,
      mesh: child,
      light,
      helper,
      emissive,
      emissiveOn: emissive ? emissive.emissiveIntensity : 0,
      pickMesh,
      align,
      tune,
      pick,
      dragging: false,
      getIntensity: () => tune.intensity,
      setIntensity: (value) => {
        tune.intensity = Math.max(0, value);
      },
      readTransform: () => {
        readNeonFromLight(rig);
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

export function applyNeonRig(rig: NeonRig, level: number): void {
  const { mesh, light, helper, emissive, pickMesh, align, tune } = rig;
  const power = tune.enabled ? 1 : 0;
  if (!rig.dragging) {
    light.position.set(
      mesh.position.x + tune.position[0],
      mesh.position.y + tune.position[1],
      mesh.position.z + tune.position[2],
    );
    extraEuler.set(tune.rotation[0] * toRad, tune.rotation[1] * toRad, tune.rotation[2] * toRad);
    extraQuat.setFromEuler(extraEuler);
    light.quaternion.copy(mesh.quaternion).multiply(align).multiply(extraQuat);
    light.scale.set(1, 1, 1);
  }

  light.color.set(tune.color);
  light.width = Math.max(tune.width, 0.01);
  light.height = Math.max(tune.height, 0.01);
  light.intensity = Math.max(level, 0) * Math.max(tune.intensity, 0) * power;
  if (emissive) {
    emissive.emissiveIntensity = power * rig.emissiveOn;
  }
  pickMesh.scale.set(light.width, light.height, 1);
  pickMesh.visible = tune.helper;
  helper.visible = tune.helper;
}
