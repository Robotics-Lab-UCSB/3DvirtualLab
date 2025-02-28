import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

class GasParticle {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    boundingBox: THREE.Box3;

    constructor(x: number, y: number, z: number, vx: number, vy: number, vz: number, width: number, height: number, length: number) {
        this.position = new THREE.Vector3(x, y, z);
        this.velocity = new THREE.Vector3(vx, vy, vz);
        this.boundingBox = new THREE.Box3(
            new THREE.Vector3(-width / 2, -height / 2, -length / 2),
            new THREE.Vector3(width / 2, height / 2, length / 2)
        );
    }

    update() {
        this.position.add(this.velocity);
        this.checkCollision();
    }

    checkCollision() {
        const { min, max } = this.boundingBox;

        if (this.position.x <= min.x || this.position.x >= max.x) {
            this.velocity.x *= -1;
        }
        if (this.position.y <= min.y || this.position.y >= max.y) {
            this.velocity.y *= -1;
        }
        if (this.position.z <= min.z || this.position.z >= max.z) {
            this.velocity.z *= -1;
        }

        this.position.clamp(min, max);
    }
}

interface GasSimulationProps {
    position?: [number, number, number] | THREE.Vector3;
    width?: number;
    height?: number;
    length?: number;
}

const GasSimulation: React.FC<GasSimulationProps> = ({ position = [0, 0, 0], width = 20, height = 20, length = 20 }) => {
    const particlesRef = useRef<GasParticle[]>([]);
    const [_, setTick] = useState(0); // Force re-render

    useEffect(() => {
        particlesRef.current = Array.from({ length: 100 }, () =>
            new GasParticle(
                (Math.random() - 0.5) * width,
                (Math.random() - 0.5) * height,
                (Math.random() - 0.5) * length,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                width,
                height,
                length
            )
        );
    }, [width, height, length]); // Recreate particles if box size changes

    useFrame(() => {
        particlesRef.current.forEach((particle) => {
            particle.update();
        });

        // Force re-render every frame
        setTick((t) => t + 1);
    });

    return (
        <group position={position instanceof THREE.Vector3 ? position.toArray() : position}>
            {particlesRef.current.map((particle, i) => (
                <mesh key={i} position={particle.position.toArray()}>
                    <sphereGeometry args={[0.12, 16, 16]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
            ))}

            {/* Bounding Box */}
            {/* <mesh>
                <boxGeometry args={[width, height, length]} />
                <meshBasicMaterial color="white" wireframe />
            </mesh> */}
        </group>
    );
};

export default GasSimulation;
