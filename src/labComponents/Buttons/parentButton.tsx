import React, { useEffect, useState } from "react"
import ButtonComponent from "./buttonsMain"

interface Button {
  unique_id: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  typeGen: string;
}

interface ParentComponentProps {
  distanceBetweenSmallButton?: number
  distanceBetweenBigButton?: number
  rot?: [number, number, number]
  position?: [number, number, number]
  scale?: [number, number, number]
}

const ParentComponent: React.FC<ParentComponentProps> = ({
  distanceBetweenSmallButton = 3.32,
  distanceBetweenBigButton = 3.5,
  rot = [0, 0, 0],
  position = [0, 0, 0],
  scale = [0.8, 0.8, 0.8],
}) => {
  const [buttons, setButtons] = useState<Button[]>([])

  useEffect(() => {
    // Create small buttons row
    const smallButtons = Array.from({ length: 8 }, (_, i) => ({
      unique_id: `eletrometer_smallButton_${i + 1}`,
      typeGen: 'circle_button',
      position: [
        position[0] - 81.1 + distanceBetweenSmallButton * (i + 1),
        position[1] + 33,
        position[2] - 5.5,
      ] as [number, number, number],
      rotation: [0,  -Math.PI / 2, 0] as [number, number, number],
      scale: [0.124, 0.124, 0.124] as [number, number, number],
    }))

    console.log(smallButtons)

    // Create big buttons for two rows
    const bigButtonsRow1 = Array.from({ length: 4 }, (_, i) => ({
      unique_id: `eletrometer_longButton_${i + 1}`,
      typeGen: 'long_button',
      position: [
        position[0] + distanceBetweenBigButton * (i + 1),
        position[1],
        position[2],
      ] as [number, number, number],
      rotation: rot,
      scale: [0.07, 0.07, 0.07] as [number, number, number],
    }))

    // Combine all buttons
    setButtons([
      ...smallButtons,
      ...bigButtonsRow1,
    ])
    console.log(buttons)
  }, [])

  return (
    <mesh position={position} scale={scale} rotation={[Math.PI / 2, 0, 0]}>
      <ButtonComponent buttons={buttons} />
    </mesh>
  )
}

export default ParentComponent
