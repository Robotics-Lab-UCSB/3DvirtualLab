import React, { useState, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";
import CornerText from "../miscellaneous/2DTexts/2dText.tsx";
import Grid from "../miscellaneous/planks/grid.tsx";
import RaycastingComponent from "../raycasters/lab1Raycaster.tsx";
import TripleOutput from "../labComponents/FrankHertzMainComp/tripleOutPutPowerSupply/mainComponent.tsx";
import CurrentInstrument from "../labComponents/FrankHertzMainComp/currentInstrument.tsx";
import OakPlank from "../miscellaneous/planks/lightOak.tsx";
import FrankHertzMain from "../labComponents/FrankHertzMainComp/frankHertz.tsx";
import CurrentRegulator from "../labComponents/FrankHertzMainComp/currentRegulator.tsx";
import ControlsComponent from "../miscellaneous/controls/cameracontrol.tsx";
import VVR from "../labComponents/FrankHertzMainComp/VariableVoltageRegulator/mainframe.tsx";
import FloatingSquare from "../taskbar/mainBlock.tsx";
import { CameraProvider } from "../contexts/cameraPositionContext.tsx";
import Lab1Camera from "./cameras/lab1Camera.tsx";
import { WebSocketProvider } from '../contexts/websocketContext';
import FallingBall from "../misc/wires/big_wire.tsx";
import FrankHertzTube from "../labComponents/FrankHertzMainComp/tube.tsx";
import TopConnector from "../labComponents/FrankHertzMainComp/top_connector.tsx";
import Waffle from "../labComponents/FrankHertzMainComp/waffle.tsx";
import DVM from "../labComponents/FrankHertzMainComp/digitalVoltmeter.tsx";
import WireStable from "../labComponents/SmallInstruments/wire_stable.tsx";
import { WirePort } from "../miscellaneous/wirePort.tsx";
import { generateWirePorts } from "../miscellaneous/wirePort.tsx";
import GasSimulation from "../raycasters/particles.tsx";
import Electrons from "../raycasters/particles/eletrons.tsx";
import DVM2 from "../labComponents/FrankHertzMainComp/digitalVoltmeter2.tsx";
import { InstrumentProvider } from '../contexts/instrument_value';
import { NodePositionProvider } from "../taskbar/node_mover/hook_position.tsx";
import { NodeEdgeProvider } from "../taskbar/node_mover/node_edge_context.tsx";
const GraphPaperComponent: React.FC = () => {
  const wirePorts = generateWirePorts();

  return (
    <InstrumentProvider>
    <NodePositionProvider> 
    <NodeEdgeProvider>
    <Suspense
      fallback={<CornerText position="top-left" text="Loading your Lab..." />}
    >
      <CameraProvider>
      {/* <WebSocketProvider url="ws://localhost:8080/" labID="frankhertz1">  */}
      <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
        <CornerText position="top-left" text="Frank-Hertz Lab" />
        <FloatingSquare />
        <Canvas
          gl={{ antialias: true }}
          onCreated={({ gl, scene }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 0.7 // Reduce exposure for less intensity
            scene.environmentIntensity = 0.5 // Reduce environment lighting
          }}
        >
           <>
            {wirePorts.map((wirePort) => (
              <WireStable
                key={wirePort.uniqueId}
                position={[wirePort.position.x, wirePort.position.y, wirePort.position.z]}
                unique_id={wirePort.uniqueId}
                ref={(ref) => {
                  if (ref) {
                    wirePort.threeObject = ref; // Store the pointer to the rendered object
                  }
                }}
              />
            ))}
            </>
          {/* Raycasting Component */}
          {/* Camera and Thermometer */}
          <Lab1Camera/>

          {/* Ambient Light */}
          <Environment files="/environment/sky.hdr" background />
          <ambientLight intensity={0.7}/>

          {/* Controls */}
         {/* <ControlsComponent /> */}

          {/* Components: From Bottom to Top*/}
          <WebSocketProvider url="ws://localhost:8080/" labID="frankhertz1">
            <RaycastingComponent />
            <Grid />

            <Electrons position={[5.5, 57, -2.5]} width={8.5} length={8} height={25} />
            <mesh position={[5.5, 57, -2.5]}>
                <boxGeometry args={[10, 10, 10]} />
                <meshBasicMaterial color="white" wireframe />
            </mesh>
            <GasSimulation position={[5.5, 57, -2.5]} width={8.5} length={8} height={25}/>

            <TripleOutput position={[-22, -0.3, 22]} unique_id="triple_output_1" />
            <CurrentInstrument unique_id="triple_output_1"  position={[27, 0.5, 0]} />
            <OakPlank />

            <FrankHertzMain unique_id="triple_output_1"  position={[5, 12, 0]}/>

            <CurrentRegulator unique_id="triple_output_1"  position={[40, 26, 5]}/>
            <DVM unique_id="triple_output_1"  position={[20, 30, 23]} scale={[1.7, 1.7, 1.85]}/>
            <VVR unique_id="triple_output_1"  position={[-30, 24, 2]} />
            <WireStable position ={[0.32, 80, -5.6]} rotation={[0, 0, Math.PI / 2]} scale={[0.1, 0.1, 0.1]} unique_id="wire_stable_left_1" />
            
            <DVM2 position={[30, 80, 8]} scale={[1.7, 1.7, 1.85]} rotation={[0, Math.PI, 0]} unique_id="DVM_1"/>
          </WebSocketProvider> 
        </Canvas>
      </div>
      {/* </WebSocketProvider> */}
      </CameraProvider>
    </Suspense>
    </NodeEdgeProvider>
    </NodePositionProvider>
    </InstrumentProvider>
  )
}

export default GraphPaperComponent
