import React, { useRef, useState, useEffect } from "react"
import * as THREE from "three"
import { useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three-stdlib"

interface TopConnectorProps {
  position: [number, number, number] // Position prop
  rotation?: [number, number, number] // Optional rotation prop
  unique_id?: string
  scale?: [number, number, number]
}

const TopConnector: React.FC<TopConnectorProps> = ({
  position,
  rotation = [0, 0, 0], // Default to no rotation
  unique_id = "frank_hertz_main",
  scale = [0.4, 0.2, 0.4],
}) => {
  const gltf = useLoader(GLTFLoader, "/frank_hertz/topend2.glb")
  const [model, setModel] = useState<THREE.Object3D | null>(null)
  const groupRef = useRef<THREE.Group | null>(null)

  // Clone and prepare the model
  useEffect(() => {
    if (gltf.scene) {
      const clonedScene = gltf.scene.clone()

      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.userData.unique_id = unique_id
          mesh.userData.type = "frank_hertz_top_part"
          mesh.renderOrder = 1
        }
      })

      setModel(clonedScene)
    }
  }, [gltf, unique_id])

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {model && <primitive object={model} scale={[0.65, 0.65, 0.65]} />}
    </group>
  )
}

export default TopConnector
