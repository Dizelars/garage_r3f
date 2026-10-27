import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { HDRJPGLoader } from "@monogrid/gainmap-js";
import {
  DefaultLoadingManager,
  EquirectangularReflectionMapping,
} from "three";
import { GroundedSkybox } from "three/addons/objects/GroundedSkybox.js";
import type { Texture } from "three";

type GainmapResult = {
  renderTarget: { texture: Texture };
  dispose: () => void;
};

type GainmapEnvironmentProps = {
  url: string;
  skyHeight: number;
  skyRadius: number;
  skyResolution: number;
  intensity: number;
};

export function GainmapEnvironment({
  url,
  skyHeight,
  skyRadius,
  skyResolution,
  intensity,
}: GainmapEnvironmentProps) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useLayoutEffect(() => {
    let disposed = false;
    let result: GainmapResult | null = null;
    let skybox: GroundedSkybox | null = null;

    const loader = new HDRJPGLoader(gl, DefaultLoadingManager);
    loader.load(url, (loaded) => {
      if (disposed) {
        loaded.dispose();
        return;
      }

      result = loaded;
      const texture = loaded.renderTarget.texture;
      texture.mapping = EquirectangularReflectionMapping;
      texture.needsUpdate = true;
      scene.environment = texture;
      scene.environmentIntensity = intensity;

      skybox = new GroundedSkybox(texture, skyHeight, skyRadius, skyResolution);
      skybox.position.y = skyHeight - 0.01;
      scene.add(skybox);
    });

    return () => {
      disposed = true;
      if (skybox) {
        scene.remove(skybox);
        skybox.geometry.dispose();
        if (Array.isArray(skybox.material)) {
          skybox.material.forEach((material) => material.dispose());
        } else {
          skybox.material.dispose();
        }
      }
      if (scene.environment === result?.renderTarget.texture) {
        scene.environment = null;
      }
      result?.dispose();
    };
  }, [gl, intensity, scene, skyHeight, skyRadius, skyResolution, url]);

  return null;
}
