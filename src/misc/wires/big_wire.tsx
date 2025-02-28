import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

const FallingBall: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [position, setPosition] = useState(new THREE.Vector3(0, 160, 0)); // Starting position of the ball
  const [velocity, setVelocity] = useState(0); // Initial velocity

  useFrame(() => {
    if (meshRef.current) {
      const acceleration = -9.8; // Acceleration due to gravity (negative for downward movement)
      const delta = 0.02; // Approximate frame time (60 FPS)

      // Update velocity and position
      const newVelocity = velocity + acceleration * delta;
      const newPositionY = position.y + newVelocity * delta;

      // Stop the ball when it reaches the ground
      if (newPositionY <= 0) {
        setVelocity(0);
        setPosition(new THREE.Vector3(position.x, 0, position.z));
      } else {
        setVelocity(newVelocity);
        setPosition(new THREE.Vector3(position.x, newPositionY, position.z));
      }

      // Update the ball's position in the scene
      meshRef.current.position.set(position.x, position.y, position.z);
    }
  });

  return (
    <mesh ref={meshRef} position={position.toArray()}>
      <sphereGeometry args={[1, 32, 32]} /> {/* Radius = 1 */}
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

export default FallingBall;