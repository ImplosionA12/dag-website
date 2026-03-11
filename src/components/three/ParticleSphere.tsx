'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PARTICLE_COUNT = 2000
const SPHERE_RADIUS = 2.2
const ASSEMBLY_DURATION = 2500  // ms
const EXPLODE_DURATION = 1200   // ms
const REFORM_DURATION  = 1400   // ms

type AnimMode = 'assembling' | 'idle' | 'exploding' | 'reforming'

// ─── Geometry generation ────────────────────────────────────────────────────

function generateSpherePositions(): Float32Array {
  const pos = new Float32Array(PARTICLE_COUNT * 3)
  const goldenRatio = (1 + Math.sqrt(5)) / 2

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const theta = (2 * Math.PI * i) / goldenRatio
    const phi   = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT)

    pos[i * 3]     = SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta)
    pos[i * 3 + 2] = SPHERE_RADIUS * Math.cos(phi)
  }
  return pos
}

function generateScatteredPositions(spread: number): Float32Array {
  const pos = new Float32Array(PARTICLE_COUNT * 3)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * spread
    pos[i * 3 + 1] = (Math.random() - 0.5) * spread
    pos[i * 3 + 2] = (Math.random() - 0.5) * spread
  }
  return pos
}

function generateColors(): Float32Array {
  const colors = new Float32Array(PARTICLE_COUNT * 3)
  // 70% violet #9D4EDD → rgb(0.616, 0.306, 0.867)
  // 30% gold   #FFB703 → rgb(1.0,   0.718, 0.012)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    if (Math.random() < 0.7) {
      colors[i * 3] = 0.616; colors[i * 3 + 1] = 0.306; colors[i * 3 + 2] = 0.867
    } else {
      colors[i * 3] = 1.0;   colors[i * 3 + 1] = 0.718; colors[i * 3 + 2] = 0.012
    }
  }
  return colors
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - Math.min(t, 1), 3)
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ParticleSphere() {
  const mountRef  = useRef<HTMLDivElement>(null)
  const mouseRef  = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Scene + camera ────────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 100)
    camera.position.z = 6.5

    // ── Geometry ──────────────────────────────────────────────────────────
    const targetPositions    = generateSpherePositions()
    const startPositions     = generateScatteredPositions(28)
    const currentPositions   = new Float32Array(startPositions)
    const capturedPositions  = new Float32Array(PARTICLE_COUNT * 3)
    const explodeVelocities  = new Float32Array(PARTICLE_COUNT * 3)

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3))
    geometry.setAttribute('color',    new THREE.BufferAttribute(generateColors(), 3))

    const material = new THREE.PointsMaterial({
      size:          0.03,
      vertexColors:  true,
      transparent:   true,
      opacity:       0.88,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(geometry, material)
    // Sphere lives in the right portion — shift right
    particles.position.x = 1.4
    scene.add(particles)

    // ── Animation state ───────────────────────────────────────────────────
    let animMode: AnimMode = 'assembling'
    let modeStartTime = performance.now()
    let idleRotationY = 0
    let smoothMouseX = 0
    let smoothMouseY = 0
    let animId: number

    function setSize() {
      const el = mountRef.current
      if (!el) return
      const w = el.clientWidth
      const h = el.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    setSize()

    function animate() {
      animId = requestAnimationFrame(animate)
      const now     = performance.now()
      const elapsed = now - modeStartTime

      // Smooth mouse tracking
      smoothMouseX += (mouseRef.current.x - smoothMouseX) * 0.04
      smoothMouseY += (mouseRef.current.y - smoothMouseY) * 0.04

      switch (animMode) {

        case 'assembling': {
          const t = elapsed / ASSEMBLY_DURATION
          const e = easeOutCubic(t)
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            currentPositions[i * 3]     = startPositions[i * 3]     + (targetPositions[i * 3]     - startPositions[i * 3])     * e
            currentPositions[i * 3 + 1] = startPositions[i * 3 + 1] + (targetPositions[i * 3 + 1] - startPositions[i * 3 + 1]) * e
            currentPositions[i * 3 + 2] = startPositions[i * 3 + 2] + (targetPositions[i * 3 + 2] - startPositions[i * 3 + 2]) * e
          }
          if (t >= 1) animMode = 'idle'
          break
        }

        case 'idle': {
          // Small per-particle mouse nudge — sphere feels aware
          const nudge = 0.08 * SPHERE_RADIUS
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            currentPositions[i * 3]     = targetPositions[i * 3]     + smoothMouseX * nudge
            currentPositions[i * 3 + 1] = targetPositions[i * 3 + 1] + smoothMouseY * nudge
            currentPositions[i * 3 + 2] = targetPositions[i * 3 + 2]
          }
          break
        }

        case 'exploding': {
          const t = elapsed / EXPLODE_DURATION
          if (t >= 1) {
            capturedPositions.set(currentPositions)
            animMode = 'reforming'
            modeStartTime = now
          } else {
            for (let i = 0; i < PARTICLE_COUNT; i++) {
              currentPositions[i * 3]     += explodeVelocities[i * 3]     * 0.1
              currentPositions[i * 3 + 1] += explodeVelocities[i * 3 + 1] * 0.1
              currentPositions[i * 3 + 2] += explodeVelocities[i * 3 + 2] * 0.1
            }
          }
          break
        }

        case 'reforming': {
          const t = elapsed / REFORM_DURATION
          const e = easeOutCubic(t)
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            currentPositions[i * 3]     = capturedPositions[i * 3]     + (targetPositions[i * 3]     - capturedPositions[i * 3])     * e
            currentPositions[i * 3 + 1] = capturedPositions[i * 3 + 1] + (targetPositions[i * 3 + 1] - capturedPositions[i * 3 + 1]) * e
            currentPositions[i * 3 + 2] = capturedPositions[i * 3 + 2] + (targetPositions[i * 3 + 2] - capturedPositions[i * 3 + 2]) * e
          }
          if (t >= 1) animMode = 'idle'
          break
        }
      }

      geometry.attributes.position.needsUpdate = true

      // Idle Y rotation + smooth mouse lean
      idleRotationY       += 0.003
      particles.rotation.y = idleRotationY + smoothMouseX * 0.35
      particles.rotation.x = smoothMouseY * -0.2 + Math.sin(now * 0.0004) * 0.08

      renderer.render(scene, camera)
    }

    animate()

    // ── Event listeners ───────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x:  (e.clientX / window.innerWidth  - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    const onClick = () => {
      if (animMode === 'exploding' || animMode === 'reforming') return
      animMode = 'exploding'
      modeStartTime = performance.now()
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const speed = 0.6 + Math.random() * 1.4
        const theta = Math.random() * Math.PI * 2
        const phi   = Math.acos(2 * Math.random() - 1)
        explodeVelocities[i * 3]     = Math.sin(phi) * Math.cos(theta) * speed
        explodeVelocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed
        explodeVelocities[i * 3 + 2] = Math.cos(phi) * speed
      }
    }

    const onResize = () => setSize()

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onResize)
    mount.addEventListener('click', onClick)

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      mount.removeEventListener('click', onClick)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0"
      style={{ cursor: 'crosshair' }}
      title="Click to scatter the sphere"
    />
  )
}
