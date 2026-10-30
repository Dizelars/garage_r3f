import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { LoopRepeat, Mesh, MeshStandardMaterial, type AnimationClip, type Object3D } from "three";
import type { SceneConfig } from "entities/model/types";
import { InterestPoints } from "shared/scene/InterestPoints";
import { PointPlacer } from "./PointPlacer";
import { visibleInterestPoints, type PlacedPoint, type PointHover, type Vec3 } from "./pointDraft";
import { collectStrobeFrames, showStrobeFrame } from "shared/scene/strobeFrames";

const strobeStepSeconds = 0.18;

type VehicleModelProps = {
  config: SceneConfig;
  animationPlaying: boolean;
  showInterestPoints: boolean;
  placing: boolean;
  drafts: PlacedPoint[];
  editingKey: string | null;
  onPlace: (point: PlacedPoint) => void;
  onRetarget: (key: string, position: Vec3) => void;
  onHover: (hover: PointHover | null) => void;
};

function ClipPlayer({
  clips,
  root,
  playing,
}: {
  clips: AnimationClip[];
  root: Object3D;
  playing: boolean;
}) {
  const { actions } = useAnimations(clips, root);

  useEffect(() => {
    clips.forEach((clip) => {
      const action = actions[clip.name];
      if (!action) {
        return;
      }
      if (!playing) {
        action.stop();
        return;
      }
      action.reset();
      action.setLoop(LoopRepeat, Infinity);
      action.play();
    });
  }, [actions, clips, playing]);

  return null;
}

export function VehicleModel({
  config,
  animationPlaying,
  showInterestPoints,
  placing,
  drafts,
  editingKey,
  onPlace,
  onRetarget,
  onHover,
}: VehicleModelProps) {
  const gltf = useGLTF(config.modelUrl, config.draco);
  const model = useMemo(() => {
    const object = gltf.scene.clone(true);
    object.position.set(...config.modelPosition);
    object.rotation.y = config.modelRotationY;
    object.scale.setScalar(config.modelScale);

    object.traverse((child) => {
      if (!(child instanceof Mesh)) {
        return;
      }

      child.castShadow = false;
      child.receiveShadow = false;

      if (config.metalness === undefined || child.name !== "Metal") {
        return;
      }

      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material instanceof MeshStandardMaterial) {
          material.metalness = config.metalness ?? material.metalness;
          material.needsUpdate = true;
        }
      });
    });

    if (config.animated) {
      showStrobeFrame(collectStrobeFrames(object), -1);
    }

    return object;
  }, [config, gltf.scene]);

  const frames = useMemo(() => collectStrobeFrames(model), [model]);
  const frameIndex = useRef(0);
  const frameTime = useRef(0);

  useEffect(() => {
    if (!config.animated) {
      return;
    }
    frameIndex.current = 0;
    frameTime.current = 0;
    showStrobeFrame(frames, animationPlaying ? 0 : -1);
  }, [animationPlaying, config.animated, frames]);

  useFrame((_, delta) => {
    if (!animationPlaying || frames.length < 2) {
      return;
    }

    frameTime.current += delta;
    if (frameTime.current < strobeStepSeconds) {
      return;
    }

    frameTime.current = 0;
    frameIndex.current = (frameIndex.current + 1) % frames.length;
    showStrobeFrame(frames, frameIndex.current);
  });

  const points = showInterestPoints
    ? visibleInterestPoints(config.interestPoints, drafts, placing ? editingKey : null)
    : undefined;

  return (
    <>
      {config.animated && gltf.animations.length > 0 ? (
        <ClipPlayer clips={gltf.animations} root={model} playing={animationPlaying} />
      ) : null}
      <PointPlacer
        object={model}
        active={placing}
        points={drafts}
        editingKey={editingKey}
        onPlace={onPlace}
        onRetarget={onRetarget}
        onHover={onHover}
      >
        {points && points.length > 0 ? <InterestPoints points={points} occluder={model} /> : null}
      </PointPlacer>
    </>
  );
}
