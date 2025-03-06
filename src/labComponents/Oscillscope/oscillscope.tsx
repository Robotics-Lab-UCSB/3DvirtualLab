import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import * as THREE from "three";
import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import ButtonCircleAndTriangle from "../Buttons/circleAndTriangleButton";
import { useInstruments } from "../../contexts/instrument_value";

interface FrankHertzMainProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  unique_id: string;
  scale?: [number, number, number];
}

const Oscilloscope: React.FC<FrankHertzMainProps> = ({
  position,
  rotation = [Math.PI / 2, 0, 0],
  unique_id,
  scale = [0.5, 0.5, 0.5],
}) => {
  const gltf = useLoader(GLTFLoader, "/osc/osclliscope2.glb");
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const graphRef = useRef<THREE.Mesh>(null);
  const { registerInstrument, readInstrument, updateInstrumentSafe } = useInstruments();

  // State for graph transformations
  const [zoom, setZoom] = useState(1); // Zoom level
  const [offsetX, setOffsetX] = useState(0); // Move X
  const [offsetY, setOffsetY] = useState(0); // Move Y

  // State for data points and currently displayed points
  const [allDataPoints, setAllDataPoints] = useState<Array<{
    "Voltage (V)": number;
    "Current (A)": number;
  }>>([]);
  const [displayedPoints, setDisplayedPoints] = useState<{x: number, y: number}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    registerInstrument(unique_id, {
      simulation_number: "none",
    });
  }, [])

  // Fetch data from JSON
  useEffect(() => {
    fetch("/data_generated.json")
      .then((res) => res.json())
      .then((data) => {
        setAllDataPoints(data);
      })
      .catch((err) => console.error("Failed to load data:", err));
  }, []);

  // Convert voltage/current to graph coordinates
  const convertDataPoint = useCallback((point: {
    "Voltage (V)": number;
    "Current (A)": number;
  }) => {
    // Map voltage from 1-100 to -80 to 80 on X axis
    const x = (point["Voltage (V)"] - 50) * 1.6;
    // Map current from 0-1 to -30 to 30 on Y axis
    const y = (point["Current (A)"] - 0.5) * 60;
    return { x, y };
  }, []);

  // Add a point every second when running
  useEffect(() => {
    if (!isRunning || allDataPoints.length === 0) return;

    const interval = setInterval(() => {
      if (currentIndex < allDataPoints.length) {
        const newPoint = convertDataPoint(allDataPoints[currentIndex]);
        setDisplayedPoints((prev) => [...prev, newPoint]);
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Stop when we reach the end
        setIsRunning(false);
      }
    }, 1000); // Sample every second

    return () => clearInterval(interval);
  }, [isRunning, currentIndex, allDataPoints, convertDataPoint]);

  useEffect(() => {
    if (gltf.scene) {
      const clonedScene = gltf.scene.clone();
      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.userData.unique_id = unique_id;
          mesh.userData.type = "oscilloscope";
        }
      });
      setModel(clonedScene);
    }
  }, [gltf, unique_id]);

  // Function to regenerate the graph texture with transformations
  const graphTexture = useMemo(() => {
    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, size, size);

    // Draw fine grid (20 divisions)
    ctx.strokeStyle = "rgba(50, 50, 50, 0.8)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= size; i += size / 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }

    // Draw main grid (5 divisions)
    ctx.strokeStyle = "rgba(100, 100, 100, 0.9)";
    ctx.lineWidth = 2;
    for (let i = 0; i <= size; i += size / 5) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = "rgba(200, 200, 200, 1)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, size / 2 + 200);
    ctx.lineTo(size, size / 2 + 200);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.stroke();

    // Draw data points
    if (displayedPoints.length > 1) {
      // Draw connecting line
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 3;
      ctx.beginPath();

      const firstPoint = displayedPoints[0];
      const startX = size / 2 + (firstPoint.x + offsetX) * (size / 200) * zoom;
      const startY = size / 2 - (firstPoint.y + offsetY) * (size / 200) * zoom;

      ctx.moveTo(startX, startY);

      for (let i = 1; i < displayedPoints.length; i++) {
        const { x, y } = displayedPoints[i];
        const canvasX = size / 2 + (x + offsetX) * (size / 200) * zoom;
        const canvasY = size / 2 - (y + offsetY) * (size / 200) * zoom;
        ctx.lineTo(canvasX, canvasY);
      }
      ctx.stroke();
    }

    // Draw points
    ctx.fillStyle = "#00ff00";
    displayedPoints.forEach(({ x, y }) => {
      const canvasX = size / 2 + (x + offsetX) * (size / 200) * zoom;
      const canvasY = size / 2 - (y + offsetY) * (size / 200) * zoom;

      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 4 * zoom, 0, Math.PI * 2);
      ctx.fill();
    });

    // Add labels
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Voltage-Current Graph", 50, 60);

    // Add axis labels
    ctx.font = "30px Arial";
    ctx.fillText("Current (A)", size - 200, size / 2 + 180);
    ctx.save();
    ctx.translate(size / 2 - 70, 50);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Voltage (V)", -110, 50);
    ctx.restore();

    // Add data point count and status
    ctx.fillStyle = "yellow";
    ctx.font = "30px Arial";
    ctx.fillText(`Points: ${displayedPoints.length}/${allDataPoints.length}`, 50, size - 60);
    ctx.fillText(`Status: ${isRunning ? "RUNNING" : "STOPPED"}`, 50, size - 20);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [displayedPoints, zoom, offsetX, offsetY, allDataPoints.length, isRunning]);

  // --- INTERACTIVE FUNCTIONS FOR GRAPH ---
  const zoomOut = () => {
    const simNumber = readInstrument(unique_id, "simulation_number");
    if (simNumber === "accelerating_voltage") {
      fetch("/data_generated.json")
        .then((res) => res.json())
        .then((data) => {
          setAllDataPoints(data);
        })
        .catch((err) => console.error("Failed to load data:", err));
    } else if (simNumber === "retarding_voltage") {
      fetch("/vcd.json")
        .then((res) => res.json())
        .then((data) => {
          setAllDataPoints(data);
        })
        .catch((err) => console.error("Failed to load data:", err));
    } else if (simNumber === "filament_voltage") {
      fetch("/flat_line.json")
        .then((res) => res.json())
        .then((data) => {
          setAllDataPoints(data);
        })
        .catch((err) => console.error("Failed to load data:", err));
    } else if (simNumber === "none") {
      fetch("/o.json")
      .then((res) => res.json())
      .then((data) => {
        setAllDataPoints(data);
      })
      .catch((err) => console.error("Failed to load data:", err));
    }
    setZoom((prev) => Math.max(0.5, prev * 0.9));
  };

  const zoomIn = () => setZoom((prev) => Math.min(3, prev * 1.1));
  const moveLeft = () => setOffsetX((prev) => prev - 5);
  const moveRight = () => setOffsetX((prev) => prev + 5);
  const moveUp = () => setOffsetY((prev) => prev + 5);
  const moveDown = () => setOffsetY((prev) => prev - 5);

  // Start/stop data collection
  const toggleDataCollection = () => {
    setIsRunning(!isRunning);
  };

  // Reset the graph
  const resetGraph = () => {
    setDisplayedPoints([]);
    setCurrentIndex(0);
    setIsRunning(false);
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  // --- BUTTON CONFIGURATIONS FOR INTERACTIONS ---
  const buttonConfigs: { type: string; position: [number, number, number]; handleIntersect: () => void }[] = [
    { type: "zoomIn", position: [10.3, 5.5, 9.5], handleIntersect: zoomIn },
    { type: "zoomOut", position: [16.72, 5.5, 9.5], handleIntersect: zoomOut },
    { type: "moveLeft", position: [23.14, 5.5, 9.5], handleIntersect: moveLeft },
    { type: "moveRight", position: [29.56, 5.5, 9.5], handleIntersect: moveRight },
    { type: "moveUp", position: [35.98, 5.5, 9.5], handleIntersect: moveUp },
    { type: "moveDown", position: [42.4, 5.5, 9.5], handleIntersect: moveDown },
    { type: "startStop", position: [48.82, 5.5, 9.5], handleIntersect: toggleDataCollection },
    { type: "reset", position: [55.24, 5.5, 9.5], handleIntersect: resetGraph },
  ];

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {model && <primitive object={model} />}

      {/* Graph Mesh with updated texture */}
      <mesh ref={graphRef} position={[30, 28, 0.5]} scale={[8.5, 9, 1]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial map={graphTexture} transparent />
      </mesh>

      {/* Render interactive buttons */}
      {buttonConfigs.map((config, index) => (
        <ButtonCircleAndTriangle
          key={`button-${index}`}
          position={config.position}
          rotation={[Math.PI / 2, (3 * Math.PI) / 2, 0]}
          scale={[0.22, 0.1, 0.22]}
          unique_id={`button-${config.type}-${index}`}
          typeGen={config.type}
          handleIntersect={config.handleIntersect}
        />
      ))}
    </group>
  );
};

export default Oscilloscope;