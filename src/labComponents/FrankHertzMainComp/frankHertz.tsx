import React, { useRef, useState, useEffect } from "react"
import * as THREE from "three"
import { useLoader, ThreeEvent } from "@react-three/fiber"
import { GLTFLoader } from "three-stdlib"
import Window from "../../pannels/window"
import CircularTherm from "../SmallInstruments/circularTherm/thermometer_virtual"
import TopConnector from "./top_connector"
import Waffle from "./waffle"
import FrankHertzTube from "./tube"
import Shooter from "../shooter"
import HeatingRods from "./heating_rods"
import Electrons from "../../raycasters/particles/eletrons"
import { Position } from '@xyflow/react';
import { NodePositionProvider } from '../../taskbar/node_mover/hook_position';
import { useInstruments } from "../../contexts/instrument_value"

interface FrankHertzMainProps {
  position: [number, number, number] // Position prop
  rotation?: [number, number, number] // Optional rotation prop
  unique_id: string
  scale?: [number, number, number]
}

const FrankHertzMain: React.FC<FrankHertzMainProps> = ({
  position,
  rotation = [0, 3 * Math.PI / 2, 0], // Default to 90 degrees around the Y-axis
  unique_id = "frank_hertz_main", // TODO: This should be ALWAYS unique
  scale = [1, 1.2, 1],
}) => {
  const gltf = useLoader(GLTFLoader, "/frank_hertz/main_box3.glb")
  const [model, setModel] = useState<THREE.Object3D | null>(null)
  const groupRef = useRef<THREE.Group | null>(null)
  const { registerInstrument, updateInstrument, readInstrument } = useInstruments();
  
  useEffect(() => {
    registerInstrument(unique_id, {
      output_current: 0,
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
          mesh.userData.controlled_by = unique_id
          mesh.userData.type = "frank_hertz_chasis"
          mesh.renderOrder = 0
        }
      })

      setModel(clonedScene)
    }
  }, [gltf, unique_id])

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    console.log("Clicked group userData:", event.object.userData);
  };

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} userData={{ unique_instrument_id: unique_id }} onClick={handleClick} >
      {model && <primitive object={model} scale={[0.65, 0.65, 0.65]} />}
      <Window position={[0, 35.2, 13.9]}/>
      <Window rotation = {[0, Math.PI, Math.PI / 2]} position={[12, 35.2, 0.9]}/>
      <Window position={[0, 35.2, -14]}/>

      <TopConnector position={[-0.9, 37.5, -0.2]} />
      <Waffle position={[-2, 35.9, 1.9]} />
      <FrankHertzTube position={[-2, 20, 0]} rotation={[0, Math.PI / 2, 0]}/>
      <CircularTherm position={[-15, 49.2, 10.5]} />
      <Shooter position={[-1, 16.4, -0.5]} />
      <HeatingRods position={[-2.5, 18.5, 2.5]} />
    </group>
  )
}

export default FrankHertzMain
