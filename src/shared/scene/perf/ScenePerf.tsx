import { useRef, useSyncExternalStore } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerfHeadless, usePerf } from "r3f-perf";
import { InstancedMesh, Mesh, type BufferGeometry, type Object3D, type WebGLRenderer } from "three";

type PerfSnapshot = {
  fps: number;
  cpu: number;
  gpu: number;
  calls: number;
  triangles: number;
  geometries: number;
  textures: number;
  shaders: number;
  lines: number;
  points: number;
  fpsChart: number[];
  circularId: number;
};

function readSnapshot(state: {
  log: { fps?: number; cpu?: number; gpu?: number } | null;
  gl?: { info: { render: { calls: number; triangles: number; lines: number; points: number }; memory: { geometries: number; textures: number }; programs?: unknown[] } };
  chart: { data: { fps: number[] }; circularId: number };
}): PerfSnapshot {
  const render = state.gl?.info.render;
  const memory = state.gl?.info.memory;

  return {
    fps: state.log?.fps ?? 0,
    cpu: state.log?.cpu ?? 0,
    gpu: state.log?.gpu ?? 0,
    calls: render?.calls ?? 0,
    triangles: render?.triangles ?? 0,
    geometries: memory?.geometries ?? 0,
    textures: memory?.textures ?? 0,
    shaders: state.gl?.info.programs?.length ?? 0,
    lines: render?.lines ?? 0,
    points: render?.points ?? 0,
    fpsChart: state.chart.data.fps,
    circularId: state.chart.circularId,
  };
}

function orderedSamples(values: number[], circularId: number): number[] {
  if (values.length < 2) {
    return values;
  }
  const start = (circularId + 1) % values.length;
  return values.slice(start).concat(values.slice(0, start));
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) {
    return null;
  }
  const max = Math.max(...values, 1);
  const step = 100 / (values.length - 1);
  const points = values.map((value, index) => {
    const x = index * step;
    const y = 24 - (value / max) * 22;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");

  return (
    <svg className="scene-perf__chart" viewBox="0 0 100 24" preserveAspectRatio="none">
      <polyline points={points} />
    </svg>
  );
}

function Metric({ value, label, unit }: { value: string; label: string; unit?: string }) {
  return (
    <div className="scene-perf__metric">
      <b>
        {value}
        {unit ? <small>{unit}</small> : null}
      </b>
      <span>{label}</span>
    </div>
  );
}

export function ScenePerfProbe() {
  return <PerfHeadless />;
}

type SceneTriangleReport = {
  total: number;
  visible: number;
  meshes: number;
  visibleMeshes: number;
};

const emptyTriangleReport: SceneTriangleReport = {
  total: 0,
  visible: 0,
  meshes: 0,
  visibleMeshes: 0,
};

let triangleReport = emptyTriangleReport;
const triangleListeners = new Set<() => void>();

function subscribeTriangleReport(listener: () => void): () => void {
  triangleListeners.add(listener);
  return () => {
    triangleListeners.delete(listener);
  };
}

function getTriangleReport(): SceneTriangleReport {
  return triangleReport;
}

function geometryTriangles(geometry: BufferGeometry): number {
  if (geometry.index) {
    return Math.floor(geometry.index.count / 3);
  }
  const position = geometry.getAttribute("position");
  if (!position) {
    return 0;
  }
  return Math.floor(position.count / 3);
}

function isDrawn(object: Object3D): boolean {
  let current: Object3D | null = object;
  while (current) {
    if (!current.visible) {
      return false;
    }
    current = current.parent;
  }
  return true;
}

function countSceneTriangles(root: Object3D): SceneTriangleReport {
  let total = 0;
  let visible = 0;
  let meshes = 0;
  let visibleMeshes = 0;

  root.traverse((object) => {
    if (!(object instanceof Mesh) || !object.geometry) {
      return;
    }
    const copies = object instanceof InstancedMesh ? object.count : 1;
    const triangles = geometryTriangles(object.geometry) * copies;
    total += triangles;
    meshes += 1;
    if (isDrawn(object)) {
      visible += triangles;
      visibleMeshes += 1;
    }
  });

  return { total, visible, meshes, visibleMeshes };
}

function sameTriangleReport(left: SceneTriangleReport, right: SceneTriangleReport): boolean {
  return left.total === right.total
    && left.visible === right.visible
    && left.meshes === right.meshes
    && left.visibleMeshes === right.visibleMeshes;
}

function publishTriangleReport(next: SceneTriangleReport, gl: WebGLRenderer) {
  if (sameTriangleReport(triangleReport, next)) {
    return;
  }
  triangleReport = next;
  const render = gl.info.render;
  const memory = gl.info.memory;
  console.info("[scene]", {
    triangles: next.total,
    visibleTriangles: next.visible,
    meshes: next.meshes,
    visibleMeshes: next.visibleMeshes,
    render: {
      triangles: render.triangles,
      calls: render.calls,
      lines: render.lines,
      points: render.points,
    },
    memory: {
      geometries: memory.geometries,
      textures: memory.textures,
    },
  });
  triangleListeners.forEach((listener) => {
    listener();
  });
}

const triangleSampleInterval = 30;

export function SceneTriangleProbe() {
  const scene = useThree((state) => state.scene);
  const gl = useThree((state) => state.gl);
  const frame = useRef(0);

  useFrame(() => {
    frame.current += 1;
    if (frame.current % triangleSampleInterval !== 0) {
      return;
    }
    publishTriangleReport(countSceneTriangles(scene), gl);
  });

  return null;
}

function formatCount(value: number): string {
  return value.toLocaleString("ru-RU");
}

export function SceneTriangleWindow() {
  const report = useSyncExternalStore(subscribeTriangleReport, getTriangleReport);

  return (
    <div className="scene-triangles">
      <span>В сцене</span>
      <b>{formatCount(report.total)}</b>
      <small>
        видимых {formatCount(report.visible)}
        {" · "}
        мешей {formatCount(report.meshes)}
      </small>
    </div>
  );
}

export function ScenePerfPanel() {
  const snapshot = usePerf(readSnapshot);
  const fpsChart = orderedSamples(snapshot.fpsChart, snapshot.circularId);

  return (
    <div className="scene-perf">
      <div className="scene-perf__row">
        <Metric value={snapshot.gpu.toFixed(2)} unit="ms" label="GPU" />
        <Metric value={snapshot.cpu.toFixed(2)} unit="ms" label="CPU" />
        <Metric value={String(Math.round(snapshot.fps))} label="FPS" />
        <Metric value={String(snapshot.calls)} label="calls" />
        <Metric value={String(snapshot.triangles)} label="triangles" />
      </div>
      <div className="scene-perf__row">
        <Metric value={String(snapshot.geometries)} label="geometries" />
        <Metric value={String(snapshot.textures)} label="textures" />
        <Metric value={String(snapshot.shaders)} label="shaders" />
        <Metric value={String(snapshot.lines)} label="lines" />
        <Metric value={String(snapshot.points)} label="points" />
      </div>
      <Sparkline values={fpsChart} />
    </div>
  );
}
