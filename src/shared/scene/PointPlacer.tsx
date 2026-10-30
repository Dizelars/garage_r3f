import { useEffect, useRef, useState, type ReactNode } from "react";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Mesh, Raycaster, Vector2, type Group, type Object3D, type Vector3 } from "three";
import { usePointOcclusion } from "./usePointOcclusion";
import {
  createPointKey,
  formatPlacedPoint,
  formatPlacedPoints,
  formatPosition,
  meshName,
  nextPointId,
  roundCoord,
  roundPosition,
  type PlacedPoint,
  type PointFieldPatch,
  type PointHover,
  type Vec3,
} from "./pointDraft";

const clickSlopPx = 4;

type PointPlacerProps = {
  object: Object3D;
  active: boolean;
  points: PlacedPoint[];
  editingKey: string | null;
  onPlace: (point: PlacedPoint) => void;
  onRetarget: (key: string, position: Vec3) => void;
  onHover: (hover: PointHover | null) => void;
  children?: ReactNode;
};

export function PointPlacer({
  object,
  active,
  points,
  editingKey,
  onPlace,
  onRetarget,
  onHover,
  children,
}: PointPlacerProps) {
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const editingKeyRef = useRef(editingKey);
  const pointsRef = useRef(points);
  const onPlaceRef = useRef(onPlace);
  const onRetargetRef = useRef(onRetarget);
  editingKeyRef.current = editingKey;
  pointsRef.current = points;
  onPlaceRef.current = onPlace;
  onRetargetRef.current = onRetarget;

  useEffect(() => {
    const canvas = gl.domElement;
    if (!active) {
      return;
    }
    const previous = canvas.style.cursor;
    canvas.style.cursor = "crosshair";

    const raycaster = new Raycaster();
    const pointer = new Vector2();
    const origin = { x: 0, y: 0 };
    let pressed = false;
    let dragged = false;

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || event.target !== canvas) {
        pressed = false;
        return;
      }
      origin.x = event.clientX;
      origin.y = event.clientY;
      pressed = true;
      dragged = false;
    };
    const onMove = (event: PointerEvent) => {
      if (!pressed || event.buttons === 0) {
        return;
      }
      const dx = event.clientX - origin.x;
      const dy = event.clientY - origin.y;
      if (dx * dx + dy * dy > clickSlopPx * clickSlopPx) {
        dragged = true;
      }
    };
    const onUp = (event: PointerEvent) => {
      if (!pressed || event.button !== 0) {
        return;
      }
      pressed = false;
      const dx = event.clientX - origin.x;
      const dy = event.clientY - origin.y;
      if (dragged || dx * dx + dy * dy > clickSlopPx * clickSlopPx) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }
      pointer.set(
        ((origin.x - rect.left) / rect.width) * 2 - 1,
        -((origin.y - rect.top) / rect.height) * 2 + 1,
      );
      camera.updateMatrixWorld();
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObject(object, true).find((item) => item.object instanceof Mesh);
      if (!hit) {
        return;
      }
      const local = object.worldToLocal(hit.point.clone());
      const position = roundPosition(local.x, local.y, local.z);
      const key = editingKeyRef.current;
      if (key) {
        onRetargetRef.current(key, position);
        return;
      }
      const mesh = meshName(hit.object, object);
      const drafts = pointsRef.current;
      onPlaceRef.current({
        key: createPointKey(),
        id: nextPointId(mesh, drafts),
        title: mesh,
        description: "",
        mesh,
        position,
      });
    };

    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      canvas.style.cursor = previous;
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [active, camera, gl, object]);

  const readHit = (event: { object: Object3D; point: Vector3 }) => {
    const local = object.worldToLocal(event.point.clone());
    return {
      mesh: meshName(event.object, object),
      position: roundPosition(local.x, local.y, local.z),
    };
  };

  const handleHover = (event: ThreeEvent<PointerEvent>) => {
    onHover(readHit(event));
  };

  return (
    <primitive
      object={object}
      onPointerMove={active ? handleHover : undefined}
      onPointerOut={active ? () => onHover(null) : undefined}
    >
      {children}
      {active ? <PointMarkers points={points} editingKey={editingKey} occluder={object} /> : null}
    </primitive>
  );
}

function PointMarkers({
  points,
  editingKey,
  occluder,
}: {
  points: PlacedPoint[];
  editingKey: string | null;
  occluder: Object3D;
}) {
  const editing = points.find((point) => point.key === editingKey);
  const anchor = useRef<Group>(null);
  const occluded = usePointOcclusion(anchor, editing ? occluder : null);
  if (!editing) {
    return null;
  }

  return (
    <group ref={anchor} position={editing.position}>
      <Html
        center
        distanceFactor={7}
        zIndexRange={[11, 0]}
        wrapperClass="interest-point-wrap"
      >
        <div className={occluded ? "interest-point editing occluded" : "interest-point editing"}>
          <button type="button" className="interest-point__dot" tabIndex={-1} aria-hidden>
            <span className="interest-point__pulse" />
            <span className="interest-point__pulse interest-point__pulse--delay" />
          </button>
        </div>
      </Html>
    </group>
  );
}

const axisNames = ["x", "y", "z"] as const;

function PositionFields({
  position,
  onChange,
}: {
  position: Vec3;
  onChange: (position: Vec3) => void;
}) {
  const [text, setText] = useState<[string, string, string]>([
    String(position[0]),
    String(position[1]),
    String(position[2]),
  ]);
  const focused = useRef(false);

  useEffect(() => {
    if (focused.current) {
      return;
    }
    setText([String(position[0]), String(position[1]), String(position[2])]);
  }, [position]);

  return (
    <div className="point-placer__axes">
      {axisNames.map((axis, index) => (
        <label key={axis} className="point-placer__field">
          {axis}
          <input
            inputMode="decimal"
            value={text[index]}
            onFocus={() => {
              focused.current = true;
            }}
            onBlur={() => {
              focused.current = false;
              setText([String(position[0]), String(position[1]), String(position[2])]);
            }}
            onChange={(event) => {
              const raw = event.target.value.replace(",", ".");
              const next: [string, string, string] = [text[0], text[1], text[2]];
              next[index] = raw;
              setText(next);
              if (!/^-?\d+(\.\d+)?$/.test(raw)) {
                return;
              }
              const nextPosition: Vec3 = [position[0], position[1], position[2]];
              nextPosition[index] = roundCoord(Number(raw));
              onChange(nextPosition);
            }}
          />
        </label>
      ))}
    </div>
  );
}

type PointPlacerPanelProps = {
  active: boolean;
  label: string;
  hint: string;
  points: PlacedPoint[];
  hover: PointHover | null;
  onToggle: () => void;
  onUpdate: (key: string, patch: PointFieldPatch) => void;
  onRemove: (key: string) => void;
  onClear: () => void;
  onLoadCurrent?: () => void;
  onEditingChange: (key: string | null) => void;
};

function copyText(text: string): boolean {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.focus();
  area.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  area.remove();
  if (!copied) {
    void navigator.clipboard.writeText(text).catch(() => undefined);
  }
  return copied;
}

export function PointPlacerPanel({
  active,
  label,
  hint,
  points,
  hover,
  onToggle,
  onUpdate,
  onRemove,
  onClear,
  onLoadCurrent,
  onEditingChange,
}: PointPlacerPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [openedKey, setOpenedKey] = useState<string | null>(null);
  const knownKeys = useRef<Set<string>>(new Set());
  const seenPoints = useRef(false);
  const snippet = formatPlacedPoints(points);

  useEffect(() => {
    const keys = new Set(points.map((point) => point.key));
    if (!seenPoints.current) {
      seenPoints.current = true;
      knownKeys.current = keys;
      return;
    }
    const added = points.filter((point) => !knownKeys.current.has(point.key));
    knownKeys.current = keys;
    if (added.length === 1) {
      setOpenedKey(added[0].key);
    }
  }, [points]);

  useEffect(() => {
    if (openedKey && !points.some((point) => point.key === openedKey)) {
      setOpenedKey(null);
    }
  }, [openedKey, points]);

  useEffect(() => {
    onEditingChange(openedKey);
  }, [openedKey, onEditingChange]);

  const copy = (id: string, text: string) => {
    if (copyText(text)) {
      setCopied(id);
    }
  };

  const update = (point: PlacedPoint, patch: Partial<PointFieldPatch>) => {
    onUpdate(point.key, {
      id: point.id,
      title: point.title,
      description: point.description,
      position: point.position,
      ...patch,
    });
  };

  return (
    <div className="point-placer">
      <button type="button" className={active ? "point-placer__toggle on" : "point-placer__toggle"} onClick={onToggle}>
        {label}
      </button>
      {active ? (
        <div className="point-placer__panel">
          <p className="point-placer__hint">{hint}</p>
          <p className="point-placer__hover">
            {hover ? `${hover.mesh} ${formatPosition(hover.position)}` : "Наведи на деталь"}
          </p>
          <div className="point-placer__actions">
            {onLoadCurrent ? <button type="button" onClick={onLoadCurrent}>Текущие</button> : null}
            <button type="button" onClick={() => copy("all", snippet)} disabled={points.length === 0}>
              {copied === "all" ? "Скопировано" : "Копировать все"}
            </button>
            <button type="button" onClick={onClear} disabled={points.length === 0}>Очистить</button>
          </div>
          <ul className="point-placer__list">
            {points.map((point) => {
              const opened = openedKey === point.key;
              return (
                <li key={point.key} className={opened ? "open" : undefined}>
                  <div className="point-placer__row">
                    <button
                      type="button"
                      className="point-placer__disclose"
                      aria-expanded={opened}
                      onClick={() => setOpenedKey(opened ? null : point.key)}
                    >
                      <span className="point-placer__chevron">{opened ? "▾" : "▸"}</span>
                      <span>{point.title || point.id}</span>
                    </button>
                    <span className="point-placer__row-actions">
                      <button
                        type="button"
                        className="point-placer__icon"
                        aria-label={copied === point.key ? "Скопировано" : "Копировать"}
                        title={copied === point.key ? "Скопировано" : "Копировать"}
                        onClick={() => copy(point.key, formatPlacedPoint(point))}
                      >
                        {copied === point.key ? <CheckIcon /> : <CopyIcon />}
                      </button>
                      <button
                        type="button"
                        className="point-placer__icon"
                        aria-label="Удалить"
                        title="Удалить"
                        onClick={() => onRemove(point.key)}
                      >
                        <TrashIcon />
                      </button>
                    </span>
                  </div>
                  {opened ? (
                    <>
                      <label className="point-placer__field">
                        id
                        <input
                          value={point.id}
                          onChange={(event) => update(point, { id: event.target.value })}
                        />
                      </label>
                      <label className="point-placer__field">
                        title
                        <input
                          value={point.title}
                          onChange={(event) => update(point, { title: event.target.value })}
                        />
                      </label>
                      <label className="point-placer__field">
                        description
                        <textarea
                          value={point.description}
                          rows={3}
                          onChange={(event) => update(point, { description: event.target.value })}
                        />
                      </label>
                      <p className="point-placer__hint">Короткий клик по модели заменит координаты.</p>
                      <PositionFields
                        position={point.position}
                        onChange={(position) => update(point, { position })}
                      />
                    </>
                  ) : null}
                </li>
              );
            })}
          </ul>
          {snippet ? <pre className="point-placer__snippet">{snippet}</pre> : null}
        </div>
      ) : null}
    </div>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.2" />
      <path d="M10.5 5.5V3.2A1.2 1.2 0 0 0 9.3 2H3.2A1.2 1.2 0 0 0 2 3.2v6.1A1.2 1.2 0 0 0 3.2 10.5H5.5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 4.5h10M6.2 4.5V3.2A1.2 1.2 0 0 1 7.4 2h1.2A1.2 1.2 0 0 1 9.8 3.2v1.3M4.2 4.5l.6 8.1A1.2 1.2 0 0 0 6 13.8h4a1.2 1.2 0 0 0 1.2-1.2l.6-8.1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 8.2 6.4 11 12.5 4.8" />
    </svg>
  );
}
