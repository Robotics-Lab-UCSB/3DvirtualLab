import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of our context
interface NodeData {
  id: string;
  type: string; // Store type information
  x: number;
  y: number;
  z: number;
}

interface NodePositionContextType {
  nodePositions: Record<string, NodeData>;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  updateNodeZ: (id: string, z: number) => void;
  updateNodeType: (id: string, type: string) => void;
}

// Create context with a default value
const NodePositionContext = createContext<NodePositionContextType | undefined>(undefined);

// Context Provider Component
export const NodePositionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nodePositions, setNodePositions] = useState<Record<string, NodeData>>({});

  // Function to update node's x, y position
  const updateNodePosition = (id: string, position: { x: number; y: number }) => {
    setNodePositions((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || { id, type: "", z: 0 }), ...position }, // Keep type and z unchanged
    }));
    console.log(`Updated Node - ID: ${id}, Position:`, position);
  };

  // Function to update node's z position
  const updateNodeZ = (id: string, z: number) => {
    setNodePositions((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || { id, type: "", x: 0, y: 0 }), z }, // Keep type, x, and y unchanged
    }));
    console.log(`Updated Node - ID: ${id}, Z Position: ${z}`);
  };

  // Function to update node's type
  const updateNodeType = (id: string, type: string) => {
    setNodePositions((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || { id, x: 0, y: 0, z: 0 }), type }, // Keep x, y, and z unchanged
    }));
    console.log(`Updated Node - ID: ${id}, Type: ${type}`);
  };

  return (
    <NodePositionContext.Provider value={{ nodePositions, updateNodePosition, updateNodeZ, updateNodeType }}>
      {children}
    </NodePositionContext.Provider>
  );
};

// Hook to use node position context
export const useNodePosition = () => {
  const context = useContext(NodePositionContext);
  if (!context) {
    throw new Error("useNodePosition must be used within a NodePositionProvider");
  }
  return context;
};
