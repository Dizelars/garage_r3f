import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  PlaneGeometry,
  type ShaderMaterial,
} from "three";
import { Reflector } from "three/addons/objects/Reflector.js";
import type { ReflectionConfig } from "entities/model/types";

const mirrorShader = {
  name: "DockFloorReflection",
  uniforms: {
    color: { value: null },
    tDiffuse: { value: null },
    textureMatrix: { value: null },
    strength: { value: 0.2 },
  },
  vertexShader: `
    uniform mat4 textureMatrix;
    varying vec4 vUv;
    varying vec2 vP;

    void main() {
      vUv = textureMatrix * vec4(position, 1.0);
      vP = position.xy;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float strength;
    varying vec4 vUv;
    varying vec2 vP;

    void main() {
      vec2 uv = vUv.xy / vUv.w;
      vec3 acc = vec3(0.0);
      float weight = 0.0;

      for (int x = -2; x <= 2; x++) {
        for (int y = -2; y <= 2; y++) {
          float w = 1.0 - 0.15 * float(abs(x) + abs(y));
          acc += texture2D(tDiffuse, uv + vec2(float(x), float(y)) * 0.007).rgb * w;
          weight += w;
        }
      }

      float fade = 1.0 - smoothstep(2.0, 9.0, length(vP));
      gl_FragColor = vec4(acc / weight * strength * fade, 1.0);

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
};

type DockReflectionProps = {
  reflection: ReflectionConfig;
};

export function DockReflection({ reflection }: DockReflectionProps) {
  const gl = useThree((state) => state.gl);
  const size = useThree((state) => state.size);
  const mirror = useMemo(() => {
    const shader = {
      ...mirrorShader,
      uniforms: {
        ...mirrorShader.uniforms,
        strength: { value: reflection.strength },
      },
    };
    const reflector = new Reflector(new PlaneGeometry(40, 40), {
      textureWidth: 512,
      textureHeight: 512,
      clipBias: 0.003,
      shader,
    });
    reflector.name = "DockFloorReflection";
    reflector.rotation.x = -Math.PI / 2;
    reflector.position.y = reflection.mirrorY;
    reflector.renderOrder = 1;
    const material = reflector.material as ShaderMaterial;
    material.transparent = true;
    material.blending = AdditiveBlending;
    material.depthWrite = false;
    return reflector;
  }, [reflection.mirrorY, reflection.strength]);

  useEffect(() => {
    const pixelRatio = gl.getPixelRatio();
    mirror.getRenderTarget().setSize(
      Math.max(128, Math.round(size.width * pixelRatio * reflection.scale)),
      Math.max(128, Math.round(size.height * pixelRatio * reflection.scale)),
    );
  }, [gl, mirror, reflection.scale, size.height, size.width]);

  return <primitive object={mirror} />;
}
