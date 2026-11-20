import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector2 } from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

type BloomProps = {
  glow: number;
};

export function Bloom({ glow }: BloomProps) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  const composer = useMemo(() => {
    const effect = new EffectComposer(gl);
    effect.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new Vector2(size.width, size.height),
      0.6 * glow,
      0.5,
      1,
    );
    bloom.enabled = glow > 0;
    effect.addPass(bloom);
    effect.addPass(new OutputPass());
    return effect;
  }, [camera, gl, glow, scene, size.height, size.width]);

  const composerRef = useRef(composer);
  composerRef.current = composer;

  useEffect(() => {
    composer.setPixelRatio(gl.getPixelRatio());
    composer.setSize(size.width, size.height);
    return () => {
      composer.dispose();
    };
  }, [composer, gl, size.height, size.width]);

  useFrame(() => {
    composerRef.current.render();
  }, 1);

  return null;
}
