import React from "react";
import { Handle, Position } from "@xyflow/react";

const FrankHertzBox = ({ data }: any) => {
  return (
    <div
      style={{
        width: "200px",
        height: "200px",
        border: "3px solid black",
        boxShadow: "inset 0 0 0 5px white, inset 0 0 0 8px black",
        background: "linear-gradient(135deg, #f4f4f4, #ffffff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
        borderRadius: "8px",
        position: "relative",
      }}
    >   
      {/* Temperature */}
      {/* Temperature */}
        <span style={{ position: "absolute", left: "0px", top: "10%", fontSize: "12px", transform: "translateX(-120%)", color: "#0074D9" }}>
          Temperature
        </span>
        <Handle type="target" position={Position.Left} id="input-1" style={{ top: "10%", backgroundColor: "#0074D9" }} />

        {/* Accelerating Voltage */}
        <span style={{ position: "absolute", left: "5px", top: "30%", fontSize: "12px", transform: "translateX(-120%)", color: "#2ECC40" }}>
          Accelerating V
        </span>
        <Handle type="target" position={Position.Left} id="input-2" style={{ top: "30%", backgroundColor: "#2ECC40" }} />

        {/* Retarding Voltage */}
        <span style={{ position: "absolute", left: "0px", top: "60%", fontSize: "12px", transform: "translateX(-120%)", color: "#FF851B" }}>
          Retarding V
        </span>
        <Handle type="target" position={Position.Left} id="input-3" style={{ top: "60%", backgroundColor: "#FF851B" }} />

        {/* Filament Voltage */}
        <span style={{ position: "absolute", left: "0px", top: "90%", fontSize: "12px", transform: "translateX(-120%)", color: "#AAAAAA" }}>
          Filament V
        </span>
        <Handle type="target" position={Position.Left} id="input-4" style={{ top: "90%", backgroundColor: "#AAAAAA" }} />


      {/* Single Output - Electrons Collected */}
      <span style={{ position: "absolute", right: "-120px", top: "50%", fontSize: "12px", color: "#FF69B4" }}>
        Electrons Collected
      </span>
      <Handle type="source" position={Position.Right} id="output-electrons" style={{ top: "50%", backgroundColor: "#FF69B4" }} />

      Frank-Hertz Box
    </div>
  );
};

export default FrankHertzBox;
