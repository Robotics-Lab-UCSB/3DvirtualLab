import React, { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import { useInstruments } from "../contexts/instrument_value";

interface FrankHertzMainProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  unique_id: string;
  scale?: [number, number, number];
}

const FloppyDisk: React.FC<FrankHertzMainProps> = ({
  position,
  rotation = [Math.PI / 2, 0, 0],
  unique_id,
  scale = [0.5, 0.5, 0.5],
}) => {
  const gltf = useLoader(GLTFLoader, "/floppy/floppy2.glb");
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const { registerInstrument } = useInstruments();

  useEffect(() => {
    registerInstrument(unique_id, {
        remembered_output: "none",
    });
  }, [])

  useEffect(() => {
    if (gltf.scene) {
      const clonedScene = gltf.scene.clone();
      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.userData.unique_id = unique_id;
          mesh.userData.type = "floppydisk";
        }
      });
      setModel(clonedScene);
    }
  }, [gltf, unique_id]);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {model && <primitive object={model} />}
    </group>
  );
};

export default FloppyDisk;
