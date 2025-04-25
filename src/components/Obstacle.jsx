import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

import { useGameStore } from '../store';
import { detectCollision } from '../helpers/collision';
import { Helpers as H } from '../helpers/utils';
import sfx from '../helpers/sfx';

export default function Obstacle({pos, scale, gameSpeed, player, reportCrash}) {
  const body = useRef();
  scale = scale || 4;
  const { MAX_X, COLS } = useGameStore();
  const [hit, setHit] = useState();
  const [color, setColor] = useState(COLS.green);

  useEffect(() => {
    resetPos();
  }, [])

  const resetPos = () => {
    body.current.position.x = H.rnd(-MAX_X, MAX_X);
    body.current.position.z = H.rnd(-20, -40, 'even') * 10;
    const y = H.rndArray([-12,-2]);
    body.current.position.y = y;
    setColor(y === -2 ? COLS.green : COLS.green);
    setHit(false);
  }

  useFrame((state, delta) => {
    if(!body?.current || !player || gameSpeed < 0.015) return;

    body.current.position.z += gameSpeed * delta;

    if (!hit) {
      const isColliding = detectCollision(body.current, player.current);
      if (isColliding) {
        setHit(true);
        sfx('crash');
        reportCrash();
        resetPos();
      }

    }

    body.current.position.z += gameSpeed;

    if (body.current.position.z > 15) {
      resetPos();
    }
  });

  return (
    <>
      <group position={pos} ref={body} scale={scale}>
        <mesh position={[0,2,0]} castShadow receiveShadow>
          <boxGeometry args={[1.25,2.5,1.25]} />
          <meshStandardMaterial opacity={0.1} color={hit? 0xff0000 : color} />
        </mesh>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1,6,1]} />
          <meshStandardMaterial opacity={0.1} color={hit? 0xff0000 : 0x4d2926} />
        </mesh>
      </group>
    </>
  );
}
