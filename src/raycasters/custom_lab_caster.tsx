import React, { useRef, useEffect, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { useInstruments } from '../contexts/instrument_value';

const CustomLabRaycastingComponent: React.FC = () => {
  
  const raycasterRef = useRef(new THREE.Raycaster())
  const mouseRef = useRef(new THREE.Vector2())
  const { camera, scene, gl } = useThree()
  const [isMouseDown, setIsMouseDown] = useState(false)
  const savedIntersectedObjectRef = useRef<THREE.Object3D | null>(null); // To store intersectedObject

  const currentAngleRef = useRef<number>(0)
  const previousAngleRef = useRef<number>(-1)
  const previousSpinning = useRef<THREE.Object3D | null>(null)
  const intersectsRef = useRef<THREE.Intersection[]>([])

  const vvrKnobAngleRef = useRef<number>(0);

  // Wires
  const startPosition = useRef<THREE.Vector3 | null>(null);
  const endPosition = useRef<THREE.Vector3 | null>(null);
  
  const cylindersArrayRef = useRef<THREE.Mesh[]>([]); 
  const wirePointsRef = useRef<THREE.Vector3[]>([]);

  const currentSelectedObject = useRef<THREE.Object3D | null>(null);

  const { registerInstrument, updateInstrument, readInstrument } = useInstruments();
  

  const createCylindersFromPositions = (
    positions: THREE.Vector3[],
    radius: number,
    material?: THREE.Material
  ) => {
    // Create glass-like material if no custom material is provided
    const cylinderMaterial =
      material ||
      new THREE.MeshPhysicalMaterial({
        color: 0xFF7074, // Light blue color for glass
        roughness: 0, // Smooth surface
        transmission: 0, // Makes it translucent
        thickness: 0.5, // Thickness of the glass effect
        clearcoat: 1, // Adds a clear coat layer for reflectivity
        clearcoatRoughness: 0, // Smooth clear coat
        reflectivity: 0, // Reflective surface
        opacity: 1, // Semi-transparent
        transparent: true, // Enables transparency
      });
  
    const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, 1, 32); // Use a normalized height
    const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
  
    for (let i = 0; i < positions.length - 1; i++) {
      const start = positions[i];
      const end = positions[i + 1];
  
      const direction = new THREE.Vector3().subVectors(end, start);
      const length = direction.length();
  
      const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
      cylinder.scale.set(1, length, 1); // Scale normalized geometry to match the length

      cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());

      const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      cylinder.position.copy(midpoint);
  
      const sphereStart = new THREE.Mesh(sphereGeometry, cylinderMaterial);
      const sphereEnd = new THREE.Mesh(sphereGeometry, cylinderMaterial);
  
      sphereStart.position.copy(start);
      sphereEnd.position.copy(end);
  
      cylinder.layers.set(2); 
      sphereStart.layers.set(2); 
      sphereEnd.layers.set(2); 
  
      cylindersArrayRef.current.push(cylinder);
      cylindersArrayRef.current.push(sphereStart);
      cylindersArrayRef.current.push(sphereEnd);
    }
  };
  
  const generateSpheres = (numSpheres: number, higherPoint: number) => {
    if (startPosition?.current && endPosition?.current) {
      const start = startPosition.current;
      const end = endPosition.current;
      
      const step = 1 / (numSpheres - 1);
      cylindersArrayRef.current.forEach((cylinder) => {
        scene.remove(cylinder);
      });
      cylindersArrayRef.current = [];
      const discretePositions: THREE.Vector3[] = [];
      for (let i = 0; i < numSpheres; i++) {
        let interpolatedPosition = new THREE.Vector3();
        if (i === 0) {
          discretePositions.push(start)
        } else if (i === numSpheres - 1) {
          discretePositions.push(end) 
        } else {
          interpolatedPosition.lerpVectors(start, end, i * step);
          interpolatedPosition.y = higherPoint;

          raycasterRef.current.set(interpolatedPosition, new THREE.Vector3(0, -1, 0));
          const intersects = raycasterRef.current.intersectObjects(scene.children, true);
          if (intersects.length > 0) {
            const nearestPoint = intersects[0].point;
            interpolatedPosition.y = (nearestPoint.y + 0.5);  

          }
          discretePositions.push(interpolatedPosition)
          // sphere.position.copy(interpolatedPosition);
        }  
        // Store the sphere in the array
      }

      // let index_middle = 0;
      for (let i = 1; i < discretePositions.length - 1; i++) {
        let smoothedDifference = discretePositions[i].y - (discretePositions[i].y * 0.987); 
      //   if (discretePositions[i - 1].y - discretePositions[i].y > 0 && discretePositions[i - 1].y - discretePositions[i].y > smoothedDifference) {
      //     let place_before = i - 1; 
      //     let explorer = i; 
      //     while (explorer < discretePositions.length - 1) {
      //       if (discretePositions[place_before].y > discretePositions[explorer].y) {
      //         explorer += 1;
      //       } else {
      //         break;
      //       }
      //     }
      //     if ((explorer - place_before) > 2) {
      //       index_middle = (explorer - place_before) / 2; 
      //     }
      //     for (let j = place_before + 1; j < index_middle; j++) {
      //       discretePositions[j].y = discretePositions[j - 1].y * 0.987;
      //     }
      //     for (let k = index_middle; k < explorer; k++) {
      //       discretePositions[k].y = discretePositions[k - 1].y + 1;
      //     }

      //     i = explorer; 
      //   }

        if (discretePositions[i - 1].y - discretePositions[i].y > 0 &&
            discretePositions[i - 1].y - discretePositions[i].y > smoothedDifference) {
          discretePositions[i].y = discretePositions[i-1].y * 0.987; 
        }
      }      
      createCylindersFromPositions(discretePositions, 0.2)
      cylindersArrayRef.current.forEach(cylinder => {
        scene.add(cylinder);
      });

    } else {
      console.error("Start or end position is not defined.");
    }
  };  

  const addSphereAtPosition = (position: THREE.Vector3) => {
    // Create a sphere geometry
    const geometry = new THREE.SphereGeometry(0.5, 32, 32); // Radius 0.5
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geometry, material);

    // Set the sphere's position
    sphere.position.copy(position);
    sphere.layers.set(2);
    // Add the sphere to the scene
    scene.add(sphere);
  };

  useEffect(() => {
    camera.layers.enable(2);
  })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }
    
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) {
        setIsMouseDown(true)

        if (intersectsRef.current.length > 0) {
          const intersectedObject = intersectsRef.current[0].object
          startPosition.current = intersectsRef.current[0].point.clone();
          startPosition.current.y += 0.2;
          if (intersectedObject.userData.type == "triangle_circle_button" || intersectedObject.userData.type == "switch_button") {
            intersectedObject.userData.handleIntersect();
          } else if (intersectedObject.userData.type == "long_button_type") {
                const boundingBox = new THREE.Box3().setFromObject(intersectedObject);
                const center = new THREE.Vector3();
                boundingBox.getCenter(center);
                var positionclicked = "left";
                if (intersectsRef.current[0].point.x > center.x) {
                    console.log("Clicked on the right half of the component");
                    positionclicked = "right";
                } else {
                    console.log("Clicked on the left half of the component");
                }
            intersectedObject.userData.handleIntersect(positionclicked);

          }
        }

        if (intersectsRef.current[0].object.userData.type == "wire_stable") {
          currentSelectedObject.current = intersectsRef.current[0].object;
          console.log(currentSelectedObject.current)
          if (currentSelectedObject.current instanceof THREE.Mesh) {
            const originalMaterial = currentSelectedObject.current.material;
            currentSelectedObject.current.userData.originalMaterial = originalMaterial; // Save the original material
        
            currentSelectedObject.current.material = new THREE.MeshStandardMaterial({
              color: originalMaterial.color, // Retain the original color
              emissive: originalMaterial.color, // Add an emissive color to make it glow
              emissiveIntensity: 1.5, // Increase the glow intensity
              roughness: 0.2, // Adjust for a smooth surface
              metalness: 0.1, // Slightly metallic for a polished look
            });
          }
        } else {
          currentSelectedObject.current = null;
        }
      }
    }

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 0) setIsMouseDown(false)
    }

    gl.domElement.addEventListener("mousemove", handleMouseMove)
    gl.domElement.addEventListener("mousedown", handleMouseDown)
    gl.domElement.addEventListener("mouseup", handleMouseUp)

    return () => {
      gl.domElement.removeEventListener("mousemove", handleMouseMove)
      gl.domElement.removeEventListener("mousedown", handleMouseDown)
      gl.domElement.removeEventListener("mouseup", handleMouseUp)
    }
  }, [gl])

  useFrame(() => {
    raycasterRef.current.setFromCamera(mouseRef.current, camera)
    raycasterRef.current.layers.set(0);
    raycasterRef.current.params.Points.threshold = 0.1
    intersectsRef.current = raycasterRef.current.intersectObjects(
      scene.children,
      true,
    )
    if (isMouseDown) {
      if (intersectsRef.current.length > 0) {
        const intersectedObject = intersectsRef.current[0].object
        const intersectedObject2 = intersectsRef.current[1].object
        
        const intersectPoint = intersectsRef.current[0].point
        // addSphereAtPosition(intersectPoint);
        endPosition.current = intersectPoint.clone(); 
        endPosition.current.y += 0.2;
        // if (startPosition.current) {
        //   const startPoint = startPosition.current;    
        //   var distance = intersectPoint.distanceTo(startPoint);
        //   distance = distance * 4.2;
        //   const higherPoint = Math.max(startPosition.current.y, endPosition.current.y) + 10;
        //   generateSpheres(100, higherPoint);
        // }

        const intersectionPoint = intersectsRef.current[0].point
        const localPoint = intersectedObject.worldToLocal(
          intersectionPoint.clone(),
        )
        let angle = 0

        if (intersectedObject.userData.type === "VVR_knob") {
          angle = Math.atan2(localPoint.x, localPoint.z)
        } else if (intersectedObject.userData.type === "lab1smallknob") {
          angle = Math.atan2(localPoint.x, localPoint.z)
        } else if (
          intersectedObject.userData.type === "current_knob"
        ) {
          angle = Math.atan2(localPoint.x, localPoint.z)
        }
        // } else if (currentSelectedObject.current?.userData.unique_id === "wire_stable_left_1") { 
        //   if (intersectedObject !== currentSelectedObject.current) {
        //     // Use raycaster to calculate the position based on the mouse
        //     const { x, y } = mouseRef.current;
        
        //     // Convert mouse position to a 3D point on a plane in front of the camera
        //     const vector = new THREE.Vector3(x, y, 0); // z = 0 for screen-space position
        //     vector.unproject(camera); // Convert from NDC to world space
        
        //     // Calculate a position on a plane parallel to the camera
        //     const direction = vector.sub(camera.position).normalize(); // Get direction from camera
        //     const distance = -camera.position.z / direction.z; // Distance to z=0 plane
        //     const worldPosition = camera.position.clone().add(direction.multiplyScalar(distance));
        
        //     // Update the selected object's position to follow the mouse
        //     currentSelectedObject.current.position.copy(worldPosition);
        //   }
        // }
        
        
        let deltaAngle
        if (previousSpinning.current !== intersectedObject) {
          // THIS PART IF USER STARTS DRAGGING ACROSS
          previousAngleRef.current = angle
          deltaAngle = 0
          previousSpinning.current = intersectedObject
        } else {
          currentAngleRef.current = angle
          deltaAngle = previousAngleRef.current - currentAngleRef.current
          previousAngleRef.current = currentAngleRef.current
        }

        if (deltaAngle > Math.PI) {
          deltaAngle -= 2 * Math.PI
        } else if (deltaAngle < -Math.PI) {
          deltaAngle += 2 * Math.PI
        }
        if (intersectedObject.userData.type === "lab1smallknob") {
          // CHECK FOR DIFFERENT ADDING ANGLE IMPLEMENTATIONS
          if (intersectedObject) {
            intersectedObject.rotation.y -= deltaAngle * 0.34
            intersectedObject.userData.backendUpdate()
          }
        } else if (intersectedObject.userData.type === "VVR_knob") {
          if (intersectedObject) {
            intersectedObject.rotation.y -= deltaAngle * 0.4
            const calculatedValue = (intersectedObject.rotation.y + 2 * Math.PI) % (2 * Math.PI);

            const temperature = (calculatedValue / (2 * Math.PI)) * 130;
          
            updateInstrument(intersectedObject.userData.unique_id, "temperature", 130 - temperature);
            vvrKnobAngleRef.current = intersectedObject.rotation.y; 
            if (!savedIntersectedObjectRef.current) {
              savedIntersectedObjectRef.current = intersectedObject;
            }
          }
        } else if (intersectedObject.userData.type === "current_knob") {
          if (intersectedObject) {
            intersectedObject.rotation.y -= deltaAngle * 0.34;
            const typeInner = intersectedObject.userData.type_inner;
            console.log(typeInner)

            if (typeInner === "filament_knob") {
              const calculatedFilament = (intersectedObject.rotation.y + 2 * Math.PI) % (2 * Math.PI);
              const filamentVoltage = (calculatedFilament / (2 * Math.PI)) * 30; // Example scaling
              updateInstrument(intersectedObject.userData.unique_id, "filament_voltage", filamentVoltage);
            } else if (typeInner === "VRknob") {
              const calculatedVR = (intersectedObject.rotation.y + 2 * Math.PI) % (2 * Math.PI);
              const retardingVoltage = (calculatedVR / (2 * Math.PI)) * 10; // Example scaling
              updateInstrument(intersectedObject.userData.unique_id, "retarding_voltage", retardingVoltage);
            } else if (typeInner === "VAknob") {
              const calculatedVA = (intersectedObject.rotation.y + 2 * Math.PI) % (2 * Math.PI);
              const acceleratingVoltage = (calculatedVA / (2 * Math.PI)) * 100; // Example scaling
              updateInstrument(intersectedObject.userData.unique_id, "accelerating_voltage", acceleratingVoltage);
            }
          }
        } else {
          previousSpinning.current = null
        }
      }
    } else {
      previousSpinning.current = null
    }
  })
  return null
}

export default CustomLabRaycastingComponent
