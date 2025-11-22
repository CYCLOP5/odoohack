"use client"

import { useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Environment, Stars } from "@react-three/drei"
import * as THREE from "three"

interface FloatingShapeProps {
  position: [number, number, number]
  color: string
  speed: number
  rotationSpeed: number
  scale: number
  wireframe?: boolean
}

function FloatingShape({ position, color, speed, rotationSpeed, scale, wireframe = false }: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()
    meshRef.current.rotation.x = time * rotationSpeed
    meshRef.current.rotation.y = time * rotationSpeed * 0.5
    meshRef.current.position.y = position[1] + Math.sin(time * speed) * 0.35
  })

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.15}
          metalness={0.4}
          transparent
          opacity={wireframe ? 0.25 : 0.55}
          transmission={0.7}
          thickness={0.8}
          emissive={new THREE.Color(color).multiplyScalar(0.25)}
          wireframe={wireframe}
        />
      </mesh>
    </Float>
  )
}

export default function ThreeScene() {
  const shapes = useMemo(
    () => [
      { position: [-4, 1.5, -8], color: "#714B67", speed: 1.8, rotationSpeed: 0.25, scale: 1.8 },
      { position: [3.5, -1, -6], color: "#017E84", speed: 2.2, rotationSpeed: 0.35, scale: 1.3 },
      { position: [0, 0.5, -10], color: "#8b5cf6", speed: 1.1, rotationSpeed: 0.18, scale: 2.4 },
      { position: [-2, -2, -5], color: "#02a0a8", speed: 1.6, rotationSpeed: 0.28, scale: 1.1, wireframe: true },
      { position: [5, 2, -9], color: "#d1b5d4", speed: 1.2, rotationSpeed: 0.22, scale: 1.4, wireframe: true },
    ],
    []
  )

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none transition-opacity duration-700">
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
        <color attach="background" args={["#030712"]} />
        <fog attach="fog" args={["#030712", 12, 30]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.1} color="#fff4ec" />
        <pointLight position={[-6, -4, -2]} intensity={0.8} color="#7f5a93" />

        {shapes.map((shape, index) => (
          <FloatingShape key={index} {...shape} />
        ))}

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, -6]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshBasicMaterial color="#090f1f" opacity={0.4} transparent />
        </mesh>

        <Stars radius={50} depth={20} count={2000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}