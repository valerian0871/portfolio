import { useEffect, useRef } from 'react'

export type Canvas3DVariant = 'hero-lattice' | 'work-topography' | 'about-polyhedra' | 'contact-rings'

interface Section3DBackgroundProps {
  variant: Canvas3DVariant
  className?: string
  opacity?: number
}

export function Section3DBackground({
  variant,
  className = '',
  opacity = 0.45,
}: Section3DBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationId: number
    let isVisible = true
    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let mouseX = 0
    let mouseY = 0
    let targetMouseX = 0
    let targetMouseY = 0

    // Theme color detector
    const getThemeColors = () => {
      const styles = getComputedStyle(document.documentElement)
      const accent = styles.getPropertyValue('--color-accent').trim() || '#1F5245'
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return {
        accent: accent || (isDark ? '#7FBFA8' : '#1F5245'),
        accentRgb: isDark ? '127, 191, 168' : '31, 82, 69',
        isDark,
      }
    }

    let colors = getThemeColors()

    // Reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Resize handler
    const handleResize = () => {
      if (!canvas || !container) return
      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })

    // Mouse movement listener (subtle 3D parallax)
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / (rect.width || 1) - 0.5
      const y = (e.clientY - rect.top) / (rect.height || 1) - 0.5
      targetMouseX = x * 2
      targetMouseY = y * 2
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // IntersectionObserver to pause rendering when section is offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false
      },
      { threshold: 0.05 },
    )
    observer.observe(container)

    // Watch for color scheme changes
    const darkModeMql = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = () => {
      colors = getThemeColors()
    }
    darkModeMql.addEventListener('change', handleThemeChange)

    let time = 0

    // ----------------------------------------------------
    // VARIANT 1: HERO - 3D Mathematical Torus Knot / Lattice
    // ----------------------------------------------------
    const initHeroLattice = () => {
      const p = 3
      const q = 7
      const totalPoints = 160
      const points: { x: number; y: number; z: number }[] = []

      for (let i = 0; i < totalPoints; i++) {
        const u = (i / totalPoints) * Math.PI * 2
        const r = 0.5 * (2 + Math.sin(q * u))
        const x = r * Math.cos(p * u)
        const y = r * Math.sin(p * u)
        const z = -Math.sin(q * u) * 0.8
        points.push({ x, y, z })
      }

      return (t: number) => {
        ctx.clearRect(0, 0, width, height)
        const cx = width * 0.5
        const cy = height * 0.5
        const scale = Math.min(width, height) * 0.28

        const rotX = t * 0.25 + mouseY * 0.35
        const rotY = t * 0.4 + mouseX * 0.45

        const projected: { x: number; y: number; z: number; origZ: number }[] = []

        for (let i = 0; i < points.length; i++) {
          const pt = points[i]
          // Rotate Y
          const x1 = pt.x * Math.cos(rotY) + pt.z * Math.sin(rotY)
          const z1 = -pt.x * Math.sin(rotY) + pt.z * Math.cos(rotY)
          // Rotate X
          const y2 = pt.y * Math.cos(rotX) - z1 * Math.sin(rotX)
          const z2 = pt.y * Math.sin(rotX) + z1 * Math.cos(rotX)

          // 3D Perspective Projection
          const fov = 3.2
          const factor = fov / (fov + z2)
          const px = cx + x1 * scale * factor
          const py = cy + y2 * scale * factor

          projected.push({ x: px, y: py, z: factor, origZ: z2 })
        }

        // Draw connecting lattice lines
        ctx.beginPath()
        for (let i = 0; i < projected.length; i++) {
          const next = projected[(i + 1) % projected.length]
          if (i === 0) ctx.moveTo(projected[i].x, projected[i].y)
          else ctx.lineTo(projected[i].x, projected[i].y)

          // Secondary cross connections for 3D wireframe mesh look
          const cross = projected[(i + 4) % projected.length]
          ctx.moveTo(projected[i].x, projected[i].y)
          ctx.lineTo(cross.x, cross.y)
          ctx.moveTo(next.x, next.y)
        }
        ctx.strokeStyle = `rgba(${colors.accentRgb}, 0.16)`
        ctx.lineWidth = 1.2
        ctx.stroke()

        // Draw nodes with depth-based brightness
        for (let i = 0; i < projected.length; i += 2) {
          const pt = projected[i]
          const alpha = Math.max(0.1, Math.min(0.7, (pt.z - 0.7) * 0.9))
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, Math.max(1, 2.5 * pt.z), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${colors.accentRgb}, ${alpha})`
          ctx.fill()
        }
      }
    }

    // ----------------------------------------------------
    // VARIANT 2: WORK - 3D Topographic Mesh / Undulating Terrain
    // ----------------------------------------------------
    const initWorkTopography = () => {
      const rows = 14
      const cols = 22

      return (t: number) => {
        ctx.clearRect(0, 0, width, height)
        const cx = width * 0.5
        const cy = height * 0.55

        const cellW = width / (cols - 1)
        const gridPoints: { x: number; y: number; alpha: number }[][] = []

        const tiltX = 0.95 + mouseY * 0.08
        const tiltY = mouseX * 0.12

        for (let r = 0; r < rows; r++) {
          gridPoints[r] = []
          for (let c = 0; c < cols; c++) {
            // Isometric 3D plane coordinates
            const x0 = (c - cols / 2) * cellW * 1.3
            const z0 = (r - rows / 2) * 55

            // Harmonic wave elevation
            const wave =
              Math.sin(c * 0.35 + t * 0.8) * Math.cos(r * 0.45 + t * 0.6) * 35 +
              Math.sin((c + r) * 0.25 - t * 0.5) * 20

            // 3D Rotation & Projection
            const xRot = x0 * Math.cos(tiltY) - z0 * Math.sin(tiltY)
            const zRot = x0 * Math.sin(tiltY) + z0 * Math.cos(tiltY)
            const yRot = wave * Math.cos(tiltX) - zRot * Math.sin(tiltX)
            const depth = 650 / (650 + zRot)

            const px = cx + xRot * depth
            const py = cy + yRot * depth * 0.85
            const alpha = Math.max(0.04, Math.min(0.35, depth * 0.35))

            gridPoints[r][c] = { x: px, y: py, alpha }
          }
        }

        // Draw horizontal mesh lines
        for (let r = 0; r < rows; r++) {
          ctx.beginPath()
          for (let c = 0; c < cols; c++) {
            const pt = gridPoints[r][c]
            if (c === 0) ctx.moveTo(pt.x, pt.y)
            else ctx.lineTo(pt.x, pt.y)
          }
          const rowAlpha = (r / rows) * 0.25 + 0.05
          ctx.strokeStyle = `rgba(${colors.accentRgb}, ${rowAlpha})`
          ctx.lineWidth = 1
          ctx.stroke()
        }

        // Draw vertical mesh lines
        for (let c = 0; c < cols; c += 2) {
          ctx.beginPath()
          for (let r = 0; r < rows; r++) {
            const pt = gridPoints[r][c]
            if (r === 0) ctx.moveTo(pt.x, pt.y)
            else ctx.lineTo(pt.x, pt.y)
          }
          ctx.strokeStyle = `rgba(${colors.accentRgb}, 0.08)`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }
    }

    // ----------------------------------------------------
    // VARIANT 3: ABOUT - 3D Floating Polyhedra / Kinetic Geometry
    // ----------------------------------------------------
    const initAboutPolyhedra = () => {
      // 3D Icosahedron vertex coordinates
      const phi = (1 + Math.sqrt(5)) / 2
      const rawVerts = [
        [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
        [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
        [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
      ].map(([x, y, z]) => {
        const len = Math.hypot(x, y, z)
        return { x: x / len, y: y / len, z: z / len }
      })

      // Icosahedron edges
      const edges: [number, number][] = []
      for (let i = 0; i < rawVerts.length; i++) {
        for (let j = i + 1; j < rawVerts.length; j++) {
          const d = Math.hypot(
            rawVerts[i].x - rawVerts[j].x,
            rawVerts[i].y - rawVerts[j].y,
            rawVerts[i].z - rawVerts[j].z,
          )
          if (Math.abs(d - 1.05) < 0.15) {
            edges.push([i, j])
          }
        }
      }

      // Three floating polyhedra at different depths and orbits
      const bodies = [
        { x: -0.28, y: -0.15, size: 0.18, speed: 0.35, phase: 0 },
        { x: 0.32, y: 0.18, size: 0.22, speed: 0.28, phase: 2.1 },
        { x: 0.05, y: -0.32, size: 0.12, speed: 0.42, phase: 4.4 },
      ]

      return (t: number) => {
        ctx.clearRect(0, 0, width, height)
        const cx = width * 0.5
        const cy = height * 0.5
        const minDim = Math.min(width, height)

        bodies.forEach((body) => {
          const bodyX = cx + (body.x + mouseX * 0.08) * width
          const bodyY = cy + (body.y + mouseY * 0.08) * height + Math.sin(t * body.speed + body.phase) * 18
          const radius = minDim * body.size

          const rotX = t * body.speed + body.phase
          const rotY = t * (body.speed * 1.3) + body.phase + mouseX * 0.4

          // Rotate and project vertices
          const proj: { x: number; y: number; z: number }[] = rawVerts.map((v) => {
            // Y
            const x1 = v.x * Math.cos(rotY) + v.z * Math.sin(rotY)
            const z1 = -v.x * Math.sin(rotY) + v.z * Math.cos(rotY)
            // X
            const y2 = v.y * Math.cos(rotX) - z1 * Math.sin(rotX)
            const z2 = v.y * Math.sin(rotX) + z1 * Math.cos(rotX)

            const fov = 3
            const factor = fov / (fov + z2)
            return {
              x: bodyX + x1 * radius * factor,
              y: bodyY + y2 * radius * factor,
              z: z2,
            }
          })

          // Draw wireframe edges
          ctx.beginPath()
          edges.forEach(([i, j]) => {
            ctx.moveTo(proj[i].x, proj[i].y)
            ctx.lineTo(proj[j].x, proj[j].y)
          })
          ctx.strokeStyle = `rgba(${colors.accentRgb}, 0.18)`
          ctx.lineWidth = 1.1
          ctx.stroke()

          // Draw vertices
          proj.forEach((p) => {
            const alpha = (p.z + 1) * 0.25 + 0.1
            ctx.beginPath()
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${colors.accentRgb}, ${alpha})`
            ctx.fill()
          })
        })
      }
    }

    // ----------------------------------------------------
    // VARIANT 4: CONTACT - 3D Orbital Rings & Signal Pulses
    // ----------------------------------------------------
    const initContactRings = () => {
      const ringCount = 7

      return (t: number) => {
        ctx.clearRect(0, 0, width, height)
        const cx = width * 0.5
        const cy = height * 0.5
        const maxRadius = Math.min(width, height) * 0.42

        const tiltX = 1.1 + mouseY * 0.15
        const tiltY = t * 0.15 + mouseX * 0.2

        for (let i = 0; i < ringCount; i++) {
          const rNorm = (i + 1) / ringCount
          const baseRadius = rNorm * maxRadius
          const ringPoints: { x: number; y: number; z: number }[] = []
          const segments = 64

          const ringRotX = tiltX + Math.sin(t * 0.3 + i * 0.5) * 0.15
          const ringRotY = tiltY + (i % 2 === 0 ? 1 : -1) * t * 0.2

          for (let s = 0; s <= segments; s++) {
            const theta = (s / segments) * Math.PI * 2
            const x0 = Math.cos(theta) * baseRadius
            const y0 = Math.sin(theta) * baseRadius
            const z0 = Math.sin(theta * 3 + t + i) * (8 + i * 3)

            // 3D rotation
            const x1 = x0 * Math.cos(ringRotY) + z0 * Math.sin(ringRotY)
            const z1 = -x0 * Math.sin(ringRotY) + z0 * Math.cos(ringRotY)
            const y2 = y0 * Math.cos(ringRotX) - z1 * Math.sin(ringRotX)
            const z2 = y0 * Math.sin(ringRotX) + z1 * Math.cos(ringRotX)

            const fov = 3.5
            const factor = fov / (fov + z2 * 0.005)

            ringPoints.push({
              x: cx + x1 * factor,
              y: cy + y2 * factor,
              z: z2,
            })
          }

          ctx.beginPath()
          for (let s = 0; s < ringPoints.length; s++) {
            if (s === 0) ctx.moveTo(ringPoints[s].x, ringPoints[s].y)
            else ctx.lineTo(ringPoints[s].x, ringPoints[s].y)
          }
          const alpha = 0.08 + (1 - rNorm) * 0.18
          ctx.strokeStyle = `rgba(${colors.accentRgb}, ${alpha})`
          ctx.lineWidth = 1 + (1 - rNorm) * 0.8
          ctx.stroke()

          // Draw an orbiting signal bead on each ring
          const beadIndex = Math.floor(((t * (0.8 + (ringCount - i) * 0.2)) % (Math.PI * 2) / (Math.PI * 2)) * segments)
          const bead = ringPoints[beadIndex % ringPoints.length]
          if (bead) {
            ctx.beginPath()
            ctx.arc(bead.x, bead.y, 2.5, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${colors.accentRgb}, 0.8)`
            ctx.fill()
          }
        }
      }
    }

    // Select renderer based on variant
    let renderFrame: (t: number) => void

    switch (variant) {
      case 'hero-lattice':
        renderFrame = initHeroLattice()
        break
      case 'work-topography':
        renderFrame = initWorkTopography()
        break
      case 'about-polyhedra':
        renderFrame = initAboutPolyhedra()
        break
      case 'contact-rings':
        renderFrame = initContactRings()
        break
      default:
        renderFrame = initHeroLattice()
    }

    // Animation Loop
    let lastTime = performance.now()
    const loop = (now: number) => {
      const delta = (now - lastTime) * 0.001
      lastTime = now

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.06
      mouseY += (targetMouseY - mouseY) * 0.06

      if (isVisible) {
        time += reducedMotion ? delta * 0.08 : delta
        renderFrame(time)
      }

      animationId = requestAnimationFrame(loop)
    }

    animationId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      darkModeMql.removeEventListener('change', handleThemeChange)
      observer.disconnect()
    }
  }, [variant])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ opacity }}
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none transition-opacity duration-700 ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
