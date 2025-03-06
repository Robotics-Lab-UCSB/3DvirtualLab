import React from "react";
import { Handle, Position } from "@xyflow/react";

const VVR = ({ data }: any) => {
  return (
    <div
      style={{
        width: "100px",
        height: "180px",
        borderRadius: "12px",
        border: "2px solid black",
        background: "linear-gradient(135deg, #fffbe6, #fef9c3)", // Light modern yellow shade
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
        position: "relative",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      VVR
      {/* Single Input Handle */}
      <span
        style={{
          position: "absolute",
          left: "-50px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "12px",
          color: "#000",
        }}
      >
        Voltage
      </span>
      <Handle
        type="target"
        position={Position.Left}
        id="input-voltage"
        style={{ top: "50%", backgroundColor: "#000" }}
      />
    </div>
  );
};

export default VVR;

