import React from "react";
import { Handle, Position} from "@xyflow/react";

const FrankHertzBox = ({ data }: any) => {
  return (
    <div
      style={{
        width: "200px", // Fixed big square size
        height: "200px",
        border: "3px solid black", // Outer border
        boxShadow: "inset 0 0 0 5px white, inset 0 0 0 8px black", // Double border effect
        background: "linear-gradient(135deg, #f4f4f4, #ffffff)", // Modern gradient
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
        borderRadius: "8px", // Slight rounding for modern look
      }}
    >   
        <span style={{ position: "absolute", left: "0px", top: "10%", fontSize: "12px", transform: "translateX(-120%)" }}>
        Heating
        </span>
        <Handle type="target" position={Position.Left} id="input-1" style={{ top: "10%" }} />

        <span style={{ position: "absolute", left: "0px", top: "30%", fontSize: "12px", transform: "translateX(-120%)" }}>
            H
        </span>
        <Handle type="target" position={Position.Left} id="input-2" style={{ top: "30%" }} />

        <span style={{ position: "absolute", left: "0px", top: "60%", fontSize: "12px", transform: "translateX(-120%)" }}>
            K
        </span>
        <Handle type="target" position={Position.Left} id="input-3" style={{ top: "60%" }} />

        <span style={{ position: "absolute", left: "0px", top: "90%", fontSize: "12px", transform: "translateX(-120%)" }}>
            A
        </span>
        <Handle type="target" position={Position.Left} id="input-4" style={{ top: "90%" }} />

        <Handle type="source" position={Position.Right} id="output-1" style={{ top: "25%" }} />
        <Handle type="source" position={Position.Right} id="output-2" style={{ top: "75%" }} />
      Frank-Hertz Box
    </div>
  );
};

export default FrankHertzBox;
