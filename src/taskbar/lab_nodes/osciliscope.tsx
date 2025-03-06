import React from "react";
import { Handle, Position } from "@xyflow/react";

const OscilloscopeBox = ({ data }: any) => {
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
      {/* First Input Handle: Points Data */}
      <span 
        style={{ position: "absolute", left: "0px", top: "40%", fontSize: "12px", transform: "translateX(-120%)", color: "#0074D9" }}>
        Points Data
      </span>
      <Handle 
        type="target" 
        position={Position.Left} 
        id="input-points" 
        style={{ top: "40%", backgroundColor: "#0074D9" }} 
      />

      {/* Second Input Handle: Time Base */}
      <span 
        style={{ position: "absolute", left: "0px", top: "60%", fontSize: "12px", transform: "translateX(-120%)", color: "#0074D9" }}>
        Time Base
      </span>
      <Handle 
        type="target" 
        position={Position.Left} 
        id="input-timebase" 
        style={{ top: "60%", backgroundColor: "#0074D9" }} 
      />

      Oscilloscope
    </div>
  );
};

export default OscilloscopeBox;
