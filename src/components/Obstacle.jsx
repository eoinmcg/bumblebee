import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

import { detectCollision } from '../helpers/collision';
import { Helpers as H } from '../helpers/utils';
import sfx from '../helpers/sfx';
import { MAX_X } from '../config';

export default function Obstacle({pos, scale, gameSpeed, player, reportCrash}) {
  const body = useRef();
  scale = scale || 4;
  const [hit, setHit] = useState(false);

  useEffect(() => {
    resetPos(true);
  }, [])

  const resetPos = (init = false) => {
    body.current.position.x = H.rnd(-MAX_X, MAX_X);
    if (init) {
      body.current.position.z = H.rnd(-100, -300);
    } else {
      body.current.position.z = H.rnd(-200, -400);
    }
    // body.current.position.y = -12;
    body.current.position.y = H.rnd(-12,-2);
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
          <meshStandardMaterial opacity={0.1} color={hit? 0xff0000 : 0x00ff00} />
        </mesh>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1,6,1]} />
          <meshStandardMaterial opacity={0.1} color={hit? 0xff0000 : 0x4d2926} />
        </mesh>
      </group>
    </>
  );
}

