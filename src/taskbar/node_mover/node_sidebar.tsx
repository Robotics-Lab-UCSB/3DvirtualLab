import React, { useState } from 'react';
import { useDnD } from './DnDContext';

const Sidebar: React.FC = () => {
  const { setType } = useDnD();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Draggable nodes
  const nodeTypes = [
    'FrankHertzBox',
    'Variac',
    'VVR',
    'Electrometer',
    'Triple_Output_supply',
    'CurrentRegulator',
  ];

  // Handle drag start
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    setType(nodeType);
  };

  return (
    <>
      {/* Floating Toggle Button on the right */}
      <button
        className="toggle-button"
        onClick={toggleSidebar}
      >
        {isOpen ? '×' : '☰'}
      </button>

      {/* Sidebar container */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h3 style={{ marginTop: 0 }}>Available Nodes</h3>
        <p style={{ marginBottom: '1rem' }}>
          Drag these nodes to the canvas:
        </p>
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType}
            className="dndnode"
            draggable
            onDragStart={(event) => onDragStart(event, nodeType)}
          >
            {nodeType.replace(/_/g, ' ')}
          </div>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
