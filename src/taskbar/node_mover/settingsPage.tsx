import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import FrankHertzBox from "../lab_nodes/frank_hertz_main";
import Variac from "../lab_nodes/variac";
import VVR from "../lab_nodes/vvr";
import Electrometer from "../lab_nodes/eletrometer";
import Triple_Output_supply from "../lab_nodes/triple_output_supply";
import CurrentRegulator from "../lab_nodes/currentRegulator";
import OscilloscopeBox from "../lab_nodes/osciliscope";
import FloppyDisk from "../lab_nodes/floppydisk";

import { useNodePosition } from "./hook_position";
import { useDnD } from "./DnDContext";
import "./dnd.css";  // your existing drag&drop styles
import "./wheelMenu.css"; // we'll add new styles for the wheel & popup
import { useNodeEdge } from './node_edge_context';

interface NodeData {
  id: string;
  type: string;
}

interface EdgeData {
  source: string;
  target: string;
  inputName: string;
}


interface SettingsPageProps {}

// The initial edges array
const initialEdges: any[] = [];
const initialNodes: any[] = [];

// Node Types for ReactFlow
const nodeTypes = {
  FrankHertzBox,
  Variac,
  VVR,
  Electrometer,
  Triple_Output_supply,
  CurrentRegulator,
  OscilloscopeBox,
  FloppyDisk,
};

const SettingsPage: React.FC<SettingsPageProps> = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { updateNodePosition, updateNodeType } = useNodePosition();
  const { screenToFlowPosition } = useReactFlow();
  const { nodes_processing, edges_processing, storeInNodesStorage, storeInEdgesStorage } = useNodeEdge();


  // This ref will store the current node type being dragged
  const type = useRef<string>("");

  // For debouncing node position updates
  const debounceTimersRef = useRef<{ [nodeId: string]: ReturnType<typeof setTimeout> }>({});

  const id = useRef<number>(0)
  const getId = () => `dndnode_${id.current++}`;

  const onNodeDelete = useCallback((nodeId: string) => {
    console.log("Node deleted, ID:", nodeId);
    // Just a stub right now
    // You can do anything else you need here, e.g., removing from local storage, etc.
  }, []);

  const handleNodesChange = useCallback(
    (changes: any[]) => {
      changes.forEach((change) => {
        if (change.type === "position") {
          // Clear any existing timer for this node
          if (debounceTimersRef.current[change.id]) {
            clearTimeout(debounceTimersRef.current[change.id]);
          }
          // Set a new timer: update only after the node hasn't moved for 100ms
          debounceTimersRef.current[change.id] = setTimeout(() => {
            console.log(
              "Node position updated on drag end:",
              change.id,
              change.position
            );

            // Update node position in your custom hook or store
            updateNodePosition(change.id, change.position);

            // Also update node type if desired
            const node = nodes.find((n) => n.id === change.id);
            if (!node) {
              console.warn(`Node with ID ${change.id} not found!`);
              return;
            }
            updateNodeType(change.id, node.type);

            // Remove the timer once fired
            delete debounceTimersRef.current[change.id];
          }, 100);
        }
        if (change.type === "remove") {
          console.log("Node removed, ID:", change.id);

        }
      });

      // Call the underlying reactflow onNodesChange
      onNodesChange(changes);

      // Update local state with new node positions
      setNodes((nds) =>
        nds.map((node) => {
          const change = changes.find((c) => c.id === node.id);
          return change && change.position
            ? { ...node, position: { ...change.position } }
            : node;
        })
      );
    },
    [setNodes, updateNodePosition, onNodesChange, nodes, updateNodeType]
  );
  
  const onConnect = useCallback(
    (params: any) => {
      console.log("New connection detected:", params);
  
      setEdges((eds) => {
        const newEdges = addEdge(params, eds);
        console.log("Edges after connecting:", newEdges);
  
        // Extract the handle ID (inputName) from the connection
        const newEdge: EdgeData = {
          source: params.source,
          target: params.target,
          inputName: params.sourceHandle, 
        };
  
        console.log("Storing Edge:", newEdge);
  
        storeInEdgesStorage(newEdge);
  
        return newEdges;
      });
    },
    [setEdges, storeInEdgesStorage]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      console.log("Dropping node with type:", type.current);
      // If no type is set, warn and stop
      if (!type.current) {
        console.error("No node type found in DnD context.");
        return;
      }

      const OFFSET_X = 80;
      const OFFSET_Y = 80;

      const position = screenToFlowPosition({
        x: event.clientX - OFFSET_X,
        y: event.clientY - OFFSET_Y,
      });

      const newNodeId = getId();
      updateNodePosition(newNodeId, position);
      updateNodeType(newNodeId, type.current);
      
      const newNodeStore: NodeData = {
        id: newNodeId,
        type: type.current, // Store the type
      };

      storeInNodesStorage(newNodeStore);

      // Then create the node with this adjusted position
      const newNode = {
        id: newNodeId,
        position,
        data: {},
        type: type.current,
      };

      setNodes((prevNodes) => [...prevNodes, newNode]);
      console.log("New node added:", newNode);
    },
    [screenToFlowPosition, setNodes, updateNodePosition, updateNodeType, storeInNodesStorage]
  );

  // ----- WHEEL MENU STATES & LOGIC -----
  const [wheelMenu, setWheelMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [searchOpen, setSearchOpen] = useState<{ visible: boolean; x: number; y: number }>({
    visible: false,
    x: 0,
    y: 0,
  });
  // right-click handler to show the wheel
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // prevent the default browser menu
      setWheelMenu({ visible: true, x: e.clientX, y: e.clientY - 50 });
      setSearchOpen((prev) => ({ ...prev, visible: false })); 
    },
    []
  );

  // hide the wheel menu if user clicks anywhere else
  const handleClickOutsideWheel = useCallback(() => {
    if (wheelMenu.visible) {
      setWheelMenu((prev) => ({ ...prev, visible: false }));
    }
  }, [wheelMenu.visible]);

  // wheel menu button click
  const handleWheelOptionClick = (option: string, e: React.MouseEvent) => {
    if (option === "search") {
      setSearchOpen({ visible: true, x: e.clientX, y: e.clientY - 95 });
    }
    if (option === "last1") {
      console.log("Clicked last used component #1 ...");
    }
    if (option === "last2") {
      console.log("Clicked last used component #2 ...");
    }

    // close the wheel menu after a selection
    setWheelMenu((prev) => ({ ...prev, visible: false }));
  };

  // close search menu if user clicks outside or selects something
  const handleCloseSearchMenu = () => {
    setSearchOpen((prev) => ({ ...prev, visible: false }));
  };

  // ----- NODES TO DRAG in the search menu -----
  const nodeList = [
    "FrankHertzBox",
    "Variac",
    "VVR",
    "Electrometer",
    "Triple_Output_supply",
    "CurrentRegulator",
    'OscilloscopeBox',
    "FloppyDisk",
  ];

  // When user starts dragging from the search menu, set the ref
  const onDragStartItem = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    type.current = nodeType;
  };

  const flowWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={flowWrapperRef}
      onContextMenu={handleContextMenu}
      onClick={handleClickOutsideWheel}
      style={{
        width: "100%",
        maxWidth: "2048px",
        height: "90vh",
        maxHeight: "1536px",
        margin: "0 auto",
        position: "relative", // needed for absolute-positioning the wheel
        overflow: "hidden",
      }}
    >
      {/* ReactFlow Container */}
      <ReactFlow
        translateExtent={[
          [0, 0],
          [2048, 1536],
        ]}
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        
        // optional: limit user interactions
        zoomOnScroll={false}
        fitView={false}
        zoomOnPinch={false}
        panOnDrag={true}
        panOnScroll={false}
        zoomOnDoubleClick={false}
        autoPanOnNodeDrag={false}
        autoPanOnConnect={false}

        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Controls />
        <Background />
      </ReactFlow>

      {/* ==================== WHEEL MENU ==================== */}
      {wheelMenu.visible && (
        <div
          className="wheel-menu"
          style={{ top: wheelMenu.y, left: wheelMenu.x }}
        >
          <button className="option1" onClick={(e) => handleWheelOptionClick("search", e)}>
            Search
          </button>
          <button className="option2" onClick={(e) => handleWheelOptionClick("last1", e)}>
            Electrometer
          </button>
          <button className="option3" onClick={(e) => handleWheelOptionClick("last2", e)}>
            VVM
          </button>
        </div>
      )}

      {/* ================= SEARCH MENU (Rectangular) ================= */}
      {searchOpen.visible && (
        <div
          className="search-menu"
          onClick={(e) => e.stopPropagation()} 
          style={{ top: searchOpen.y, left: searchOpen.x }}
        >
          <div className="search-menu-header">
            <h4 style={{ margin: 0 }}>Search/Select Node</h4>
            <button
              onClick={handleCloseSearchMenu}
              style={{ marginLeft: "auto" }}
            >
              X
            </button>
          </div>
          <div className="search-menu-list">
            {nodeList.map((nodeType) => (
              <div
                key={nodeType}
                className="search-item"
                draggable
                onDragStart={(e) => onDragStartItem(e, nodeType)}
              >
                {nodeType.replace(/_/g, " ")}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
