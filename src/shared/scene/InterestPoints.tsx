import { useState } from "react";
import { Html } from "@react-three/drei";
import type { InterestPoint } from "entities/model/types";

type InterestPointsProps = {
  points: InterestPoint[];
};

export function InterestPoints({ points }: InterestPointsProps) {
  const [openedId, setOpenedId] = useState<string | null>(null);

  return (
    <>
      {points.map((point) => {
        const opened = openedId === point.id;
        return (
          <Html
            key={point.id}
            position={point.position}
            center
            distanceFactor={7}
            zIndexRange={opened ? [12, 0] : [4, 0]}
            wrapperClass="interest-point-wrap"
          >
            <div className={opened ? "interest-point opened" : "interest-point"}>
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
                  setOpenedId((current) => (current === point.id ? null : point.id));
                }}
              >
                <span className="interest-point__pulse" />
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
                      setOpenedId(null);
                    }}
                  >
                    Закрыть
                  </button>
                </div>
              ) : null}
            </div>
          </Html>
        );
      })}
    </>
  );
}
