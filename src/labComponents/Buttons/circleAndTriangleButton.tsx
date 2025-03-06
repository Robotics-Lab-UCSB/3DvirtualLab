import React, { useRef, useEffect, useState } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import * as THREE from "three";

interface ButtonProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  unique_id: string;
  typeGen: string;
  handleIntersect?: () => void;
}

const ButtonCircleAndTriangle: React.FC<ButtonProps> = ({
  position,
  rotation = [0, Math.PI, 0],
  scale = [1, 1, 1],
  unique_id,
  typeGen,
  handleIntersect, // Custom function to handle interaction
}) => {
  const groupRef = useRef<THREE.Group | null>(null);
  const [isMovingForward, setIsMovingForward] = useState(false);
  const [isMovingBack, setIsMovingBack] = useState(false);
  const [model, setModel] = useState<THREE.Object3D | null>(null);

  // Dynamically load GLB model based on `typeGen`
  const gltf = useLoader(
    GLTFLoader,
    typeGen === "triangleButton"
      ? "/current_instrument_buttons/triangle_button3.glb"
      : "/current_instrument_buttons/circle_button5.glb"
  );

  // Default intersection handler (animation + custom handler if provided)
  const defaultHandleIntersect = () => {
    if (!isMovingForward && !isMovingBack) {
      setIsMovingForward(true);
    }
    if (handleIntersect) {
      handleIntersect(); // Call the custom handler if it exists
    }
  };

  // Clone and configure the GLTF model on load
  useEffect(() => {
    if (gltf?.scene) {
      const clonedScene = gltf.scene.clone();

      // Attach intersection handler to each mesh
      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.userData.unique_id = unique_id;
          mesh.userData.handleIntersect = defaultHandleIntersect; // Attach default handle
          mesh.userData.type = "triangle_circle_button";
        }
      });

      setModel(clonedScene);
    }
  }, [gltf, unique_id, handleIntersect]);

  // Animation logic for a simple bounce effect
  useFrame(() => {
    if (groupRef.current) {
      const posZ = groupRef.current.position.z;

      if (isMovingForward) {
        const targetZ = position[2] - 0.5;
        groupRef.current.position.z = THREE.MathUtils.lerp(posZ, targetZ, 0.6);
        if (Math.abs(posZ - targetZ) < 0.01) {
          setIsMovingForward(false);
          setTimeout(() => setIsMovingBack(true), 50);
        }
      }

      if (isMovingBack) {
        const targetZ = position[2];
        groupRef.current.position.z = THREE.MathUtils.lerp(posZ, targetZ, 0.4);
        if (Math.abs(posZ - targetZ) < 0.01) {
          setIsMovingBack(false);
        }
      }
    }
  });

  if (!model) return null;

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={model} />
    </group>
  );
};

export default ButtonCircleAndTriangle;
