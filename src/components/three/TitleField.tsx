'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

/**
 * Title-screen particle field — GPU shader displacement, ~12k points.
 * 70% form a slowly rotating tilted ring (the "arena"), 30% ambient dust.
 * Assembly choreography, pointer parallax, and scroll pull-away all run
 * in the vertex shader; the CPU only updates four uniforms per frame.
 *
 * Decorative only (aria-hidden, pointer-events none). Consumers gate it
 * behind !useReducedMotion() and load it via next/dynamic({ ssr: false }).
 */

const PARTICLE_COUNT = 9000
const RING_RATIO = 0.7
const RING_RADIUS = 2.7
const RING_SPREAD = 0.4
const DUST_SPREAD = 11
const SCATTER_SPREAD = 26
const GOLD_RATIO = 0.035
const POINTER_LERP = 0.05
/** The local bloom tracks the cursor far more tightly than the field parallax. */
const POINTER_LERP_FAST = 0.18
const CAMERA_Z = 7
const CAMERA_FOV = 60

const VERTEX_SHADER = /* glsl */ `
  attribute vec3 aStart;
  attribute vec3 aTarget;
  attribute float aGold;
  attribute float aSize;
  attribute vec3 aSeed;

  uniform float uTime;
  uniform float uAssembly;
  uniform vec2 uPointer;
  uniform float uScroll;
  uniform vec2 uPointerNdc;
  uniform vec2 uViewHalf;
  uniform float uCamZ;
  uniform float uBloom;

  varying float vGold;
  varying float vFade;
  varying float vGlow;

  // Radius (view units) and outward shove of the cursor disturbance.
  const float POINTER_RADIUS = 2.1;
  const float POINTER_PUSH = 0.5;

  void main() {
    vGold = aGold;

    // Staggered assembly — each particle resolves on its own offset
    float t = clamp(uAssembly * 1.5 - aSeed.x * 0.5, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - t, 3.0);
    vec3 pos = mix(aStart, aTarget, e);

    // Ambient drift
    pos.x += sin(uTime * 0.40 + aSeed.y * 6.2831) * 0.07;
    pos.y += cos(uTime * 0.34 + aSeed.z * 6.2831) * 0.07;
    pos.z += sin(uTime * 0.28 + aSeed.x * 6.2831) * 0.07;

    // Pointer parallax, depth-weighted
    pos.xy += uPointer * (0.12 + 0.3 * aSeed.y);

    // Scroll exit — field expands and lifts away
    pos *= 1.0 + uScroll * 0.55;
    pos.y += uScroll * 1.8;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // Local cursor bloom. Worked in view space and rescaled by this particle's
    // own depth, so the disturbance sits under the cursor on screen no matter
    // how far the field has rotated or how deep the particle sits.
    vec2 pointerAt = uPointerNdc * uViewHalf * (-mv.z / uCamZ);
    vec2 away = mv.xy - pointerAt;
    float infl = smoothstep(POINTER_RADIUS, 0.0, length(away)) * uBloom;
    mv.xy += normalize(away + vec2(1e-4)) * infl * POINTER_PUSH;
    vGlow = infl;

    gl_Position = projectionMatrix * mv;
    // Small, crisp sprites — at camera z≈7 this lands around 1.5–5px.
    // Anything larger turns the additive field into an overexposed blob.
    gl_PointSize = aSize * (1.0 + aGold * 0.7 + infl * 1.4) * (22.0 / -mv.z);

    vFade = (0.25 + 0.45 * aSeed.z) * (1.0 - uScroll * 0.85);
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  varying float vGold;
  varying float vFade;
  varying float vGlow;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.04, d) * vFade;
    if (alpha < 0.01) discard;

    vec3 deep   = vec3(0.290, 0.102, 0.478);
    vec3 violet = vec3(0.616, 0.306, 0.867);
    vec3 gold   = vec3(1.000, 0.718, 0.012);
    // The bloom brightens toward light violet, never gold — gold is victory only.
    vec3 charge = vec3(0.855, 0.663, 1.000);

    vec3 col = mix(deep, violet, vFade);
    col = mix(col, gold, vGold);
    col = mix(col, charge, vGlow * 0.85);
    alpha = min(alpha * (1.0 + vGlow * 1.8), 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`

function buildAttributes() {
  const start = new Float32Array(PARTICLE_COUNT * 3)
  const target = new Float32Array(PARTICLE_COUNT * 3)
  const gold = new Float32Array(PARTICLE_COUNT)
  const size = new Float32Array(PARTICLE_COUNT)
  const seed = new Float32Array(PARTICLE_COUNT * 3)

  const ringCount = Math.floor(PARTICLE_COUNT * RING_RATIO)
  const tilt = 0.45 // ring tilt in radians

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Scattered start
    start[i * 3] = (Math.random() - 0.5) * SCATTER_SPREAD
    start[i * 3 + 1] = (Math.random() - 0.5) * SCATTER_SPREAD
    start[i * 3 + 2] = (Math.random() - 0.5) * SCATTER_SPREAD

    if (i < ringCount) {
      // Tilted ring with gaussian-ish thickness
      const angle = Math.random() * Math.PI * 2
      const r = RING_RADIUS + (Math.random() + Math.random() - 1) * RING_SPREAD
      const x = Math.cos(angle) * r
      let y = (Math.random() + Math.random() - 1) * RING_SPREAD * 0.5
      let z = Math.sin(angle) * r
      // tilt around X axis
      const ty = y * Math.cos(tilt) - z * Math.sin(tilt)
      const tz = y * Math.sin(tilt) + z * Math.cos(tilt)
      y = ty
      z = tz
      target[i * 3] = x
      target[i * 3 + 1] = y
      target[i * 3 + 2] = z
    } else {
      // Ambient dust
      target[i * 3] = (Math.random() - 0.5) * DUST_SPREAD
      target[i * 3 + 1] = (Math.random() - 0.5) * DUST_SPREAD * 0.6
      target[i * 3 + 2] = (Math.random() - 0.5) * DUST_SPREAD * 0.5 - 1
    }

    gold[i] = Math.random() < GOLD_RATIO ? 1 : 0
    size[i] = 0.5 + Math.random() * 1.1
    seed[i * 3] = Math.random()
    seed[i * 3 + 1] = Math.random()
    seed[i * 3 + 2] = Math.random()
  }

  return { start, target, gold, size, seed }
}

export default function TitleField() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let rafId = 0
    let running = false
    let renderer: THREE.WebGLRenderer
    let geometry: THREE.BufferGeometry
    let material: THREE.ShaderMaterial
    let visible = true
    let inView = true

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      mount.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 100)
      camera.position.z = CAMERA_Z

      const { start, target, gold, size, seed } = buildAttributes()

      geometry = new THREE.BufferGeometry()
      // position attribute is required by three even though the shader ignores it
      geometry.setAttribute('position', new THREE.BufferAttribute(target, 3))
      geometry.setAttribute('aStart', new THREE.BufferAttribute(start, 3))
      geometry.setAttribute('aTarget', new THREE.BufferAttribute(target, 3))
      geometry.setAttribute('aGold', new THREE.BufferAttribute(gold, 1))
      geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
      geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 3))

      const uniforms = {
        uTime: { value: 0 },
        uAssembly: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uScroll: { value: 0 },
        uPointerNdc: { value: new THREE.Vector2(0, 0) },
        uViewHalf: { value: new THREE.Vector2(1, 1) },
        uCamZ: { value: CAMERA_Z },
        uBloom: { value: 0 },
      }

      material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })

      const points = new THREE.Points(geometry, material)
      scene.add(points)

      const startTime = performance.now()
      const pointer = { x: 0, y: 0 }
      const smooth = { x: 0, y: 0 }
      const snap = { x: 0, y: 0 }
      // Raw client coords. The bloom is a *local* effect, so it has to be
      // normalized against the canvas rect rather than the viewport — the
      // mount only covers the hero, and it slides as the page scrolls.
      const client = { x: 0, y: 0 }
      // Ramps 0 → 1 on the first mousemove so the bloom doesn't sit parked in
      // the middle of the ring before the pointer has been anywhere.
      let bloomTarget = 0

      const setSize = () => {
        const w = mount.clientWidth
        const h = mount.clientHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
        // World half-extent of the frustum at the camera distance, so the
        // shader can place the pointer in view space.
        const halfH = Math.tan((camera.fov * Math.PI) / 360) * CAMERA_Z
        uniforms.uViewHalf.value.set(halfH * camera.aspect, halfH)
      }
      setSize()

      const frame = () => {
        rafId = requestAnimationFrame(frame)
        const elapsed = (performance.now() - startTime) / 1000

        smooth.x += (pointer.x - smooth.x) * POINTER_LERP
        smooth.y += (pointer.y - smooth.y) * POINTER_LERP

        // Re-read once per frame so the bloom stays under the cursor while the
        // hero scrolls. One rect read on one element is cheaper than the jank
        // of measuring on every mousemove.
        const rect = mount.getBoundingClientRect()
        const localX = ((client.x - rect.left) / rect.width - 0.5) * 2
        const localY = -((client.y - rect.top) / rect.height - 0.5) * 2
        snap.x += (localX - snap.x) * POINTER_LERP_FAST
        snap.y += (localY - snap.y) * POINTER_LERP_FAST

        uniforms.uTime.value = elapsed
        uniforms.uAssembly.value = Math.min(elapsed / 2.6, 1)
        uniforms.uPointer.value.set(smooth.x, smooth.y)
        uniforms.uPointerNdc.value.set(snap.x, snap.y)
        uniforms.uBloom.value += (bloomTarget - uniforms.uBloom.value) * 0.08
        uniforms.uScroll.value = Math.min(window.scrollY / window.innerHeight, 1)

        points.rotation.y = elapsed * 0.05 + smooth.x * 0.25
        points.rotation.x = smooth.y * -0.12

        renderer.render(scene, camera)
      }

      const startLoop = () => {
        if (running || !visible || !inView) return
        running = true
        rafId = requestAnimationFrame(frame)
      }
      const stopLoop = () => {
        running = false
        cancelAnimationFrame(rafId)
      }

      const onMouseMove = (e: MouseEvent) => {
        pointer.x = (e.clientX / window.innerWidth - 0.5) * 2
        pointer.y = -(e.clientY / window.innerHeight - 0.5) * 2
        client.x = e.clientX
        client.y = e.clientY
        bloomTarget = 1
      }
      const onResize = () => setSize()
      const onVisibility = () => {
        visible = document.visibilityState === 'visible'
        if (visible) {
          startLoop()
        } else {
          stopLoop()
        }
      }

      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting
        if (inView) {
          startLoop()
        } else {
          stopLoop()
        }
      })
      observer.observe(mount)

      window.addEventListener('mousemove', onMouseMove, { passive: true })
      window.addEventListener('resize', onResize)
      document.addEventListener('visibilitychange', onVisibility)

      startLoop()

      return () => {
        stopLoop()
        observer.disconnect()
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize', onResize)
        document.removeEventListener('visibilitychange', onVisibility)
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
        geometry.dispose()
        material.dispose()
        renderer.dispose()
      }
    } catch (err) {
      console.error('[TitleField] Init failed:', err)
      setHasError(true)
    }
  }, [])

  if (hasError) {
    return (
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(123,47,190,0.16) 0%, transparent 60%)',
        }}
      />
    )
  }

  return (
    <div
      ref={mountRef}
      className="absolute inset-0"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    />
  )
}
