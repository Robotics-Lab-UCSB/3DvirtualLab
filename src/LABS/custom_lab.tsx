import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";
import CornerText from "../miscellaneous/2DTexts/2dText.tsx";
import Grid from "../miscellaneous/planks/grid.tsx";
import CustomLabRaycastingComponent from "../raycasters/custom_lab_caster.tsx";
import FloatingSquare from "../taskbar/mainBlock.tsx";
import { CameraProvider } from "../contexts/cameraPositionContext.tsx";
import Lab1Camera from "./cameras/lab1Camera.tsx";
import { useNodePosition } from "../taskbar/node_mover/hook_position";
import FrankHertzMain from "../labComponents/FrankHertzMainComp/frankHertz.tsx";
import VVR from "../labComponents/FrankHertzMainComp/VariableVoltageRegulator/mainframe.tsx";
import CurrentRegulator from "../labComponents/FrankHertzMainComp/currentRegulator.tsx";
import TripleOutput from "../labComponents/FrankHertzMainComp/tripleOutPutPowerSupply/mainComponent.tsx";
import DVM from "../labComponents/FrankHertzMainComp/digitalVoltmeter.tsx";
import ParticleConnection from "../misc/wires/wire.tsx";
import OakPlank43 from "../miscellaneous/planks/wood43.tsx";
import Triple_Output_supply from "../taskbar/lab_nodes/triple_output_supply.tsx";

const object3DMap: Record<string, React.FC<{ position: [number, number, number]; rotation?: [number, number, number]; scale?: [number, number, number]}>> = {
  "FrankHertzBox": FrankHertzMain,
  "Variac": VVR,
  "VVR": DVM,
  "Electrometer": CurrentRegulator,
  "Triple_Output_supply": TripleOutput,
};

const CustomLab: React.FC = () => {
  const { nodePositions } = useNodePosition();
  const [sceneObjects, setSceneObjects] = useState<React.ReactNode[]>([]);

  // ✅ Use Effect: Update Scene when `nodePositions` changes
  useEffect(() => {
    console.log("Updating Scene with new nodes:", nodePositions);

    const newObjects = Object.entries(nodePositions).map(([id, { x, y, z, type }]) => {
        console.log("Processing Node ID:", id, "Data:", { x, y, z, type });
        
        var position: [number, number, number] = [x, z, y];        
        position = position.map((coord) => coord / 4.8) as [number, number, number];

        var xOffset = 0;  
        var yOffset = 0;  
        var zOffset = 0;  
        var rotation: [number, number, number] = [0, 0, 0]; 

        if (type === "FrankHertzBox") {
            xOffset = -170;
            yOffset = -120;
            const Component = object3DMap[type]; 
            position = [
                position[0] + xOffset, 
                position[1] + zOffset, 
                position[2] + yOffset
            ];
            rotation=[0, 3 * Math.PI / 2, 0];
            return <Component key={id} position={position} rotation={rotation} scale={[1.2, 1.44, 1.2]}/>;
        } else if (type === "VVR") {
            xOffset = -170;
            yOffset = -120;
            zOffset = 15;
            rotation = [0, Math.PI, 0];
        } else if (type === "Electrometer") {
            xOffset = -168;
            yOffset = -110;
            zOffset = 15;
            rotation = [0, Math.PI / 2, 0];
        } else if (type === "Triple_Output_supply") {
            xOffset = -158;
            yOffset = -95;
            zOffset = 15;
        }
        
        const Component = object3DMap[type]; // Ensure the type maps to a component

        position = [
            position[0] + xOffset, // X-axis offset
            position[1] + zOffset, // Z-axis offset
            position[2] + yOffset  // Y-axis offset
        ];
        if (!Component) {
            console.warn(`Component for type "${type}" not found.`);
            return null;
        }

      return <Component key={id} position={position} rotation={rotation}/>;
    });

    setSceneObjects(newObjects);
  }, [nodePositions]); // ✅ Runs only when nodePositions updates

  return (
    <Suspense fallback={<CornerText position="top-left" text="Loading your Lab..." />}>
      <CameraProvider>
        <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
          <CornerText position="top-left" text="Your Custom Lab" />
          <FloatingSquare />
          <Canvas
            gl={{ antialias: true }}
            onCreated={({ gl, scene }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 0.7; // Reduce exposure for less intensity
              scene.environmentIntensity = 0.5; // Reduce environment lighting
            }}
          >
            <Lab1Camera />
            <Environment files="/environment/sky.hdr" background />
            <ambientLight intensity={0.7} />
            <CustomLabRaycastingComponent />
            <OakPlank43 />
            <ParticleConnection start={[0, 0, 0]} end={[100, 100, 100]} />

            {/* Render dynamically added 3D objects */}
            {sceneObjects}
          </Canvas>
        </div>
      </CameraProvider>
    </Suspense>
  );
};

export default CustomLab;
