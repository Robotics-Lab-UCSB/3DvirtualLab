import React, { useRef, useEffect, useState } from "react"
import { useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three-stdlib"
import * as THREE from "three"

interface CurrentKnobProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  unique_id: string
  type_inner: string
}

const CurrentKnob: React.FC<CurrentKnobProps> = ({
  position,
  rotation = [0, 0, 0],
  unique_id,
  scale = [0.2, 0.3, 0.2],
  type_inner
}) => {
  const groupRef = useRef<THREE.Group | null>(null)

  // Load GLTF
  const gltf = useLoader(GLTFLoader, "/knobs/currentKnob.glb")
  const [model, setModel] = useState<THREE.Object3D | null>(null)

  useEffect(() => {
    if (gltf.scene) {
      const clonedScene = gltf.scene.clone()

      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.userData.unique_id = unique_id
          mesh.userData.type = "current_knob"
          mesh.userData.type_inner = type_inner
        }
      })

      setModel(clonedScene)
    }
  }, [gltf, unique_id])

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {model && <primitive object={model} />}
    </group>
  )
}

export default CurrentKnob
