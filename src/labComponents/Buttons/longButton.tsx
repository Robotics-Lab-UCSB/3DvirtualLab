import React, { useRef, useEffect, useState } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import * as THREE from "three";

interface ButtonProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  unique_id: string;
}

const LongButton: React.FC<ButtonProps> = ({
  position,
  rotation = [0, Math.PI, 0], // Set rotation to zero initially
  scale = [1, 1, 1],
  unique_id,
}) => {
  const groupRef = useRef<THREE.Group | null>(null);
  const [isTiltingLeft, setIsTiltingLeft] = useState(false);
  const [isTiltingRight, setIsTiltingRight] = useState(false);
  const [resetTilt, setResetTilt] = useState(false);
  const [model, setModel] = useState<THREE.Object3D | null>(null);

  // Load model
  const gltf = useLoader(GLTFLoader, "/current_instrument_buttons/long_button_glossy.glb");

  useEffect(() => {
    if (gltf?.scene) {
      const clonedScene = gltf.scene.clone();
      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.userData.unique_id = unique_id;
          mesh.userData.handleIntersect = handleClick;
          mesh.userData.type = "long_button_type";
        }
      });

      setModel(clonedScene);
    }
  }, [gltf, unique_id]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.PI; // Manually set the rotation here
    }
  }, [model]);

  useFrame(() => {
    if (groupRef.current) {
      let rotY = groupRef.current.rotation.y;

      if (isTiltingLeft) {
        const targetRotY = Math.PI - 0.2; // Adjusted from Math.PI
        groupRef.current.rotation.y = THREE.MathUtils.lerp(rotY, targetRotY, 0.5);

        if (Math.abs(rotY - targetRotY) < 0.01) {
          setIsTiltingLeft(false);
          setTimeout(() => setResetTilt(true), 50);
        }
      }

      if (isTiltingRight) {
        const targetRotY = Math.PI + 0.2; // Adjusted from Math.PI
        groupRef.current.rotation.y = THREE.MathUtils.lerp(rotY, targetRotY, 0.5);

        if (Math.abs(rotY - targetRotY) < 0.01) {
          setIsTiltingRight(false);
          setTimeout(() => setResetTilt(true), 50);
        }
      }

      if (resetTilt) {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(rotY, Math.PI, 0.3);
        if (Math.abs(rotY - Math.PI) < 0.01) {
          setResetTilt(false);
        }
      }
    }
  });

  const handleClick = (position: string) => {
    console.log("Button clicked at position:", position);
    if (!isTiltingLeft && !isTiltingRight) {
      if (position === "right") {
        setIsTiltingLeft(true);
      } else if (position === "left") {
        setIsTiltingRight(true);
      }
    }
  };

  if (!model) return null;

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      <primitive object={model} />
    </group>
  );
};

export default LongButton;
