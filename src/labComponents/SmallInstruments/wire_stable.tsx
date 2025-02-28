import React, { useEffect, useState, useRef, forwardRef } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";

interface WireStableProps {
  position: [number, number, number]; // Position prop
  rotation?: [number, number, number]; // Optional rotation prop
  unique_id: string;
  scale?: [number, number, number];
}

// Use React.forwardRef to forward the ref to the group
const WireStable = forwardRef<THREE.Group, WireStableProps>(
  ({ position, rotation = [Math.PI / 2, 0, 0], unique_id, scale = [0.5, 0.5, 0.5] }, ref) => {
    const gltf = useLoader(GLTFLoader, "/wire_components/wire_stable.glb");
    const [model, setModel] = useState<THREE.Object3D | null>(null);
    const groupRef = useRef<THREE.Group | null>(null);

    // Clone and prepare the model
    useEffect(() => {
      if (gltf.scene) {
        const clonedScene = gltf.scene.clone();

        clonedScene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.userData.unique_id = unique_id;
            mesh.userData.type = "wire_stable";
          }
        });

        setModel(clonedScene);
      }
    }, [gltf, unique_id]);

    // Attach the forwarded ref to the group
    useEffect(() => {
      if (ref && typeof ref === "object" && groupRef.current) {
        (ref as React.MutableRefObject<THREE.Group | null>).current = groupRef.current;
      }
    }, [ref]);

    return (
      <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
        {model && <primitive object={model} />}
      </group>
    );
  }
);

WireStable.displayName = "WireStable"; // Set a display name for debugging purposes

export default WireStable;
