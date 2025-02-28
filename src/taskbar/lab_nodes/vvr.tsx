import React from "react";
import { Handle, Position } from "@xyflow/react";

const VVR = ({ data }: any) => {
  return (
    <div
      style={{
        width: "200px", // Rectangle width
        height: "100px", // Rectangle height
        borderRadius: "12px", // Slight rounding for modern look
        border: "2px solid black", // Subtle outer border
        background: "linear-gradient(135deg, #fffbe6, #fef9c3)", // Light modern yellow shade
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
        position: "relative",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)", // Light modern shadow
      }}
    >
      VVR

      {/* Input Handles (Left Side) with Labels */}
      <span style={{ position: "absolute", left: "0px", top: "30%", fontSize: "12px", transform: "translateX(-120%)" }}>
        Input 1
      </span>
      <Handle type="target" position={Position.Left} id="input-1" style={{ top: "30%" }} />

      <span style={{ position: "absolute", left: "0px", top: "70%", fontSize: "12px", transform: "translateX(-120%)" }}>
        Input 2
      </span>
      <Handle type="target" position={Position.Left} id="input-2" style={{ top: "70%" }} />
    </div>
  );
};

export default VVR;
