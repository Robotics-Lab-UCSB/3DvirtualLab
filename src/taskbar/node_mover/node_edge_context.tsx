import React, { createContext, useContext, useState, useMemo, useRef, useCallback } from "react";
import { useInstruments } from "../../contexts/instrument_value";
import { createDefaultState, stepSimulation } from "../../A_JS_Simulations/index (3).js";
import { useStableInterval } from "./stable_interval.js";
import FloppyDisk from "../lab_nodes/floppydisk.js";

interface NodeData {
  id: string;
  type: string;
}
interface EdgeData {
  source: string;
  target: string;
  inputName: string;
}

interface NodeEdgeContextType {
  nodes_processing: NodeData[];
  edges_processing: EdgeData[];
  storeInNodesStorage: (newNode: NodeData) => void;
  storeInEdgesStorage: (newEdge: EdgeData) => void;
  dependencyDict: Record<string, { node: NodeData; inputName: string }[]>;
}

const NodeEdgeContext = createContext<NodeEdgeContextType | undefined>(undefined);

export const NodeEdgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes_processing, setNodes] = useState<NodeData[]>([]);
  const [edges_processing, setEdges] = useState<EdgeData[]>([]);
  const [dependencyDict, setDependencyDict] = useState<Record<string, { node: NodeData; inputName: string }[]>>({});

  const stateRef = useRef(createDefaultState);
  const randomSeedRef = useRef(12345);

  // Grab instrument context
  const { readInstrument, updateInstrumentSafe } = useInstruments();

  const storeInNodesStorage = (newNode: NodeData) => {
    setNodes((prev) => {
      if (!prev.some((node) => node.id === newNode.id)) {
        return [...prev, newNode];
      }
      return prev;
    });
  };

  const storeInEdgesStorage = (newEdge: EdgeData) => {
    setEdges((prev) => {
      const alreadyExists = prev.some(
        (edge) => edge.source === newEdge.source && edge.target === newEdge.target
      );
      return alreadyExists ? prev : [...prev, newEdge];
    });
  };

  // Build "sortedNodes" (topological sort) + "dependencyDict"
  const sortedNodes = useMemo(() => {
    const inDegree: Record<string, number> = {};
    const adjacencyList: Record<string, string[]> = {};

    nodes_processing.forEach(({ id }) => {
      inDegree[id] = 0;
      adjacencyList[id] = [];
    });

    edges_processing.forEach(({ source, target }) => {
      adjacencyList[source].push(target);
      inDegree[target] = (inDegree[target] || 0) + 1;
    });

    const newDependencyDict: Record<string, { node: NodeData; inputName: string }[]> = {};
    nodes_processing.forEach(({ id }) => {
      newDependencyDict[id] = [];
    });

    edges_processing.forEach(({ source, target, inputName }) => {
      const sourceNode = nodes_processing.find((n) => n.id === source);
      if (sourceNode) {
        newDependencyDict[target].push({ node: sourceNode, inputName });
      }
    });

    setDependencyDict(newDependencyDict);

    const queue = Object.keys(inDegree).filter((node) => inDegree[node] === 0);
    const topologicalOrder: string[] = [];

    while (queue.length) {
      const node = queue.shift()!;
      topologicalOrder.push(node);
      adjacencyList[node].forEach((neighbor) => {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) queue.push(neighbor);
      });
    }

    return topologicalOrder.map((nodeId) =>
      nodes_processing.find((n) => n.id === nodeId) || { id: nodeId, type: "unknown" }
    );
  }, [nodes_processing, edges_processing]);

  // Define our simulation loop callback
  const runSimulation = useCallback(() => {
    // We'll do the loop body that used to happen in your setTimeout
    sortedNodes.forEach(({ id, type }) => {
      if (type === "Variac") {
        return;
      } else if (type === "FrankHertzBox") {
        (dependencyDict[id] || []).forEach(({ node, inputName }) => {
          const filament_voltage =
            node.type === "CurrentRegulator"
              ? readInstrument(node.id, "filament_voltage")
              : 10;
          const accelerating_voltage =
            node.type === "CurrentRegulator"
              ? readInstrument(node.id, "accelerating_voltage")
              : 1;

          // Reset state for each run
          // stateRef.current = createDefaultState;
          // randomSeedRef.current = 12345;

          stateRef.current.settings.filamentVoltage = filament_voltage;
          stateRef.current.settings.acceleratingVoltage = accelerating_voltage;
          stateRef.current.mercuryDensity = 1.0;

          const dataPoints = [];
          const voltageStart = accelerating_voltage;
          const voltageEnd = accelerating_voltage + 20;
          const steps = 200;
          const stepSize = (voltageEnd - voltageStart) / steps;

          for (let step = 0; step <= steps; step++) {
            const voltage = voltageStart + step * stepSize;

            stateRef.current.settings.acceleratingVoltage = voltage;

            const result = stepSimulation(stateRef.current)(randomSeedRef.current);

            stateRef.current = result.newState;
            randomSeedRef.current = result.randomSeed;

            dataPoints.push({
              acceleratingVoltage: voltage.toFixed(3),
              electronCount: stateRef.current.electrons.length,
              collectedCount: stateRef.current.collectedCount,
              currentReading: parseFloat(stateRef.current.currentReading.toFixed(8)),
              randomSeed: randomSeedRef.current,
            });
          }

          // For debugging, remove or limit logging in production
          console.table(dataPoints);

          const firstDataPoint = dataPoints[0];
          updateInstrumentSafe(id, "output_current", firstDataPoint.currentReading.toFixed(8));
        });
      } else if (type === "VVR") {
        (dependencyDict[id] || []).forEach(({ node, inputName }) => {
          const instrumentValue = readInstrument(node.id, inputName);
          updateInstrumentSafe(id, "read_voltage", instrumentValue);
        });
      } else if (type === "Electrometer") {
        (dependencyDict[id] || []).forEach(({ node, inputName }) => {
          const instrumentValue = readInstrument(node.id, "output_current");
          console.log("UPDATED INSTRUMENT VALUE", instrumentValue,id)
          updateInstrumentSafe(id, "read_current", instrumentValue);
        });
      } else if (type === "FloppyDisk") {
        (dependencyDict[id] || []).forEach(({ node, inputName }) => {
          console.log("THE INPUT NAME IS", inputName)
          updateInstrumentSafe(id, "remembered_output", inputName);
        });
      } else if (type === "OscilloscopeBox") {
        (dependencyDict[id] || []).forEach(({ node, inputName }) => {
          const simulation_number = readInstrument(node.id, "remembered_output");
          if (
            simulation_number === "filament_voltage" ||
            simulation_number === "retarding_voltage" ||
            simulation_number === "accelerating_voltage"
          ) {
            updateInstrumentSafe(id, "simulation_number", simulation_number);
          }
        });
      }
      
    });
  }, [sortedNodes, dependencyDict, readInstrument, updateInstrumentSafe]);

  // Run our simulation every 2s with a stable interval
  useStableInterval(runSimulation, 2000);

  return (
    <NodeEdgeContext.Provider
      value={{
        nodes_processing,
        edges_processing,
        storeInNodesStorage,
        storeInEdgesStorage,
        dependencyDict,
      }}
    >
      {children}
    </NodeEdgeContext.Provider>
  );
};

export const useNodeEdge = () => {
  const context = useContext(NodeEdgeContext);
  if (!context) {
    throw new Error("useNodeEdge must be used within a NodeEdgeProvider");
  }
  return context;
};
