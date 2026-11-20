export const loaderVertex = `#version 300 es
layout(location = 0) in vec3 aSphere;
layout(location = 1) in vec3 aLogo;
layout(location = 2) in vec3 aTorus;
layout(location = 3) in float aSeed;

uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution;
uniform vec3 uTrail[12];

out float vSeed;

void main() {
  float cycle = mod(uTime / 6.8, 4.0);
  float index = floor(cycle);
  float blend = smoothstep(0.8, 1.0, fract(cycle));
  float sphereWeight = 1.0 - step(0.5, index);
  float logoWeight = step(0.5, index) * (1.0 - step(1.5, index));
  float torusWeight = step(1.5, index) * (1.0 - step(2.5, index));
  float logoAgainWeight = step(2.5, index);
  float yaw = uTime * 0.22;
  float cosine = cos(yaw);
  float sine = sin(yaw);
  vec3 spherePos = vec3(
    cosine * aSphere.x + sine * aSphere.z,
    aSphere.y,
    -sine * aSphere.x + cosine * aSphere.z
  );
  vec3 torusPos = vec3(
    cosine * aTorus.x + sine * aTorus.z,
    aTorus.y,
    -sine * aTorus.x + cosine * aTorus.z
  );
  vec3 fromPosition = aLogo * sphereWeight + spherePos * logoWeight + torusPos * torusWeight + aLogo * logoAgainWeight;
  vec3 toPosition = spherePos * sphereWeight + torusPos * logoWeight + aLogo * torusWeight + aLogo * logoAgainWeight;
  vec3 position = mix(fromPosition, toPosition, blend);
  position *= mix(0.84, 1.0, uProgress);
  for (int sampleIndex = 0; sampleIndex < 12; sampleIndex++) {
    vec2 delta = position.xy - uTrail[sampleIndex].xy;
    float distanceToCursor = length(delta);
    float strength = uTrail[sampleIndex].z;
    strength = strength * strength * (3.0 - 2.0 * strength);
    float force = strength * exp(-distanceToCursor * distanceToCursor * 80.0);
    position.xy += delta / max(distanceToCursor, 0.02) * force * 0.1;
  }
  float depth = position.z + 2.6;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  gl_Position = vec4(position.x / (depth * aspect), position.y / depth, 0.0, 1.0);
  gl_PointSize = clamp(5.2 * uResolution.y / 900.0 * (2.6 / depth), 1.0, 7.0);
  vSeed = aSeed;
}
`;

export const loaderFragment = `#version 300 es
precision highp float;

uniform float uTime;

in float vSeed;
out vec4 fragColor;

void main() {
  vec2 point = gl_PointCoord * 2.0 - 1.0;
  float distanceToCenter = dot(point, point);
  if (distanceToCenter > 1.0) {
    discard;
  }
  float twinkle = 0.55 + 0.45 * sin(uTime * 3.0 + vSeed * 18.0);
  float alpha = exp(-distanceToCenter * 4.6) * twinkle * 0.62;
  vec3 color = vec3(0.18, 0.72, 0.28) + vec3(0.15, 0.35, 0.12) * alpha;
  fragColor = vec4(color, alpha);
}
`;
