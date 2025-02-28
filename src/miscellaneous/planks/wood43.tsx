import React from "react"
import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import { useEffect, useState } from "react"
import { GLTFLoader } from "three-stdlib"
import * as THREE from "three"

// Grid component with cube
const OakPlank43: React.FC = () => {
  const gltf = useLoader(GLTFLoader, "/wood_planks/wood_floor_4_3(2).glb");
  const [model, setModel] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    if (gltf.scene) {
      // Clone the GLTF scene to avoid conflicts
      const clonedScene = gltf.scene.clone()

      // Add unique ID and interaction behavior to the clone
      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.userData.unique_id = "light_oak_wood_plank"
        }
      })

      setModel(clonedScene) // Store the cloned model in state
    }
  }, [gltf])

  return (
    <>
      {model && (
        <primitive object={model} rotation={[0, 3 * Math.PI / 2, 0]} scale={[1, 1, 1]} position={[0, 0, 0]} />
      )}
    </>
  )
}

export default OakPlank43
