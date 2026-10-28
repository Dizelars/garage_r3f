import { useRef, useState } from "react";
import { Html } from "@react-three/drei";
import type { Group, Object3D } from "three";
import type { InterestPoint } from "entities/model/types";
import { usePointOcclusion } from "./usePointOcclusion";

type InterestPointsProps = {
  points: InterestPoint[];
  occluder: Object3D;
};

function pointClassName(opened: boolean, occluded: boolean): string {
  const names = ["interest-point"];
  if (opened) {
    names.push("opened");
  }
  if (occluded && !opened) {
    names.push("occluded");
  }
  return names.join(" ");
}

function InterestPointView({
  point,
  opened,
  occluder,
  onToggle,
  onClose,
}: {
  point: InterestPoint;
  opened: boolean;
  occluder: Object3D;
  onToggle: () => void;
  onClose: () => void;
}) {
  const anchor = useRef<Group>(null);
  const occluded = usePointOcclusion(anchor, occluder);

  return (
    <group ref={anchor} position={point.position}>
      <Html
        center
        distanceFactor={7}
        zIndexRange={opened ? [12, 0] : [4, 0]}
        wrapperClass="interest-point-wrap"
      >
        <div className={pointClassName(opened, occluded)}>
          <button
            type="button"
            className="interest-point__dot"
            aria-expanded={opened}
            aria-label={point.title}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
          >
            <span className="interest-point__pulse" />
            <span className="interest-point__pulse interest-point__pulse--delay" />
          </button>
          {opened ? (
            <div className="interest-point__card">
              <p className="interest-point__title">{point.title}</p>
              <p className="interest-point__text">{point.description}</p>
              <button
                type="button"
                className="interest-point__close"
                onPointerDown={(event) => {
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  onClose();
                }}
              >
                Закрыть
              </button>
            </div>
          ) : null}
        </div>
      </Html>
    </group>
  );
}

export function InterestPoints({ points, occluder }: InterestPointsProps) {
  const [openedId, setOpenedId] = useState<string | null>(null);

  return (
    <>
      {points.map((point) => (
        <InterestPointView
          key={point.id}
          point={point}
          opened={openedId === point.id}
          occluder={occluder}
          onToggle={() => {
            setOpenedId((current) => (current === point.id ? null : point.id));
          }}
          onClose={() => setOpenedId(null)}
        />
      ))}
    </>
  );
}
