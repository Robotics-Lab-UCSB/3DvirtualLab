import * as THREE from 'three';

export class WirePort {
  positionEdge?: string;
  color?: string;
  orientation?: string;
  position: THREE.Vector3;
  connectedTo: string | null;
  uniqueId: string;
  threeObject: THREE.Object3D | null;

  constructor(
    positionEdge: string,
    color: string,
    orientation: string,
    position: THREE.Vector3,
    uniqueId: string,
    threeObject: THREE.Object3D | null = null,
    connectedTo: string | null = null
  ) {
    this.positionEdge = positionEdge;
    this.color = color;
    this.orientation = orientation;
    this.position = position;
    this.uniqueId = uniqueId;
    this.connectedTo = connectedTo;
    this.threeObject = threeObject;
  }

  updateConnection(connectedTo: string | null) {
    this.connectedTo = connectedTo;
  }

  updateColor(newColor: string) {
    this.color = newColor;
    if (this.threeObject instanceof THREE.Mesh && this.threeObject.material instanceof THREE.MeshStandardMaterial) {
      this.threeObject.material.color.set(newColor);
    }
  }

  getThreeObject() {
    return this.threeObject;
  }
}

export const generateWirePorts = (): WirePort[] => [
  new WirePort(
    'top-left',
    'blue',
    'horizontal',
    new THREE.Vector3(0.5, 1.2, 0),
    'unique-101',
    null
  ),
  new WirePort(
    'top-right',
    'green',
    'vertical',
    new THREE.Vector3(-0.3, 2.0, 0),
    'unique-102',
    null
  ),
  new WirePort(
    'bottom-left',
    'red',
    'diagonal',
    new THREE.Vector3(-1.5, -1.2, 0),
    'unique-103',
    null
  ),
  new WirePort(
    'bottom-right',
    'yellow',
    'angled',
    new THREE.Vector3(1.7, -0.5, 0),
    'unique-104',
    null
  ),
  new WirePort(
    'center',
    'white',
    'centered',
    new THREE.Vector3(0, 0, 0.5),
    'unique-105',
    null
  ),
];