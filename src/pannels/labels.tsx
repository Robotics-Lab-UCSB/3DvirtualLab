import React from "react";
import { Text } from "@react-three/drei";
import { DoubleSide } from "three";

interface LabelProps {
  position?: [number, number, number];
  rotation?: [number, number, number]; 
  label: string; // Changed to label for static text
  size?: number;
  color?: string;
}

const Label: React.FC<LabelProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  label,
  size = 1,
  color = "white",
}) => {
  return (
    <Text
      position={position}
      rotation={rotation}
      fontSize={size}
      color={color}
      font="/fonts/digital-7.woff" // Optional: Replace with your font if needed
      anchorX="left"
      anchorY="middle"
    >
      {label}
      <meshStandardMaterial attach="material" side={DoubleSide} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.3} />
    </Text>
  );
};

export default Label;
