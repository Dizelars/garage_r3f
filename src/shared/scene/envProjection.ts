import { Mesh, MeshStandardMaterial, Vector3, type Object3D } from "three";
import { roomPosition } from "./garageTune";

const envBoxCenter = new Vector3();
const envBoxHalf = new Vector3();

const projectionUniforms = {
  envBoxCenter: { value: envBoxCenter },
  envBoxHalf: { value: envBoxHalf },
};

const patched = new WeakSet<MeshStandardMaterial>();

const envmapChunk = /* glsl */`
#ifdef USE_ENVMAP

	vec3 getIBLIrradiance( const in vec3 normal ) {

		#ifdef ENVMAP_TYPE_CUBE_UV

			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );

			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );

			return PI * envMapColor.rgb * envMapIntensity;

		#else

			return vec3( 0.0 );

		#endif

	}

	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {

		#ifdef ENVMAP_TYPE_CUBE_UV

			vec3 reflectVec = reflect( - viewDir, normal );

			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );

			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );

			vec3 nrdir = normalize( reflectVec );
			vec3 envMin = envBoxCenter - envBoxHalf;
			vec3 envMax = envBoxCenter + envBoxHalf;
			vec3 rbmax = ( envMax - vEnvWorldPosition ) / nrdir;
			vec3 rbmin = ( envMin - vEnvWorldPosition ) / nrdir;
			vec3 rbminmax = mix( rbmin, rbmax, step( vec3( 0.0 ), nrdir ) );
			float dist = min( min( rbminmax.x, rbminmax.y ), rbminmax.z );
			vec3 projected = normalize( vEnvWorldPosition + nrdir * dist - envBoxCenter );

			if ( projected.x == projected.x ) reflectVec = projected;

			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );

			return envMapColor.rgb * envMapIntensity;

		#else

			return vec3( 0.0 );

		#endif

	}

	#ifdef USE_ANISOTROPY

		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {

			#ifdef ENVMAP_TYPE_CUBE_UV

				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );

				return getIBLRadiance( viewDir, bentNormal, roughness );

			#else

				return vec3( 0.0 );

			#endif

		}

	#endif

#endif
`;

export function setEnvProjection(radius: number, height: number, scale: number): void {
  const factor = scale / 100;
  const halfX = Math.max(radius * factor, 0.5);
  const halfY = Math.max(height * factor, 0.5);
  envBoxHalf.set(halfX, halfY, halfX);
  envBoxCenter.set(roomPosition[0], halfY, roomPosition[2]);
}

function patchMaterial(material: MeshStandardMaterial): void {
  if (patched.has(material)) {
    return;
  }
  patched.add(material);

  const previousCacheKey = material.customProgramCacheKey;
  const previousCompile = material.onBeforeCompile;

  material.customProgramCacheKey = function cacheKey() {
    return `${previousCacheKey.call(this)}|env-room`;
  };

  material.onBeforeCompile = function compile(shader, renderer) {
    previousCompile.call(this, shader, renderer);
    shader.uniforms.envBoxCenter = projectionUniforms.envBoxCenter;
    shader.uniforms.envBoxHalf = projectionUniforms.envBoxHalf;

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vEnvWorldPosition;")
      .replace(
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\n#ifdef USE_ENVMAP\n\tvEnvWorldPosition = worldPosition.xyz;\n#endif",
      );

    const fragment = shader.fragmentShader.replace(
      "#include <common>",
      "#include <common>\nvarying vec3 vEnvWorldPosition;\nuniform vec3 envBoxCenter;\nuniform vec3 envBoxHalf;",
    );
    shader.fragmentShader = fragment.includes("#include <envmap_physical_pars_fragment>")
      ? fragment.replace("#include <envmap_physical_pars_fragment>", envmapChunk)
      : fragment;
  };

  material.needsUpdate = true;
}

setEnvProjection(20, 2.5, 50);

export function patchEnvProjection(root: Object3D): void {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) {
      return;
    }
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (material instanceof MeshStandardMaterial) {
        patchMaterial(material);
      }
    });
  });
}
