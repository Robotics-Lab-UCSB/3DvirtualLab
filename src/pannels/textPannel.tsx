import React, { useState, useRef } from "react";
import { Text } from "@react-three/drei";
import { DoubleSide } from "three";
import { useInstruments } from "../contexts/instrument_value";
import { useFrame } from "@react-three/fiber";

interface Text3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number]; 
  unique_id: string;
  size?: number;
  color?: string;
  category_read: string;
  decimalPlaces?: number; // Controls decimal places
  timeDelay?: number; // Time delay in milliseconds (default: 500ms)
}

const Text3D: React.FC<Text3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = 1,
  color = "white",
  unique_id,
  category_read,
  decimalPlaces = 2, // Default decimal places
  timeDelay = 300, // Default delay of 500ms
}) => {
  const { instruments, readInstrument } = useInstruments();
  const [displayText, setDisplayText] = useState<string>("Loading...");
  const lastUpdateTime = useRef<number>(0); // Track last update time

  useFrame(({ clock }) => {
    const currentTime = clock.getElapsedTime() * 1000; // Convert to milliseconds

    if (currentTime - lastUpdateTime.current >= timeDelay) {
      if (instruments[unique_id]) {
        let displayValue = readInstrument(unique_id, category_read);

        if (typeof displayValue === "string") {
          displayValue = parseFloat(displayValue); // Ensure it's a number
        }

        if (typeof displayValue === "number" && !isNaN(displayValue)) {
          if (category_read === "read_current") {
            let decimal = "0.000000";
            if (displayValue !== 0) {
              decimal = (displayValue + Math.random() * 0.01).toFixed(5);
            }
            setDisplayText(decimal);
          } else {
            setDisplayText(displayValue.toFixed(decimalPlaces)); // Format number
          }
        } else {
          setDisplayText("N/A"); // Handle invalid values
        }
      } else {
        setDisplayText("");
      }

      lastUpdateTime.current = currentTime; // Update last execution time
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
