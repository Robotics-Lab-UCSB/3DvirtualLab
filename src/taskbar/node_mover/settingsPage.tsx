import React, { useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  ViewportPortal
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "../taskbar.css";
import { useRef } from "react";

import FrankHertzBox from "../lab_nodes/frank_hertz_main";
import Variac from "../lab_nodes/variac";
import VVR from "../lab_nodes/vvr";
import Electrometer from "../lab_nodes/eletrometer";
import Triple_Output_supply from "../lab_nodes/triple_output_supply";

import { useNodePosition } from "./hook_position";
interface SettingsPageProps {}

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: {}, type: "FrankHertzBox" },
  { id: "2", position: { x: 0, y: 100 }, data: {}, type: "Variac" },
  { id: "3", position: { x: 0, y: 250 }, data: {}, type: "VVR" },
  { id: "4", position: { x: 0, y: 350 }, data: {}, type: "Electrometer" },
  { id: "5", position: { x: 0, y: 450 }, data: {}, type: "Triple_Output_supply" },
];

const initialEdges: any[] = []; 

const nodeTypes = { FrankHertzBox: FrankHertzBox, 
                    Variac: Variac, VVR: VVR, Electrometer: Electrometer,
                    Triple_Output_supply: Triple_Output_supply };

const SettingsPage: React.FC<SettingsPageProps> = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { updateNodePosition, updateNodeType, updateNodeZ } = useNodePosition(); // Get functions from context

  const debounceTimersRef = useRef<{ [nodeId: string]: NodeJS.Timeout }>({});

  const handleNodesChange = useCallback(
    (changes: any) => {
      changes.forEach((change: any) => {
        if (change.type === "position") {
          // Clear any existing timer for this node
          if (debounceTimersRef.current[change.id]) {
            clearTimeout(debounceTimersRef.current[change.id]);
          }
          // Set a new timer: update only after the node hasn't moved for 100ms
          debounceTimersRef.current[change.id] = setTimeout(() => {
            console.log("Node position updated on drag end:", change.id, change.position);
            updateNodePosition(change.id, change.position);

            const node = nodes.find((n) => n.id === change.id); // ✅ Find node by ID
            if (!node) {
              console.warn(`Node with ID ${change.id} not found!`);
              return;
            }
            const nodeType = node.type;

            updateNodeType(change.id, nodeType); // TODO: this doesn't need to be called all the time 
            // Remove the timer once fired
            delete debounceTimersRef.current[change.id];
          }, 100); // Adjust the delay as needed
        }
      });
      
      // Handle any other changes immediately
      onNodesChange(changes); 
      
      // Update local state with the new positions
      setNodes((nds) =>
        nds.map((node) => {
          const change = changes.find((c: any) => c.id === node.id);
          return change && change.position
            ? { ...node, position: { ...change.position } } // Preserve z-value
            : node;
        })
      );
    },
    [setNodes, updateNodePosition, onNodesChange]
  );  

  const onConnect = useCallback(
    (params: any) => {
      console.log("New connection:", params);
  
      setEdges((eds) => {
        const newEdges = addEdge(params, eds);
        console.log("Edges after connecting:", newEdges);
        return newEdges;
      });
    },
    [setEdges]
  );

  return (
    <div style={{ width: "100%", maxWidth: "2048px", height: "90vh", maxHeight: "1536px", margin: "0 auto" }}>
      <ReactFlow
        translateExtent={[
          [0, 0],
          [2048, 1536]
        ]}
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        style={{ width: "100%", height: "100%" }}
        nodeTypes={nodeTypes}
        
        // Disable zooming and panning
        zoomOnScroll={false} 
        zoomOnPinch={false} 
        panOnDrag={false} 
        panOnScroll={false} 
        zoomOnDoubleClick={false} 
        preventScrolling={false} // Prevents ReactFlow from capturing scroll events
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default SettingsPage;