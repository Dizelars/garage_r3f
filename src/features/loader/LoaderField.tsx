import { useEffect, useRef } from "react";
import { loaderFragment, loaderVertex } from "./loaderShader";

type LoaderFieldProps = {
  progress: number;
};

const particleCount = 4800;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("loader shader allocation failed");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "";
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

function unit(index: number): number {
  const value = Math.sin(index * 127.1) * 43758.5453;
  return value - Math.floor(value);
}

function writeSphere(target: Float32Array): void {
  for (let index = 0; index < particleCount; index += 1) {
    const y = 1 - (index / (particleCount - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = Math.PI * (3 - Math.sqrt(5)) * index;
    target[index * 3] = Math.cos(theta) * ring * 0.72;
    target[index * 3 + 1] = y * 0.72;
    target[index * 3 + 2] = Math.sin(theta) * ring * 0.72;
  }
}

function writeTorus(target: Float32Array): void {
  const columns = 80;
  for (let index = 0; index < particleCount; index += 1) {
    const major = (index % columns) / columns * Math.PI * 2;
    const minor = Math.floor(index / columns) / Math.ceil(particleCount / columns) * Math.PI * 2;
    const radius = 0.62 + Math.cos(minor) * 0.24;
    target[index * 3] = Math.cos(major) * radius;
    target[index * 3 + 1] = Math.sin(minor) * 0.24;
    target[index * 3 + 2] = Math.sin(major) * radius;
  }
}

const logoBinUrl = "models/codd_logo/MTCC.bin";
const logoVertexCount = 3665;
const logoIndexCount = 11160;
const logoIndexOffset = 117280;

function loadLogoPoints(count: number): Promise<Float32Array | null> {
  return fetch(logoBinUrl).then(async (response) => {
    if (!response.ok) {
      return null;
    }
    const bin = await response.arrayBuffer();
    const vertices = new Float32Array(bin, 0, logoVertexCount * 3);
    const indices = new Uint16Array(bin, logoIndexOffset, logoIndexCount);
    const areas = new Float32Array(indices.length / 3);
    let total = 0;
    for (let triangle = 0; triangle < areas.length; triangle += 1) {
      const base = triangle * 3;
      const a = indices[base] * 3;
      const b = indices[base + 1] * 3;
      const c = indices[base + 2] * 3;
      const abx = vertices[b] - vertices[a];
      const aby = vertices[b + 1] - vertices[a + 1];
      const abz = vertices[b + 2] - vertices[a + 2];
      const acx = vertices[c] - vertices[a];
      const acy = vertices[c + 1] - vertices[a + 1];
      const acz = vertices[c + 2] - vertices[a + 2];
      const crossX = aby * acz - abz * acy;
      const crossY = abz * acx - abx * acz;
      const crossZ = abx * acy - aby * acx;
      const area = Math.hypot(crossX, crossY, crossZ) * 0.5;
      total += area;
      areas[triangle] = total;
    }
    if (total <= 0) {
      return null;
    }
    const points = new Float32Array(count * 3);
    let minX = Infinity;
    let minY = Infinity;
    let minZ = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let maxZ = -Infinity;
    for (let index = 0; index < count; index += 1) {
      const pick = unit(index + 80) * total;
      let low = 0;
      let high = areas.length - 1;
      while (low < high) {
        const mid = (low + high) >> 1;
        if (areas[mid] < pick) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      const base = low * 3;
      const a = indices[base] * 3;
      const b = indices[base + 1] * 3;
      const c = indices[base + 2] * 3;
      let u = unit(index + 140);
      let v = unit(index + 220);
      if (u + v > 1) {
        u = 1 - u;
        v = 1 - v;
      }
      const w = 1 - u - v;
      const x = vertices[a] * w + vertices[b] * u + vertices[c] * v;
      const y = vertices[a + 1] * w + vertices[b + 1] * u + vertices[c + 1] * v;
      const z = vertices[a + 2] * w + vertices[b + 2] * u + vertices[c + 2] * v;
      const abx = vertices[b] - vertices[a];
      const aby = vertices[b + 1] - vertices[a + 1];
      const abz = vertices[b + 2] - vertices[a + 2];
      const acx = vertices[c] - vertices[a];
      const acy = vertices[c + 1] - vertices[a + 1];
      const acz = vertices[c + 2] - vertices[a + 2];
      let nx = aby * acz - abz * acy;
      let ny = abz * acx - abx * acz;
      let nz = abx * acy - aby * acx;
      const length = Math.hypot(nx, ny, nz) || 1;
      const depth = (unit(index + 300) - 0.5) * 0.045;
      points[index * 3] = x + (nx / length) * depth;
      points[index * 3 + 1] = y + (ny / length) * depth;
      points[index * 3 + 2] = z + (nz / length) * depth;
      minX = Math.min(minX, points[index * 3]);
      minY = Math.min(minY, points[index * 3 + 1]);
      minZ = Math.min(minZ, points[index * 3 + 2]);
      maxX = Math.max(maxX, points[index * 3]);
      maxY = Math.max(maxY, points[index * 3 + 1]);
      maxZ = Math.max(maxZ, points[index * 3 + 2]);
    }
    const centerX = (minX + maxX) * 0.5;
    const centerY = (minY + maxY) * 0.5;
    const centerZ = (minZ + maxZ) * 0.5;
    const span = Math.max(maxX - minX, maxY - minY, maxZ - minZ) || 1;
    const scale = 1.55 / span;
    for (let index = 0; index < count; index += 1) {
      const x = (points[index * 3] - centerX) * scale;
      const y = (points[index * 3 + 1] - centerY) * scale;
      const z = (points[index * 3 + 2] - centerZ) * scale;
      points[index * 3] = -z;
      points[index * 3 + 1] = y;
      points[index * 3 + 2] = x;
    }
    return points;
  }).catch(() => null);
}

function resizeCanvas(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext): void {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.floor(canvas.clientWidth * pixelRatio));
  const height = Math.max(1, Math.floor(canvas.clientHeight * pixelRatio));
  if (canvas.width === width && canvas.height === height) {
    return;
  }
  canvas.width = width;
  canvas.height = height;
  gl.viewport(0, 0, width, height);
}

export function LoaderField({ progress }: LoaderFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      return;
    }

    const sphere = new Float32Array(particleCount * 3);
    const logo = new Float32Array(particleCount * 3);
    const torus = new Float32Array(particleCount * 3);
    const seeds = new Float32Array(particleCount);
    writeSphere(sphere);
    writeTorus(torus);
    sphere.forEach((value, index) => {
      logo[index] = value * 0.35;
    });
    for (let index = 0; index < particleCount; index += 1) {
      seeds[index] = unit(index + 3);
    }

    const buffers = [sphere, logo, torus, seeds].map((data) => {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return buffer;
    });

    let vertex: WebGLShader | null = null;
    let fragment: WebGLShader | null = null;
    let program: WebGLProgram | null = null;
    let frame = 0;
    let disposed = false;

    try {
      vertex = compileShader(gl, gl.VERTEX_SHADER, loaderVertex);
      fragment = compileShader(gl, gl.FRAGMENT_SHADER, loaderFragment);
      program = gl.createProgram();
      if (!program) {
        throw new Error("loader program allocation failed");
      }
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? "loader link failed");
      }
    } catch (error) {
      console.error(error);
      buffers.forEach((buffer) => gl.deleteBuffer(buffer));
      if (program) {
        gl.deleteProgram(program);
      }
      if (vertex) {
        gl.deleteShader(vertex);
      }
      if (fragment) {
        gl.deleteShader(fragment);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return;
    }

    const linked = program;
    const vertexArray = gl.createVertexArray();
    gl.bindVertexArray(vertexArray);
    buffers.forEach((buffer, location) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, location === 3 ? 1 : 3, gl.FLOAT, false, 0, 0);
    });
    const trail = new Float32Array(12 * 3);
    let trailCursor = 0;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let hasMouse = false;
    let previousFrame = performance.now();
    const timeLocation = gl.getUniformLocation(linked, "uTime");
    const progressLocation = gl.getUniformLocation(linked, "uProgress");
    const resolutionLocation = gl.getUniformLocation(linked, "uResolution");
    const trailLocation = gl.getUniformLocation(linked, "uTrail");
    const started = performance.now();
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.clearColor(0, 0, 0, 1);

    const draw = (now: number) => {
      if (disposed) {
        return;
      }
      resizeCanvas(canvas, gl);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(linked);
      gl.bindVertexArray(vertexArray);
      const nowSeconds = (now - started) / 1000;
      const deltaSeconds = Math.min(0.05, (now - previousFrame) / 1000);
      previousFrame = now;
      for (let index = 0; index < 12; index += 1) {
        trail[index * 3 + 2] *= Math.exp(-deltaSeconds * 1.6);
      }
      gl.uniform1f(timeLocation, nowSeconds);
      gl.uniform1f(progressLocation, Math.max(0, Math.min(1, progressRef.current / 100)));
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform3fv(trailLocation, trail);
      gl.drawArrays(gl.POINTS, 0, particleCount);
      frame = window.requestAnimationFrame(draw);
    };

    resizeCanvas(canvas, gl);
    frame = window.requestAnimationFrame(draw);
    const onResize = () => resizeCanvas(canvas, gl);
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }
      const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      const aspect = rect.width / rect.height;
      const x = ndcX * 2.6 * aspect;
      const y = ndcY * 2.6;
      if (!hasMouse || Math.hypot(x - previousMouseX, y - previousMouseY) > 0.02) {
        trail[trailCursor * 3] = x;
        trail[trailCursor * 3 + 1] = y;
        trail[trailCursor * 3 + 2] = 1;
        trailCursor = (trailCursor + 1) % 12;
        previousMouseX = x;
        previousMouseY = y;
        hasMouse = true;
      } else {
        const slot = (trailCursor + 11) % 12;
        trail[slot * 3] = x;
        trail[slot * 3 + 1] = y;
        trail[slot * 3 + 2] = 1;
      }
    };
    window.addEventListener("resize", onResize);
    canvas.addEventListener("pointermove", onPointerMove);
    void loadLogoPoints(particleCount).then((points) => {
      if (disposed || !points) {
        return;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers[1]);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, points);
    });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onPointerMove);
      buffers.forEach((buffer) => gl.deleteBuffer(buffer));
      gl.deleteVertexArray(vertexArray);
      gl.deleteProgram(linked);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas className="loader-field__canvas" ref={canvasRef} aria-hidden="true" />;
}
