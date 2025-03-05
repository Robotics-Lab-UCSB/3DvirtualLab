import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from "react";
import { useInstruments } from '../../contexts/instrument_value';

// Define node and edge types
interface NodeData {
  id: string;
  type: string;
}

interface EdgeData {
  source: string;
  target: string;
  inputName: string; // Store the label (handle name) of the connection
}


// Define the context shape
interface NodeEdgeContextType {
  nodes_processing: NodeData[];
  edges_processing: EdgeData[];
  storeInNodesStorage: (node: NodeData) => void;
  storeInEdgesStorage: (edge: EdgeData) => void;
  dependencyDictRef: React.MutableRefObject<Record<string, NodeData[]>>;
}

// Create the context
const NodeEdgeContext = createContext<NodeEdgeContextType | undefined>(undefined);

// Provider Component
export const NodeEdgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for nodes and edges (ONLY stored in memory)
  const [nodes_processing, setNodes] = useState<NodeData[]>([]);
  const [edges_processing, setEdges] = useState<EdgeData[]>([]);

  // Dependency dictionary stored in a ref (now storing full `NodeData` objects)
  const dependencyDictRef = useRef<Record<string, { node: NodeData; inputName: string }[]>>({});
  
  const { registerInstrument, updateInstrument, readInstrument, instruments } = useInstruments();

  // Function to update nodes storage (only in memory)
  const storeInNodesStorage = (newNode: NodeData) => {
    setNodes((prevNodes) => {
      if (!prevNodes.some((node) => node.id === newNode.id)) {
        console.log("Adding Node:", newNode);
        return [...prevNodes, newNode];
      }
      return prevNodes;
    });
  };

  // Function to update edges storage (only in memory)
  const storeInEdgesStorage = (newEdge: EdgeData) => {
    setEdges((prevEdges) => {
      if (!prevEdges.some((edge) => edge.source === newEdge.source && edge.target === newEdge.target)) {
        console.log(`Adding Edge: ${newEdge.source} → ${newEdge.target}, Input Name: ${newEdge.inputName}`);
        return [...prevEdges, newEdge];
      }
      return prevEdges;
    });
  };  

  // Compute the topological sort using Kahn's Algorithm and build the dependency dictionary
  const sortedNodes = useMemo(() => {
    const inDegree: Record<string, number> = {};
    const adjacencyList: Record<string, string[]> = {};

    // Initialize in-degree count and adjacency list
    nodes_processing.forEach(({ id }) => {
      inDegree[id] = 0;
      adjacencyList[id] = [];
    });

    // Build graph (edges_processing defines dependencies)

    edges_processing.forEach(({ source, target, inputName }) => {
      adjacencyList[source].push(target);
      inDegree[target] = (inDegree[target] || 0) + 1;
      console.log(`Source Node: ${source}, Target Node: ${target}, Input Label: ${inputName}`);
    });

    // Build dependency dictionary (now storing `NodeData` instead of just IDs)
    const dependencyDict: Record<string, { node: NodeData; inputName: string }[]> = {};
    nodes_processing.forEach(({ id, type }) => {
      dependencyDict[id] = []; // Initialize empty list
    });

    edges_processing.forEach(({ source, target, inputName }) => {
      const sourceNode = nodes_processing.find((node) => node.id === source);
      if (sourceNode) {
        dependencyDict[target].push({
          node: sourceNode,  // ✅ Store full NodeData
          inputName: inputName, // ✅ Store the input handle name
        });
      }
    });

    // Store in ref
    dependencyDictRef.current = dependencyDict;

    // Kahn's Algorithm - Start with nodes having 0 in-degree
    const queue: string[] = Object.keys(inDegree).filter((node) => inDegree[node] === 0);
    const topologicalOrder: string[] = [];

    while (queue.length > 0) {
      const node = queue.shift()!;
      topologicalOrder.push(node);

      // Reduce in-degree of connected nodes
      adjacencyList[node].forEach((neighbor) => {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      });
    }

    // If not all nodes are processed, there's a cycle (not a DAG)
    if (topologicalOrder.length !== nodes_processing.length) {
      console.warn("Cycle detected in graph, topological order may be incorrect");
      return [];
    }

    // Return list of NodeData instead of just node IDs
    return topologicalOrder.map((nodeId) => {
      const node = nodes_processing.find((n) => n.id === nodeId);
      return node ? { id: node.id, type: node.type } : { id: nodeId, type: "unknown" };
    });
  }, [nodes_processing, edges_processing]); // Recompute only when nodes or edges change

  // Log results every 5 seconds
  useEffect(() => {
    let isRunning = true; // Control flag for the loop
  
    const loop = () => {
      if (!isRunning) return; // Stop the loop if the component is unmounted
  
      sortedNodes.forEach(({ id, type }) => {
        if (type === "Variac") {
          return; // Skip nodes without dependencies
        } else if (type === "FrankHertzBox") {  
          (dependencyDictRef.current[id] || []).forEach(({ node, inputName }) => {
            console.log(`Dependency Type: ${node.id}, Input Label: ${inputName}`);
  
            if (node.type === "Variac") {
              const instrumentValue = readInstrument(node.id, "temperature"); 
              console.log("Instrument Value:", instrumentValue);
            } else if (node.type === "CurrentRegulator") {
              const instrumentValue = readInstrument(node.id, "retarding_voltage"); 
              console.log("Instrument Value:", instrumentValue);
            }
          });
        } else if (type === "VVR") {
          (dependencyDictRef.current[id] || []).forEach(({ node, inputName }) => {
            console.log("THe node ID is", node.id)
            console.log("THE TYPE IS", node.type)
            console.log("THE INPUT IS: ", inputName)
            const instrumentValue = readInstrument(node.id, inputName); 
            updateInstrument(id, "read_voltage", instrumentValue)
            console.log("The read instrument value: ", instrumentValue)
          });
        }
      });
  
      setTimeout(loop, 2000);
    };
  
    loop(); // Start the loop
  
    return () => {
      isRunning = false; // Stop the loop when the component unmounts
    };
  }, [sortedNodes, instruments]); 
  
  return (
    <NodeEdgeContext.Provider value={{ nodes_processing, edges_processing, storeInNodesStorage, storeInEdgesStorage, dependencyDictRef }}>
      {children}
    </NodeEdgeContext.Provider>
  );
};

// Custom Hook to use the context
export const useNodeEdge = () => {
  const context = useContext(NodeEdgeContext);
  if (!context) {
    throw new Error("useNodeEdge must be used within a NodeEdgeProvider");
  }
  return context;
};
