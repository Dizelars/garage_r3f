import { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import type { FloorConfig } from "entities/model/types";
import { createRadialTexture, makeConcrete } from "shared/scene/makeConcrete";

type ConcreteFloorProps = {
  floor: FloorConfig;
};

export function ConcreteFloor({ floor }: ConcreteFloorProps) {
  const anisotropy = useThree((state) => state.gl.capabilities.getMaxAnisotropy());
  const textures = useMemo(
    () => makeConcrete(floor.textureSize, floor.tileMeters, floor.slabs, anisotropy),
    [anisotropy, floor.slabs, floor.textureSize, floor.tileMeters],
  );
  const alphaMap = useMemo(
    () => createRadialTexture(256, [
      [0, "#ffffff"],
      [0.55, "#ffffff"],
      [1, "#000000"],
    ]),
    [],
  );

  useLayoutEffect(() => {
    const repeat = (floor.radius * 2) / floor.tileMeters;
    textures.map.repeat.set(repeat, repeat);
    textures.normalMap.repeat.set(repeat, repeat);
    textures.roughnessMap.repeat.set(repeat, repeat);
  }, [floor.radius, floor.tileMeters, textures]);

  return (
    <mesh
      name="ConcreteFloor"
      rotation-x={-Math.PI / 2}
      position-y={floor.y}
      receiveShadow={false}
    >
      <circleGeometry args={[floor.radius, 96]} />
      <meshStandardMaterial
        map={textures.map}
        normalMap={textures.normalMap}
        roughnessMap={textures.roughnessMap}
        roughness={1}
        metalness={0}
        normalScale={floor.normalScale}
        alphaMap={alphaMap}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
