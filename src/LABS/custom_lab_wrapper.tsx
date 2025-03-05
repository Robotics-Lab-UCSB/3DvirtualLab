import React, { Suspense } from "react";
import CornerText from "../miscellaneous/2DTexts/2dText.tsx";
import FloatingSquare from "../taskbar/mainBlock.tsx";
import { CameraProvider } from "../contexts/cameraPositionContext.tsx";
import { NodeEdgeProvider } from "../taskbar/node_mover/node_edge_context.tsx";
import CustomLab from "./custom_lab.tsx";
import { InstrumentProvider } from '../contexts/instrument_value';

const CustomLabWrapper: React.FC = () => {
  return (
    <Suspense fallback={<CornerText position="top-left" text="Loading your Lab..." />}>
      <InstrumentProvider>
        <NodeEdgeProvider>
            <CameraProvider>
                <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
                    <CornerText position="top-left" text="Your Custom Lab" />
                    <FloatingSquare />
                    <CustomLab />
                </div>
            </CameraProvider>
        </NodeEdgeProvider>
      </InstrumentProvider>
    </Suspense>
  );
};

export default CustomLabWrapper;
