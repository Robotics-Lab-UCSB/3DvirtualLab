import React, { useRef, useState, useEffect } from "react"
import * as THREE from "three"
import { useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three-stdlib"
import CurrentKnob from "../knobs/currentKnob"
import { useInstruments } from "../../contexts/instrument_value"
import Label from "../../pannels/labels"
interface CurrentRegulatorProps {
  position: [number, number, number] // Position prop
  rotation?: [number, number, number] // Optional rotation prop
  unique_id: string
  scale?: [number, number, number]
}

const CurrentRegulator: React.FC<CurrentRegulatorProps> = ({
  position,
  rotation = [0, 0, 0], // Default to 90 degrees around the Y-axis
  unique_id = "hertz_current_regulator",
  scale = [1, 1, 1],
}) => {
  const gltf = useLoader(GLTFLoader, "/frank_hertz/current_regulator.glb")
  const [model, setModel] = useState<THREE.Object3D | null>(null)
  const groupRef = useRef<THREE.Group | null>(null)
  const { registerInstrument, updateInstrument, readInstrument } = useInstruments();

  useEffect(() => {
    registerInstrument(unique_id, {
      filament_voltage: 0,
      retarding_voltage: 0,
      accelerating_voltage: 0
    });
  }, [])

  useEffect(() => {
    if (gltf.scene) {
      const clonedScene = gltf.scene.clone()

      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.userData.unique_id = unique_id
          mesh.userData.type = "current_regulator"
        }
      })

      setModel(clonedScene)
    }
  }, [gltf, unique_id])

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {model && <primitive object={model} scale={[0.3, 0.3, 0.3]} />}
      <CurrentKnob
        position={[-3, 14.7, 4]}
        unique_id={unique_id}
        type_inner="filament_knob"
      />
      <Label label="Filament Knob" position={[2, 14.2, 10]} rotation={[3 * Math.PI / 2, 0, Math.PI]}  size={2} color="white" />
      <Label label="Filament Knob" position={[2, 14, 10]} rotation={[3 * Math.PI / 2, 0, Math.PI]}  size={2} color="black" />
      <CurrentKnob
        position={[-8.6, 14.5, -23.7]}
        scale={[0.1, 0.2, 0.1]}
        unique_id={unique_id}
        type_inner="VRknob"
      />
      <Label label="VR Knob" position={[-5.5, 14.2, -20]} rotation={[3 * Math.PI / 2, 0, Math.PI]} size={2} color="white" />
      <Label label="VR Knob" position={[-5.5, 14, -20]} rotation={[3 * Math.PI / 2, 0, Math.PI]} size={2} color="black" />
      <CurrentKnob
        position={[3, 14.5, -23.7]}
        scale={[0.1, 0.2, 0.1]}
        unique_id={unique_id}
        type_inner="VAknob"
      />
      <Label label="VA Knob" position={[6, 14.2, -20]} rotation={[3 * Math.PI / 2, 0, Math.PI]} size={2} color="white" />
      <Label label="VA Knob" position={[6, 14, -20]} rotation={[3 * Math.PI / 2, 0, Math.PI]} size={2} color="black" />
    </group>
  )
}

export default CurrentRegulator
