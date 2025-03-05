import React from "react";
import { Handle, Position } from "@xyflow/react";

const Triple_Output_supply = ({ data }: any) => {
  return (
    <div
      style={{
        width: "300px", // Rectangle width
        height: "200px", // Rectangle height
        borderRadius: "8px", // Slight rounding for modern look
        border: "2px solid black", // Subtle outer border
        background: "#f2f2f2", // Super light gray color (no gradient)
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#333", // Dark gray text for contrast
        position: "relative",
        boxShadow: "6px 6px 16px rgba(0, 0, 0, 0.2)", // Softer shadow for depth
      }}
    >
      Triple Output Power Supply

      <span style={{ position: "absolute", right: "-50px", top: "30%", fontSize: "12px", color: "red" }}>Output +</span>
      <Handle type="source" position={Position.Right} id="output-positive" style={{ top: "30%", backgroundColor: "red" }} />

      <span style={{ position: "absolute", right: "-50px", top: "70%", fontSize: "12px", color: "black" }}>Output -</span>
      <Handle type="source" position={Position.Right} id="output-negative" style={{ top: "70%", backgroundColor: "black" }} />

    </div>
  );
};

export default Triple_Output_supply;
