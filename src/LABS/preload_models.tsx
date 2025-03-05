import { useGLTF } from '@react-three/drei';
import React from 'react';

function PreloadModels() {
  // Just call preload on each gltf resource

  // Frank Hertz Pre-loading
  // TODO: Have some logic for preloading for whatever components you think user is going to choose. 
  useGLTF.preload('/frank_hertz/window3.glb');
  useGLTF.preload('/frank_hertz/topend2.glb');
  useGLTF.preload('/frank_hertz/mesh_holes.glb');
  useGLTF.preload('/frank_hertz/tube4.glb');
  useGLTF.preload('/thermometer/thermometer11.glb');
  useGLTF.preload('/frank_hertz/shooter2.glb');
  useGLTF.preload('/frank_hertz/heating_rods.glb');
  useGLTF.preload('/frank_hertz/main_box3.glb');
  // ...and any other models you'd like to preload

  // This component doesn't render anything visible
  return null;
}

export default PreloadModels;
