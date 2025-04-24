import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

import OuchModel from '../models/OuchModel';

export default function Ouch({player, isHit}) {

  const ouchRef = useRef();
  const groupRef = useRef();
  const [angle, setAngle] = useState(0);
  const [scale, setScale] = useState(0.5);
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  const textOptions = ['BAM!', 'UFF!', 'POW!'];

  useEffect(() => {
    if (!player?.current || !isHit) return;

    setVisible(true);
    setAngle(0);
    setScale(0.1);
    setText(textOptions[~~(Math.random() * textOptions.length - 1)]);

    // update position to in front of player
    ouchRef.current.position.set(
      player.current.position.x,
      1,
      player.current.position.z + 7
    );
  }, [player, isHit]);

  useFrame((state, delta) => {
    if (!groupRef.current || !visible) return;

    setAngle(prevAngle => prevAngle + delta);
    setScale(prevScale => prevScale + delta * 2.5);

    if (scale > 2) { setVisible(false); }
  });

  return (
    <group ref={ouchRef} visible={visible}>
      <OuchModel
        visible={visible}
        ouchRef={ouchRef}
        groupRef={groupRef}
        angle={angle}
        scale={scale}
        text={text}
      />
    </group>
  );

}
