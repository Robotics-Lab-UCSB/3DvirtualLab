import React from "react";
import { Handle, Position } from "@xyflow/react";

const Electrometer = ({ data }: any) => {
  return (
    <div
      style={{
        width: "300px",
        height: "200px",
        borderRadius: "8px",
        border: "2px solid black",
        background: "linear-gradient(135deg, #d4d4d4, #ffffff, #c0c0c0)", // Chrome-like gradient
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
        position: "relative",
        boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      Electrometer

      {/* Input Handle (Left Side) */}
      <span style={{ position: "absolute", left: "-120px", top: "50%", fontSize: "12px", color: "#FF69B4" }}>
        Electrons Collected
      </span>
      <Handle 
        type="target" 
        position={Position.Left} 
        id="input-electrons" 
        style={{ top: "50%", backgroundColor: "#FF69B4" }} 
      />

      {/* Output Handle (Right Side) */}
      <span style={{ position: "absolute", right: "-100px", top: "50%", fontSize: "12px", color: "#4CAF50" }}>
        Measured Charge
      </span>
      <Handle 
        type="source" 
        position={Position.Right} 
        id="output-charge" 
        style={{ top: "50%", backgroundColor: "#4CAF50" }} 
      />
    </div>
  );
};

export default Electrometer;