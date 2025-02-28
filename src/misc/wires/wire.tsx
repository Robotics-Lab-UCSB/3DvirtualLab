import { useMemo } from "react";
import { Points } from "@react-three/drei";
import * as THREE from "three";

const ParticleConnection = ({ start, end }) => {
  const positions = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      points.push(
        start[0] * (1 - t) + end[0] * t,
        start[1] * (1 - t) + end[1] * t,
        start[2] * (1 - t) + end[2] * t
      );
    }
    return new Float32Array(points);
  }, [start, end]);

  return (
    <Points positions={positions} stride={3}>
      <pointsMaterial color="yellow" size={0.05} />
    </Points>
  );
};

export default ParticleConnection;