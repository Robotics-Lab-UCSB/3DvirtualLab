import React from "react"
import Button2 from "./longButton"
import Button1 from "./circleAndTriangleButton"

interface Button {
  unique_id: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  typeGen: string;
}
interface ButtonComponentProps {
  buttons: Button[] // The array of button data to render
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ buttons }) => {
  return (
    <>
      {buttons.map((button) => (
        <Button1
          key={button.unique_id} 
          unique_id={button.unique_id}
          position={button.position}
          rotation={button.rotation}
          scale={button.scale}
          typeGen={button.typeGen} 
        />
      ))}
    </>
  );
};

export default ButtonComponent
