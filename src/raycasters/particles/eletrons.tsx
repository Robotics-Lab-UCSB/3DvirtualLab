import React, { useState, useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

class Particle {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    bounds: THREE.Box3;

    constructor(bounds: THREE.Box3, boxPosition: THREE.Vector3) {
        this.position = new THREE.Vector3(
            boxPosition.x,
            boxPosition.y - 10, // Start at the bottom
            boxPosition.z
        );

        // 🔹 Generate velocity within a 95-degree upward cone
        const angle = (Math.random() * 95 - 47.5) * (Math.PI / 180);
        const phi = Math.random() * Math.PI * 2;

        const speed = Math.random() * 0.1 + 0.02; // 🔹 Reduced speed (was 0.5, now 0.02 - 0.1)

        this.velocity = new THREE.Vector3(
            speed * Math.sin(angle) * Math.cos(phi),
            speed * Math.cos(angle),
            speed * Math.sin(angle) * Math.sin(phi)
        );

        this.bounds = bounds;
    }

    update() {
        this.position.add(this.velocity);

        // Collision detection and response
        if (this.position.x <= this.bounds.min.x || this.position.x >= this.bounds.max.x) {
            this.velocity.x *= -1;
        }
        if (this.position.y <= this.bounds.min.y || this.position.y >= this.bounds.max.y) {
            this.velocity.y *= -1;
        }
        if (this.position.z <= this.bounds.min.z || this.position.z >= this.bounds.max.z) {
            this.velocity.z *= -1;
        }

        this.position.clamp(this.bounds.min, this.bounds.max);
    }
}

interface ElectronsProps {
    width?: number;
    height?: number;
    length?: number;
    particleCount?: number;
    position?: [number, number, number]; // Box position
    spawnInterval?: number; // Time in ms between each particle spawn
}

const Electrons: React.FC<ElectronsProps> = ({
    width = 8,
    height = 27.5,
    length = 10,
    particleCount = 50,
    position = [0, 0, 0],
    spawnInterval = 500, // 🔹 Default: Spawn one electron every 500ms
}) => {
    const particlesRef = useRef<Particle[]>([]);
    const [tick, setTick] = useState(0);
    const [spawnCount, setSpawnCount] = useState(0);

    const boxPosition = useMemo(() => new THREE.Vector3(...position), [position]);

    // Define the bounds dynamically based on width, height, length
    const bounds = useMemo(
        () =>
            new THREE.Box3(
                new THREE.Vector3(-width / 2, -height / 2, -length / 2).add(boxPosition),
                new THREE.Vector3(width / 2, height / 2, length / 2).add(boxPosition)
            ),
        [width, height, length, boxPosition]
    );

    useEffect(() => {
        // 🔹 Interval to add particles one at a time
        const interval = setInterval(() => {
            if (spawnCount < particleCount) {
                particlesRef.current.push(new Particle(bounds, boxPosition));
                setSpawnCount((count) => count + 1);
            } else {
                clearInterval(interval); // Stop spawning once limit is reached
            }
        }, spawnInterval);

        return () => clearInterval(interval);
    }, [particleCount, bounds, boxPosition, spawnInterval, spawnCount]);

    useFrame(() => {
        particlesRef.current.forEach((particle) => particle.update());
        setTick((t) => t + 1);
    });

    const sphereGeometry = useMemo(() => new THREE.SphereGeometry(0.2, 16, 16), []);
    const sphereMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "blue" }), []);
    const wireframeMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "white", wireframe: true }), []);

    return (
        <group>
            {/* Bounding Box */}
            {/* <mesh position={boxPosition.toArray()}>
                <boxGeometry args={[width, height, length]} />
                <meshBasicMaterial color="white" wireframe />
            </mesh> */}

            {/* Particles */}
            {particlesRef.current.map((particle, i) => (
                <mesh key={i} position={particle.position.toArray()} geometry={sphereGeometry} material={sphereMaterial} />
            ))}
        </group>
    );
};

export default Electrons;