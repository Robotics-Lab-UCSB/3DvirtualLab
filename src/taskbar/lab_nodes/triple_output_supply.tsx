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

        <span style={{ position: "absolute", right: "-50px", top: "10%", fontSize: "12px" }}>Output 1</span>
        <Handle type="source" position={Position.Right} id="output-1" style={{ top: "10%" }} />

        <span style={{ position: "absolute", right: "-50px", top: "35%", fontSize: "12px" }}>Output 2</span>
        <Handle type="source" position={Position.Right} id="output-2" style={{ top: "35%" }} />

        <span style={{ position: "absolute", right: "-50px", top: "65%", fontSize: "12px" }}>Output 3</span>
        <Handle type="source" position={Position.Right} id="output-3" style={{ top: "65%" }} />

        <span style={{ position: "absolute", right: "-50px", top: "90%", fontSize: "12px" }}>Output 4</span>
        <Handle type="source" position={Position.Right} id="output-4" style={{ top: "90%" }} />
    </div>
  );
};

export default Triple_Output_supply;
