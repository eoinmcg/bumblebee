import React, { useState } from 'react';
import { Text3D } from '@react-three/drei';

export default function TextButton({pos, text, scale, col, hoverCol, callback}) {

  pos = pos || [0,0,0];
  scale = scale || .5;
  col = col || 'white';
  hoverCol = hoverCol || 'hotpink';
  callback = callback || false;

  const [color, setColor] = useState(col);

  return (
    <>
      <Text3D
        scale={[scale,scale,scale]}
        font="Bangers_Regular.json"
        material-toneMapped={false}
        position={pos}
        color={color}
        onPointerEnter={(e) => {
          setColor(hoverCol);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={(e) => {
          setColor(col);
          document.body.style.cursor = 'auto';
        }}
        onClick={callback}>
        <meshStandardMaterial color={color} />
      {text}
      </Text3D>
    </>
  );
}
