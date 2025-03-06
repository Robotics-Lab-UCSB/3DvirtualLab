import React, { useRef, useState, useEffect } from "react"
import * as THREE from "three"
import { useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three-stdlib"
import WireStable from "../SmallInstruments/wire_stable"
import Text3D from "../../pannels/textPannel"
import { useInstruments } from '../../contexts/instrument_value';

interface DVM2PROPS {
  position: [number, number, number] // Position prop
  rotation?: [number, number, number] // Optional rotation prop
  unique_id: string
  scale?: [number, number, number]
}

const DVM: React.FC<DVM2PROPS> = ({
  position,
  rotation = [Math.PI / 2, 0, 0], // Default to 90 degrees around the Y-axis
  unique_id,
  scale = [1.7, 1.7, 1.85],
}) => {
  const gltf = useLoader(GLTFLoader, "/dcv/dcv23.glb")
  const [model, setModel] = useState<THREE.Object3D | null>(null)
  const groupRef = useRef<THREE.Group | null>(null)
  const { registerInstrument, updateInstrument, readInstrument } = useInstruments();
  
  useEffect(() => {
    registerInstrument(unique_id, {
      read_voltage: 0,
    });
  }, [])

  // Clone and prepare the model
  useEffect(() => {
    if (gltf.scene) {
      const clonedScene = gltf.scene.clone()

      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.userData.unique_id = unique_id
          mesh.userData.type = "dcv"
        }
      })

      setModel(clonedScene)
    }
  }, [gltf, unique_id])

  return (
    
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {model && <primitive object={model}/>}
        <Text3D unique_id={unique_id} category_read={"read_voltage"} position={[-2, 2.5, 3]} rotation={[3 * Math.PI / 2, 0, 0]} size={3} color="white"/>
        <Text3D unique_id={unique_id} category_read={"read_voltage"} position={[-2, 2.4, 3]} rotation={[3 * Math.PI / 2, 0, 0]} size={3} color="black"/>
    </group>
  )
}

export default DVM
