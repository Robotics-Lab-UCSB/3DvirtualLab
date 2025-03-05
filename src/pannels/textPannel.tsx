import React from "react";
import { Text } from "@react-three/drei";
import { DoubleSide } from "three";
import { useInstruments } from "../contexts/instrument_value";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";

interface Text3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number]; 
  unique_id: string;
  size?: number;
  color?: string;
  category_read: string;
  decimalPlaces?: number; // New prop to control decimal places
}

const Text3D: React.FC<Text3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = 1,
  color = "white",
  unique_id,
  category_read,
  decimalPlaces = 2, // Default to 2 decimal places
}) => {
  const { instruments, readInstrument } = useInstruments();
  const [displayText, setDisplayText] = useState<string>("Loading...");

  useFrame(() => {
    if (instruments[unique_id]) {
      let displayValue = readInstrument(unique_id, category_read);

      if (typeof displayValue === "number") {
        displayValue = displayValue.toFixed(decimalPlaces); // Format number
      }

      setDisplayText(displayValue);
    } else {
      setDisplayText("");
    }
  });

  return (
    <Text
      position={position}
      rotation={rotation}
      fontSize={size}
      color={color}
      font="/fonts/digital-7.woff"
      anchorX="left"
      anchorY="middle"
    >
      {displayText}
      <meshStandardMaterial attach="material" side={DoubleSide} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.3} />
    </Text>
  );
};

export default Text3D;
