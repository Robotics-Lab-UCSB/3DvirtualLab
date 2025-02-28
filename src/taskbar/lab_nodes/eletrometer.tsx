import React from "react";
import { Handle, Position } from "@xyflow/react";

const Electrometer = ({ data }: any) => {
  return (
    <div
      style={{
        width: "300px", // Rectangle width
        height: "200px", // Rectangle height
        borderRadius: "8px", // Slight rounding for modern look
        border: "2px solid black", // Subtle outer border
        background: "linear-gradient(135deg, #d4d4d4, #ffffff, #c0c0c0)", // Chrome-like gradient
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
        position: "relative",
        boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.2)", // Soft shadow for depth
      }}
    >
      Eletrometer

      {/* Input Handles (Left Side) */}
      <span style={{ position: "absolute", left: "-40px", top: "10%", fontSize: "12px" }}>Input 1</span>
      <Handle type="target" position={Position.Left} id="input-1" style={{ top: "10%" }} />

      <span style={{ position: "absolute", left: "-40px", top: "35%", fontSize: "12px" }}>Input 2</span>
      <Handle type="target" position={Position.Left} id="input-2" style={{ top: "35%" }} />

      <span style={{ position: "absolute", left: "-40px", top: "65%", fontSize: "12px" }}>Input 3</span>
      <Handle type="target" position={Position.Left} id="input-3" style={{ top: "65%" }} />

      <span style={{ position: "absolute", left: "-40px", top: "90%", fontSize: "12px" }}>Input 4</span>
      <Handle type="target" position={Position.Left} id="input-4" style={{ top: "90%" }} />
    </div>
  );
};

export default Electrometer;
