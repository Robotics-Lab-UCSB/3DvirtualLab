import React, { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

class SpatialHashGrid {
    private grid: Map<string, GasParticle[]> = new Map();
    private cellSize: number;

    constructor(cellSize: number) {
        this.cellSize = cellSize;
    }

    private hashKey(x: number, y: number, z: number): string {
        return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)},${Math.floor(z / this.cellSize)}`;
    }

    addParticle(particle: GasParticle) {
        const key = this.hashKey(particle.position.x, particle.position.y, particle.position.z);
        if (!this.grid.has(key)) {
            this.grid.set(key, []);
        }
        this.grid.get(key)?.push(particle);
    }

    removeParticle(particle: GasParticle) {
        const key = this.hashKey(particle.position.x, particle.position.y, particle.position.z);
        if (this.grid.has(key)) {
            this.grid.set(
                key,
                this.grid.get(key)!.filter((p) => p !== particle) // Remove specific particle
            );
            if (this.grid.get(key)!.length === 0) {
                this.grid.delete(key); // Cleanup empty cells
            }
        }
    }

    getParticlesInCell(x: number, y: number, z: number): GasParticle[] {
        const key = this.hashKey(x, y, z);
        return this.grid.get(key) || [];
    }

    clear() {
        this.grid.clear();
    }
}

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

    update(spatialGrid: SpatialHashGrid) {
        this.position.add(this.velocity);
        this.checkCollision();
        spatialGrid.addParticle(this);
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

interface ElectronsProps {
    position?: [number, number, number] | THREE.Vector3;
    width?: number;
    height?: number;
    length?: number;
}

const Electrons: React.FC<ElectronsProps> = ({ position = [0, 0, 0], width = 20, height = 20, length = 20 }) => {
    const particlesRef = useRef<GasParticle[]>([]);
    const [_, setTick] = useState(0); // Force re-render
    const startingPosition = useMemo<[number, number, number]>(() => [
        position instanceof THREE.Vector3 ? position.x : position[0] + width / 2,
        position instanceof THREE.Vector3 ? position.y : position[1] + height / 2,
        position instanceof THREE.Vector3 ? position.z : position[2] + length / 2
    ], [position, width, height, length]);
    const spatialGridRef = useRef(new SpatialHashGrid(2));

    useEffect(() => {
        particlesRef.current = Array.from({ length: 20 }, () =>
            new GasParticle(
                startingPosition[0] - 10, // Centered X position
                startingPosition[1] - 80, // Centered Y position
                startingPosition[2], // Centered Z position
                (Math.random() - 0.5) * 0.2, // Random small X velocity
                Math.random() * 0.2 + 0.1,   // Small positive Y velocity
                (Math.random() - 0.5) * 0.2, // Random small Z velocity
                width,
                height,
                length
            )
        );
    }, [width, height, length]);
    

    useFrame(() => {
        spatialGridRef.current.clear();
        particlesRef.current.forEach((particle) => {
            particle.update(spatialGridRef.current);
        });
        setTick((t) => t + 1);
        if (particlesRef.current.length > 0) {
            const { x, y, z } = particlesRef.current[0].position;
            const nearbyParticles = spatialGridRef.current.getParticlesInCell(x, y, z);
        }
    });

    // 🔹 UseMemo to save resources by reusing geometry and material
    const sphereGeometry = useMemo(() => new THREE.SphereGeometry(0.12, 16, 16), []);
    const sphereMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "blue" }), []);
    const boxGeometry = useMemo(() => new THREE.BoxGeometry(2, 2, 2), []); // Each box is size 2
    const wireframeMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "white", wireframe: true }), []);

    return (
        <group position={position instanceof THREE.Vector3 ? position.toArray() : position}>
            {particlesRef.current.map((particle, i) => (
                <mesh key={i} position={particle.position.toArray()} geometry={sphereGeometry} material={sphereMaterial} />
            ))}
            {/* <mesh>
                <boxGeometry args={[width, height, length]} />
                <meshBasicMaterial color="white" wireframe />
            </mesh> */}
        </group>
    );
};

export default Electrons;
