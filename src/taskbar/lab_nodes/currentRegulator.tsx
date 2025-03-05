import React from "react";
import { Handle, Position } from "@xyflow/react";

const CurrentRegulator = ({ data }: any) => {
  return (
    <div
      style={{
        width: "300px",
        height: "200px",
        borderRadius: "12px",
        border: "2px solid #444",
        background: "linear-gradient(135deg, #222, #333, #1a1a1a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#ffffff",
        position: "relative",
        boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.4)",
      }}
    >
      Current Regulator

      {/* Input Handle (Left Side) */}
      {/* Input Handles (Left Side) */}
      <span style={{ position: "absolute", left: "-40px", top: "30%", fontSize: "12px", color: "#DC143C" }}>Input +</span>
      <Handle type="target" position={Position.Left} id="input-positive" style={{ top: "30%", background: "#DC143C" }} />

      <span style={{ position: "absolute", left: "-40px", top: "60%", fontSize: "12px", color: "#000000" }}>Input -</span>
      <Handle type="target" position={Position.Left} id="input-negative" style={{ top: "60%", background: "#000000" }} />

      {/* Output Handles (Right Side) */}
      <span style={{ position: "absolute", right: "-60px", top: "20%", fontSize: "12px", color: "#AAAAAA" }}>V Filament</span>
      <Handle type="source" position={Position.Right} id="filament_voltage" style={{ top: "20%", background: "#AAAAAA" }} />

      <span style={{ position: "absolute", right: "-60px", top: "50%", fontSize: "12px", color: "#FF851B" }}>V Retarding</span>
      <Handle type="source" position={Position.Right} id="retarding_voltage" style={{ top: "50%", background: "#FF851B" }} />

      <span style={{ position: "absolute", right: "-60px", top: "80%", fontSize: "12px", color: "#2ECC40" }}>V Accelerating</span>
      <Handle type="source" position={Position.Right} id="accelerating_voltage" style={{ top: "80%", background: "#2ECC40" }} />

    </div>
  );
};

export default CurrentRegulator;