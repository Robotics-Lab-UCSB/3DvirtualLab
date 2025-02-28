import React, { useState, useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Vector3, DoubleSide } from "three";

interface Text3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number]; // Added rotation support
  size?: number;
  color?: string;
  digits?: number; // Number of digits before decimal
  decimalPlaces?: number; // Number of decimal places
}

const Text3D: React.FC<Text3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0], // Default rotation
  size = 1,
  color = "white",
  digits = 9, // Default to 9-digit number
  decimalPlaces = 2, // Default 2 decimal places
}) => {
  const [randomNumber, setRandomNumber] = useState("000000000.00");
  const frameCounter = useRef(0);

  useFrame(() => {
    frameCounter.current += 1;
    if (frameCounter.current >= 60) {
      const min = Math.pow(10, digits - 1); // Minimum value (e.g., 100000000 for 9 digits)
      const max = min * 9; // Maximum value
      const newNumber = (Math.random() * (max - min) + min).toFixed(decimalPlaces);
      setRandomNumber(newNumber);
      frameCounter.current = 0;
    }
  });

  return (
    <Text
      position={position}
      rotation={rotation} // Apply rotation
      fontSize={size}
      color={color}
      font="/fonts/digital-7.woff"
      anchorX="center"
      anchorY="middle"
    >
      {randomNumber}
        <meshStandardMaterial attach="material" side={DoubleSide} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.3} />
    </Text>
  );
};

export default Text3D;