import React, { useRef, useState, useEffect } from "react"
import * as THREE from "three"
import { useLoader, useThree } from "@react-three/fiber"
import { GLTFLoader, RGBELoader } from "three-stdlib"
import Electrons from "../../raycasters/particles/eletrons"
import AirParticles from "../../raycasters/particles/air_particles"
import { Position } from '@xyflow/react';

interface FrankHertzTubeProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  unique_id?: string
  scale?: [number, number, number]
}

const FrankHertzTube: React.FC<FrankHertzTubeProps> = ({
  position,
  rotation = [0, 0, 0],
  unique_id = "frank_hertz_main",
  scale = [0.4, 0.3, 0.4],
}) => {
  const gltf = useLoader(GLTFLoader, "/frank_hertz/tube4.glb")
  const [model, setModel] = useState<THREE.Object3D | null>(null)
  const groupRef = useRef<THREE.Group | null>(null)

  // Access the Three.js scene
  const { scene } = useThree()

  // Load the HDR environment map
  const hdrEnvMap = useLoader(RGBELoader, "/environment/sky.hdr")

  useEffect(() => {
    if (hdrEnvMap) {
      hdrEnvMap.mapping = THREE.EquirectangularReflectionMapping // Set mapping type
      scene.environment = hdrEnvMap // Set as the scene's environment map
      scene.background = hdrEnvMap // Optional: Set as the scene background
    }
  }, [hdrEnvMap, scene])

  useEffect(() => {
    if (gltf.scene) {
      const clonedScene = gltf.scene.clone()

      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.userData.unique_id = unique_id
          mesh.userData.type = "frank_hertz_tube"

          // Create glass material with HDR environment map
          const glassMaterial = new THREE.MeshPhysicalMaterial({
            roughness: 0,
            transmission: 0.95, // High transparency for glass
            ior: 1.5,           // Index of Refraction
            thickness: 1.5,       // Simulated glass thickness
            envMap: hdrEnvMap,  // Use HDR environment map
            envMapIntensity: 0.4,
            side: THREE.DoubleSide, // Render both sides of the glass
            clearcoat: 1,       // Add a shiny clear coat
            clearcoatRoughness: 0,
            transparent: true,  // Enable transparency
            opacity: 0.9,
          })

          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map(() => glassMaterial)
          } else {
            mesh.material = glassMaterial
          }

          // Disable shadow casting for glass
          mesh.castShadow = false
          mesh.receiveShadow = true
          mesh.renderOrder = 0;
        }
      })

      setModel(clonedScene)
    }
  }, [gltf, unique_id, hdrEnvMap])

  const boundingBox = new THREE.Box3(
    new THREE.Vector3(-20, -20, -20), // Min bounds
    new THREE.Vector3(20, 20, 20)     // Max bounds
)

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {model && <primitive object={model} scale={[0.65, 0.65, 0.65]} />}
      <Electrons width={21} height={90} position={[2, 49.5, 0]}/>
      <AirParticles width={21} height={90} position={[2, 49.5, 0]}/>
    </group>
  )
}

export default FrankHertzTube
