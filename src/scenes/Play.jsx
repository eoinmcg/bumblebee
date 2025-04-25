import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls, useGLTF } from '@react-three/drei';

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
  const { MAX_SPEED, player, lives, setLives, toggleMute, mute  } = useGameStore();
  const [music] = useState(new Audio());

  const flowerModel = useGLTF('./flowers-tall.glb');

  // ref for clearing isHit after certain time period
  const hitTimeoutRef = useRef(null);

  // obstacle and flower will register this as
  // offscreen and respawn at a random location
  const offScreenPos = [0,20,0];
  let obstacles = useRef(Array(numObstacles).fill().map(() => ({
    pos: offScreenPos
  })));

  let flowers = useRef(Array(10).fill().map(() => ({
    pos: offScreenPos
  })));

  // handle muting sfx & music
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

  // handle restarting game
  useEffect(() => {
    if (plays > 0) {
      obstacles.current.forEach((obstacle) => {
        obstacle.pos = offScreenPos
      });
      flowers.current.forEach((flower) => {
        flower.pos = offScreenPos
      });
    }
  }, [plays]);

  // gameover event
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
    if (gameSpeed < MAX_SPEED) {
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
      {obstacles.current.map((obstacle, index) => (
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
