import React from "react";
import { Handle, Position } from "@xyflow/react";

const Variac = ({ data }: any) => {
  return (
    <div
      style={{
        width: "150px", // Circle diameter
        height: "150px",
        borderRadius: "50%", // Makes it a perfect circle
        border: "3px solid black", // Outer border
        boxShadow: "inset 0 0 0 5px white, inset 0 0 0 8px black", // Double border effect
        background: "linear-gradient(135deg, #e3f2fd,rgb(206, 222, 233))", // Very light blue gradient
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
        position: "relative",
      }}
    >
      Large Variac

      {/* Output Handle - Right Side */}
      <Handle
        type="source"
        position={Position.Right}
        id="output-1"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
    </div>
  );
};

export default Variac;
