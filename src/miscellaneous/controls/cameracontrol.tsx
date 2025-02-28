import React, { useRef, useEffect, useMemo } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useCameraState } from '../../contexts/cameraPositionContext';

const ControlsComponent: React.FC = () => {
  const controlsRef = useRef(null);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.1}
      rotateSpeed={0.4}
      zoomSpeed={0.5}
      mouseButtons={{ MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }}
    />
  );
};

export default ControlsComponent;
