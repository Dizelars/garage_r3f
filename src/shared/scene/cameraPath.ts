import { Mesh, Raycaster, Vector3, type Material, type Object3D } from "three";

const clearance = 0.4;
const floorY = 0.4;
const ceilingY = 2.05;
const rayNear = 0.05;
const endSlack = 0.12;

const raycaster = new Raycaster();
const direction = new Vector3();
const side = new Vector3();
const lift = new Vector3();
const origin = new Vector3();
const worldUp = new Vector3(0, 1, 0);
const via = new Vector3();
const across = new Vector3();
const raisedStart = new Vector3();
const raisedEnd = new Vector3();

function materialBlocks(material: Material): boolean {
  return material.opacity >= 0.2;
}

function meshBlocks(mesh: Mesh): boolean {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return materials.some(materialBlocks);
}

export function collectBlockers(root: Object3D): Mesh[] {
  const meshes: Mesh[] = [];
  root.traverse((child) => {
    if (!(child instanceof Mesh) || !child.visible || !meshBlocks(child)) {
      return;
    }
    if (child.userData.rig || child.userData.pivot) {
      return;
    }
    meshes.push(child);
  });
  return meshes;
}

function segmentClear(from: Vector3, to: Vector3, blockers: Mesh[]): boolean {
  direction.subVectors(to, from);
  const distance = direction.length();
  if (distance < 1e-4) {
    return true;
  }
  direction.multiplyScalar(1 / distance);
  const far = distance - endSlack;
  if (far <= rayNear) {
    return true;
  }

  side.crossVectors(direction, worldUp);
  if (side.lengthSq() < 1e-6) {
    side.set(1, 0, 0);
  }
  side.normalize();
  lift.crossVectors(side, direction).normalize();

  const offsets: Array<[Vector3, number]> = [
    [side, 0],
    [side, clearance],
    [side, -clearance],
    [lift, clearance],
    [lift, -clearance],
  ];

  for (let index = 0; index < offsets.length; index += 1) {
    const [axis, amount] = offsets[index];
    origin.copy(from);
    if (amount !== 0) {
      origin.addScaledVector(axis, amount);
    }
    raycaster.set(origin, direction);
    raycaster.near = rayNear;
    raycaster.far = far;
    const hit = raycaster.intersectObjects(blockers, false)[0];
    if (hit) {
      return false;
    }
  }

  return true;
}

function copyVia(source: Vector3): Vector3 {
  return source.clone();
}

export function planCameraPath(start: Vector3, end: Vector3, blockers: Mesh[]): Vector3[] {
  if (segmentClear(start, end, blockers)) {
    return [start.clone(), end.clone()];
  }

  across.subVectors(end, start);
  across.y = 0;
  if (across.lengthSq() < 1e-6) {
    across.set(0, 0, 1);
  }
  across.normalize();
  across.set(-across.z, 0, across.x);

  const lifts = [0.7, 1.15];
  const shifts = [0, 0.9, -0.9, 1.4, -1.4];

  for (let liftIndex = 0; liftIndex < lifts.length; liftIndex += 1) {
    for (let shiftIndex = 0; shiftIndex < shifts.length; shiftIndex += 1) {
      via.copy(start).lerp(end, 0.5);
      via.y = Math.min(ceilingY, Math.max(start.y, end.y, via.y) + lifts[liftIndex]);
      via.y = Math.max(floorY, via.y);
      via.addScaledVector(across, shifts[shiftIndex]);
      if (segmentClear(start, via, blockers) && segmentClear(via, end, blockers)) {
        return [start.clone(), copyVia(via), end.clone()];
      }
    }
  }

  const top = Math.min(ceilingY, Math.max(start.y, end.y, floorY) + 1.15);
  raisedStart.copy(start);
  raisedStart.y = top;
  raisedEnd.copy(end);
  raisedEnd.y = top;
  if (
    segmentClear(start, raisedStart, blockers)
    && segmentClear(raisedStart, raisedEnd, blockers)
    && segmentClear(raisedEnd, end, blockers)
  ) {
    return [start.clone(), raisedStart.clone(), raisedEnd.clone(), end.clone()];
  }

  return [start.clone(), end.clone()];
}
