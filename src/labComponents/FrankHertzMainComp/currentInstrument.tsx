import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import Text3D from "../../pannels/textPannel";
import ButtonCircleAndTriangle from "../Buttons/circleAndTriangleButton";
import LongButton from "../Buttons/longButton";
import { useInstruments } from "../../contexts/instrument_value";

interface CurrentInstrumentProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  unique_id: string;
}

const CurrentInstrument: React.FC<CurrentInstrumentProps> = ({
  position,
  rotation,
  unique_id = "current_instrument",
}) => {
  const groupRef = useRef<THREE.Group | null>(null);

  // Load the STL geometry and texture
  const gltf = useLoader(GLTFLoader, "/current_instrument/ci3.glb");
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  const numberRef = useRef(0);
  const { registerInstrument, updateInstrument, readInstrument } = useInstruments();
  const [readCurrent, setReadCurrent] = useState<number>(0);
  const [timeDelay, setTimeDelay] = useState<number>(30);

  useEffect(() => {
    registerInstrument(unique_id, {
      read_current: readCurrent,
    });

    const roundedValue = readCurrent.toFixed(5); // Format the value to 5 decimal places

    // Optionally update or log the rounded value
    // console.log(roundedValue);
  }, []);

  const setTimeDelayTo20msThenReset = () => {
    setTimeDelay(500); // Set to 20ms
  
    setTimeout(() => {
      setTimeDelay(30); // Reset back to default (or any previous value)
    }, 2000); // Reset after 2 seconds
  };
  
  useEffect(() => {
    if (gltf.scene) {
      // Clone the GLTF scene to avoid conflicts
      const clonedScene = gltf.scene.clone();

      // Add unique ID and interaction behavior to the clone
      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.userData.unique_id = unique_id;
          mesh.userData.type = "current_instrument";
          // mesh.userData.handleIntersect = handleClick;
        }
      });

      setModel(clonedScene); // Store the cloned model in state
    }
  }, [gltf, unique_id]);

  // Create an array of 8 button positions
  const buttonPositions = Array.from({ length: 8 }, (_, index) => {
    // Calculate horizontal position for each button (starting from -14, with 4 units spacing)
    const xPos = -13.6 + index * 2.69;
    return [xPos, 5, 26.5] as [number, number, number]; // y=4, z=25 positions the buttons in front of the instrument
  });

  const verticalButtonPositions = Array.from({ length: 3 }, (_, index) => {
    // Position on the right side of the instrument, with vertical spacing
    const yPos = 5 - index * 2.1; // Start from y=7 and go down with 2.5 units spacing
    return [-16.2, yPos, 26.9] as [number, number, number]; // x=6 positions them on the right side
  });

  const longButtonPositions1 = Array.from({ length: 4 }, (_, index) => {
    // Calculate horizontal position for each button (starting from -14, with 4 units spacing)
    const xPos = -12.3 + index * 5.38;
    return [xPos, 3.42, 26.8] as [number, number, number]; // y=4, z=25 positions the buttons in front of the instrument
  });

  const longButtonPositions2 = Array.from({ length: 4 }, (_, index) => {
    // Calculate horizontal position for each button (starting from -14, with 4 units spacing)
    const xPos = -12.3 + index * 5.38;
    return [xPos, 1.42, 26.8] as [number, number, number]; // y=4, z=25 positions the buttons in front of the instrument
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {model && <primitive object={model} scale={[0.25, 0.25, 0.25]} />}
        <Text3D timeDelay={timeDelay} unique_id={unique_id} category_read={"read_current"} position={[-14, 11, 27.2]} rotation={[ Math.PI , Math.PI, Math.PI]} size={6} color="white" decimalPlaces={4}/>

      {/* Row of 8 circle buttons */}
      {buttonPositions.map((buttonPosition, index) => (
        <ButtonCircleAndTriangle
          key={`circle-button-${index}`}
          position={buttonPosition}
          rotation={[Math.PI / 2, 3 * Math.PI / 2, 0]}
          scale={[0.1, 0.1, 0.1]}
          handleIntersect={setTimeDelayTo20msThenReset}
          unique_id={`circle-button-${index}`}
          typeGen="circleButton" // Using circleButton type for all buttons
        />
      ))}
  
      {/* Vertical circle buttons */}
      {verticalButtonPositions.map((buttonPosition, index) => (
        <ButtonCircleAndTriangle
          key={`triangle-button-${index}`}
          position={buttonPosition}
          rotation={[Math.PI / 2, 3 * Math.PI / 2, 0]}
          scale={[0.05, 0.05, 0.05]}
          unique_id={`triangle-button-${index}`}
          typeGen="circleButton" // Using triangleButton type for vertical buttons
        />
      ))}

      <ButtonCircleAndTriangle
        key={`triangle-button-${0}`}
        position={[8.6, 4.7, 27.1]}
        rotation={[0, 0, 0]}
        scale={[0.25, 0.25, 0.25]}
        unique_id={`triangle-button-${0}`}
        typeGen="triangleButton" // Using triangleButton type for vertical buttons
      />

      <ButtonCircleAndTriangle
        key={`triangle-button-${1}`}
        position={[8.6, 2, 27.1]}
        rotation={[Math.PI, 0, 0]}
        scale={[0.25, 0.25, 0.25]}
        unique_id={`triangle-button-${1}`}
        typeGen="triangleButton" // Using triangleButton type for vertical buttons
      />

      {longButtonPositions1.map((buttonPosition, index) => (
        <LongButton
          key={`long-button-${index}`}
          position={buttonPosition}
          rotation={[Math.PI, 3 * Math.PI, 0]}
          scale={[0.35, 0.35, 0.35]}
          unique_id={`long-button-${index}`}
        />
      ))}

      {longButtonPositions2.map((buttonPosition, index) => (
        <LongButton
          key={`long-button-${index}`}
          position={buttonPosition}
          rotation={[Math.PI, 3 * Math.PI, 0]}
          scale={[0.35, 0.35, 0.35]}
          unique_id={`long-button-${index}`}
        />
      ))}

        <LongButton
          key={`long-button-${9}`}
          position={[8.9, 3.8, 26.95]}
          rotation={[Math.PI, 3 * Math.PI, 0]}
          scale={[0.23, 0.28, 0.23]}
          unique_id={`long-button-${9}`}
        />
    </group>
  );
};

export default CurrentInstrument;
