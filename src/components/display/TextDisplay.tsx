import { Annotation } from '@/types/types';
import React from 'react';
import { Layer, Stage, Text } from 'react-konva';

interface TextDisplayProps {
  annotations: Annotation[];
}

const TextDisplay: React.FC<TextDisplayProps> = ({ annotations }) => {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {annotations.map((item, index) => {
          const points = item.boundingPoly.vertices;
          const x = points[0].x; // Top-left corner
          const y = points[0].y; // Top-left corner

          return (
            <Text
              key={index}
              x={x}
              y={y}
              text={item.description}
              fontSize={24}
              fontFamily='Arial'
              fill='black'
            />
          );
        })}
      </Layer>
    </Stage>
  );
};

export default TextDisplay;
