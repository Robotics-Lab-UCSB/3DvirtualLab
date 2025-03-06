import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

class AirParticle {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    bounds: THREE.Box3;

    constructor(bounds: THREE.Box3) {
        this.position = new THREE.Vector3(
            THREE.MathUtils.randFloat(bounds.min.x, bounds.max.x),
            THREE.MathUtils.randFloat(bounds.min.y, bounds.max.y),
            THREE.MathUtils.randFloat(bounds.min.z, bounds.max.z)
        );

        // 🔹 Increased speed range (-0.1 to 0.1) for more movement
        this.velocity = new THREE.Vector3(
            THREE.MathUtils.randFloat(-0.1, 0.1),
            THREE.MathUtils.randFloat(-0.1, 0.1),
            THREE.MathUtils.randFloat(-0.1, 0.1)
        );

        this.bounds = bounds;
    }

    update() {
        this.position.add(this.velocity);

        // 🔹 Bounce off walls and keep moving
        if (this.position.x <= this.bounds.min.x || this.position.x >= this.bounds.max.x) {
            this.velocity.x *= -1;
        }
        if (this.position.y <= this.bounds.min.y || this.position.y >= this.bounds.max.y) {
            this.velocity.y *= -1;
        }
        if (this.position.z <= this.bounds.min.z || this.position.z >= this.bounds.max.z) {
            this.velocity.z *= -1;
        }
    }
}

interface AirParticlesProps {
    width?: number;
    height?: number;
    length?: number;
    particleCount?: number;
    position?: [number, number, number];
}

const AirParticles: React.FC<AirParticlesProps> = ({
    width = 8,
    height = 27.5,
    length = 10,
    particleCount = 50,
    position = [0, 0, 0],
}) => {
    const particlesRef = useRef<AirParticle[]>([]);
    const [tick, setTick] = useState(0);

    const boxPosition = useMemo(() => new THREE.Vector3(...position), [position]);

    const bounds = useMemo(
        () =>
            new THREE.Box3(
                new THREE.Vector3(-width / 2, -height / 2, -length / 2).add(boxPosition),
                new THREE.Vector3(width / 2, height / 2, length / 2).add(boxPosition)
            ),
        [width, height, length, boxPosition]
    );

    // Initialize particles only once
    useEffect(() => {
        particlesRef.current = Array.from({ length: particleCount }, () => new AirParticle(bounds));
    }, [particleCount, bounds]);

    useFrame(() => {
        particlesRef.current.forEach((particle) => particle.update());
        setTick((t) => t + 1); // 🔹 Force re-render to reflect updates
    });

    const sphereGeometry = useMemo(() => new THREE.SphereGeometry(0.15, 16, 16), []); // 🔹 Smaller size
    const sphereMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#8B0000" }), []); // 🔹 Dark red

    return (
        <group>
            {particlesRef.current.map((particle, i) => (
                <mesh key={i} position={particle.position.toArray()} geometry={sphereGeometry} material={sphereMaterial} />
            ))}
        </group>
    );
};

export default AirParticles;
