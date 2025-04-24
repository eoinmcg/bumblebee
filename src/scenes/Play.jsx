import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  KeyboardControls, useKeyboardControls,
  useGLTF } from '@react-three/drei';

import { useGameStore } from '../store';

import Lights from '../components/Lights';
import Ouch from '../components/Ouch';
import Ground from '../components/Ground';
import Fog from '../components/Fog';
import Bumble from '../components/Bumble';
import Obstacle from '../components/Obstacle';
import Flower from '../components/Flower';

import sfx from '../helpers/sfx';

export default function Play({plays, numObstacles, speed, changeScene}) {

  const [subscribeKeys, getKeys] = useKeyboardControls();
  const [gameSpeed, setGameSpeed] = useState(0);
  const [isHit, setIsHit] = useState(false);
  const { player, lives, setLives, toggleMute, mute  } = useGameStore();
  const musicTrack = new Audio();
  const [music, setMusic] = useState(new Audio());

  const maxSpeed = 2;

  const flowerModel = useGLTF('./flowers-tall.glb');

  // ref for clearing isHit after certain time period
  const hitTimeoutRef = useRef(null);

  const treePos = () => {
    return [
      H.rndArray([-7, 0, 7]),
      0,
      -100 - Math.random() * 200
    ];
  }

  const flowerPos = () => {
    return [
      H.rndArray([-7, 0, 7]),
      0,
      -100 - Math.random() * 200
    ];
  }

  let trees = useRef(Array(numObstacles).fill().map(() => ({
    pos: treePos
  })));

  let flowers = useRef(Array(10).fill().map(() => ({
    pos: flowerPos
  })));

  useEffect(() => {
    if (mute) return;
      music.src = 'main-track.ogg';
      music.volume = .2;
      music.play();
    return () => {
      music.pause();
      music.currentTime = 0;
    };
  }, [plays, mute]);

  useEffect(() => {
    if (plays > 0) {
      console.log('RESETTING TRESS');
      trees.current.forEach((tree) => {
        tree.pos = treePos;
      });
      flowers.current.forEach((flower) => {
        flower.pos = flowerPos;
      });
    }
  }, [plays]);

  useEffect(() => {
    if (lives < 0) {
      music.pause();
      music.currentTime = 0;
      setGameSpeed(0);
    }
  }, [lives]);

  useEffect(() => {
    if (lives >= 0) {
      setGameSpeed(0.1);
    }
  }, [speed]);

  useEffect(() => {
    const unsubscribe = subscribeKeys(
      (state) => state.mute,
      (pressed) => {
        if (!pressed) {
          toggleMute();
        }
      }
    );
    // Clean up the subscription
    return () => unsubscribe();
  }, [subscribeKeys]);

  // reset isHit after 1 sec
  useEffect(() => {
    if (isHit) {
      // Store the timeout ID in the ref
      hitTimeoutRef.current = window.setTimeout(() => {
        setIsHit(false);
      }, 1000);
      
      return () => {
        if (hitTimeoutRef.current) {
          clearTimeout(hitTimeoutRef.current);
          hitTimeoutRef.current = null;
        }
      };
    }
  }, [isHit]);

  const playerCrashed = () => {
    setGameSpeed(-.1);
    setIsHit(true);
    sfx('hurt')
    setLives(lives - 1);
  }

  useFrame((state, delta) => {
    if (gameSpeed < maxSpeed) {
      setGameSpeed(gameSpeed => gameSpeed += .75 * delta);
    }
    if (lives < 0 && gameSpeed > 0) {
      setGameSpeed(0);
    }
  });

  return (
    <>
      <Lights />
      <Fog />
      <Ouch player={player} isHit={isHit} />
      <Bumble gameSpeed={gameSpeed} />
      {trees.current.map((tree, index) => (
        <Obstacle
          key={index}
          gameSpeed={gameSpeed}
          player={player}
          reportCrash={playerCrashed}
        />
      ))}
      {flowers.current.map((flower, index) => (
        <Flower
          model={flowerModel }
          key={index}
          gameSpeed={gameSpeed}
          player={player}
        />
      ))}
      <Ground />
    </>
  );
}

