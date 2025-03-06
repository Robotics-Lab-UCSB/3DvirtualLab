import React from "react";
import { Handle, Position } from "@xyflow/react";

const FloppyDisk = ({ data }: any) => {
  return (
    <div
      style={{
        width: "100px",
        height: "100px",
        borderRadius: "12px",
        border: "2px solid black",
        background: "#B0B0B0", // grey
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
        position: "relative",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      FloppyDisk
      {/* Input Handle */}
      <span
        style={{
          position: "absolute",
          left: "-70px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "12px",
          color: "#000",
        }}
      >
        Input data
      </span>
      <Handle
        type="target"
        position={Position.Left}
        id="input-data"
        style={{ top: "50%", backgroundColor: "#000" }}
      />

      {/* Output Handle */}
      <span
        style={{
          position: "absolute",
          right: "-80px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "12px",
          color: "#000",
        }}
      >
        Output data
      </span>
      <Handle
        type="source"
        position={Position.Right}
        id="output-data"
        style={{ top: "50%", backgroundColor: "#000" }}
      />
    </div>
  );
};

export default FloppyDisk;
