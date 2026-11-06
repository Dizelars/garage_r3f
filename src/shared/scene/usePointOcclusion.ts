import { useRef, useState, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Raycaster, Vector3, type Intersection, type Material, type Object3D } from "three";

const surfaceEpsilon = 0.08;

function materialBlocksView(material: Material): boolean {
  return material.opacity >= 0.85 && !material.transparent;
}

function blocksView(hit: Intersection): boolean {
  if (!(hit.object instanceof Mesh) || !hit.object.visible) {
    return false;
  }
  const materials = Array.isArray(hit.object.material) ? hit.object.material : [hit.object.material];
  return materials.some(materialBlocksView);
}

export function usePointOcclusion(anchor: RefObject<Object3D | null>, occluder: Object3D | null): boolean {
  const [occluded, setOccluded] = useState(false);
  const occludedRef = useRef(false);
  const raycaster = useRef(new Raycaster());
  const origin = useRef(new Vector3());
  const point = useRef(new Vector3());
  const direction = useRef(new Vector3());
  const frame = useRef(0);

  useFrame(({ camera }) => {
    const node = anchor.current;
    frame.current += 1;
    if (!node || !occluder) {
      if (occludedRef.current) {
        occludedRef.current = false;
        setOccluded(false);
      }
      return;
    }
    if (frame.current % 2 !== 0) {
      return;
    }

    node.getWorldPosition(point.current);
    origin.current.copy(camera.position);
    direction.current.copy(point.current).sub(origin.current);
    const distance = direction.current.length();
    if (distance < 1e-4) {
      return;
    }
    direction.current.multiplyScalar(1 / distance);
    const ray = raycaster.current;
    ray.set(origin.current, direction.current);
    ray.far = Math.max(0, distance - surfaceEpsilon);
    const hidden = ray.intersectObject(occluder, true).some(blocksView);
    if (hidden !== occludedRef.current) {
      occludedRef.current = hidden;
      setOccluded(hidden);
    }
  });

  return occluded;
}
