import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';

import { useGameStore } from '../store';
import { Helpers as H } from '../helpers/utils';
import sfx from '../helpers/sfx';
import { MAX_X } from '../config';

import BeeModel from '../models/BeeModel';

export default function Bumble({ gameSpeed }) {

  const bumble = useRef();
  const wingL = useRef();
  const wingR = useRef();

  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { addPlayer, lives } = useGameStore();
  const [isStored, setIsStored] = useState(false);

  // state for handling jump
  const [isJumping, setIsJumping] = useState(false);
  const jumpVelocity = useRef(0);
  const gravity = -0.015; // Adjust for desired jump arc
  const jumpForce = 0.3; // Initial upward force of the jump
  const rotationSpeed = 0.3; // Added rotation speed for x-axis

  // Oscillation parameters
  const oscillationSpeed = 0.05; // Controls how fast the bee oscillates
  const oscillationAmplitude = 0.15; // Controls how high/low the bee goes
  const basePositionY = 0.25; //  base Y position.  Important for consistent ground level
  const oscillationOffset = useRef(0);

  useEffect(() => {
    if (!isStored) {
      addPlayer(bumble);
      setIsStored(true);
    }
  }, [isStored, addPlayer]);

  let wingAngle = 0;
  let wingDir = -1;
  let wingSpeed = 100;

  useFrame((state, delta) => {
    if (!bumble.current) return;

    // shorthand for position and rotation
    const bodyPos = bumble.current.position;
    const bodyRot = bumble.current.rotation;

    window.bodyRot = bodyRot;
    if (lives < 0) {
      return;
    }

    if (gameSpeed < 0.2) {
      bodyRot.x = .2;
      bodyRot.z = -.5;
      bodyRot.y -= Math.PI;
      bodyPos.y -= .1;
      return;
    }

    const { left, right, up, space } = getKeys();
    const moveX = bodyRot.z * delta * 100;

    if (space) {
      console.log('space');
    }

    if (left && bodyPos.x !== -MAX_X) { bodyPos.x += (moveX); bodyRot.z -= .05; bodyRot.y += 0.05; }
    else if (right && bodyPos.x !== MAX_X) { bodyPos.x += (moveX); bodyRot.z += .05; bodyRot.y -= 0.05; }

    if (!left && !right) {
      const diff = bodyRot.y > Math.PI ? -.05 : 0.05;
      bodyRot.y += diff;
    }

    // Handle jump
    if (up && !isJumping && bodyRot.x >= 0) {
      setIsJumping(true);
      sfx('jump');
      jumpVelocity.current = jumpForce;
    }

    if (isJumping) {
      bodyPos.y += jumpVelocity.current;
      bodyRot.x += jumpVelocity.current * rotationSpeed * 3; // Apply rotation to X
      jumpVelocity.current += gravity;

      // Ground check (adjust the .25 to be slightly above your ground level if needed)
      if (bodyPos.y <= basePositionY) {
        bodyPos.y = basePositionY; // Snap back to the ground
        setIsJumping(false);
        jumpVelocity.current = 0;
      }
    } else {
      // Apply oscillation
      oscillationOffset.current += oscillationSpeed;
      bodyPos.y = basePositionY + Math.sin(oscillationOffset.current) * oscillationAmplitude;
      bodyRot.x < 0 ? bodyRot.x += .05 : bodyRot.x;
    }

    if (!right && bodyRot.z > 0) bodyRot.z -= .025;
    if (!left && bodyRot.z < 0) bodyRot.z += .025;

    const yRotMin = Math.PI-.5;
    const yRotMax = Math.PI+.5;
    bodyRot.x = H.clamp(bodyRot.x, -.5, .5);
    bodyRot.z = H.clamp(bodyRot.z, -.5, .5);
    bodyRot.y = H.clamp(bodyRot.y, yRotMin, yRotMax);
    bodyPos.x = H.clamp(bodyPos.x, -MAX_X, MAX_X);
    bodyPos.y = H.clamp(bodyPos.y, 0, 6);

    state.camera.position.x = bodyPos.x;

    wingAngle += (wingSpeed * wingDir) * delta;
    wingL.current.rotation.y = wingAngle;
    wingR.current.rotation.y = wingAngle;

  });

  return (
    <group position={[0, 0, 0]} rotation={[0, 0, 0]} scale={.5} ref={bumble}>
      <BeeModel wingLRef={wingL} wingRRef={wingR} />
    </group>
  );
}
