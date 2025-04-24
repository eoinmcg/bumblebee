import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';

import Loading from './scenes/Loading';
import Play from './scenes/Play';
import Splash from './scenes/Splash';
import About from './scenes/About';

import UI from './components/UI';

import { DEFAULT_CAMERA } from './config';
import { useGameStore } from './store';

export default function Game() {
  const [scene, setScene] = useState('loading');
  const [transitioning, setTransitioning] = useState(false);
  const { setScore, setLives, setLevel, setSpeed, setPlays, plays } = useGameStore();

  const changeScene = (newScene) => {
    setScore(0);
    setLives(2);
    setLevel(0);
    setSpeed(0);
    setPlays(plays + 1);

    setTransitioning(true);
    window.setTimeout(() => {
      setScene(newScene);
    setTransitioning(false);
    }, 500);
  };

  return (
    <div className={`game-root ${transitioning ? 'fade-out' : 'fade-in'}`}>
      <KeyboardControls map={[
        { name: 'esc', keys: [ 'Esc' ] },
        { name: 'space', keys: [ 'Space' ] },
        { name: 'mute', keys: [ 'KeyM' ] },
        { name: 'up', keys: [ 'ArrowUp', 'KeyW' ] },
        { name: 'down', keys: [ 'ArrowDown', 'KeyS' ] },
        { name: 'left', keys: [ 'ArrowLeft', 'KeyA' ] },
        { name: 'right', keys: [ 'ArrowRight', 'KeyD' ] },
      ]}>
        <Canvas
          shadows
          camera={DEFAULT_CAMERA}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          {scene === "loading" && <Loading changeScene={changeScene} />}
          {scene === "intro" && <Intro changeScene={changeScene} />}
          {scene === "splash" && <Splash changeScene={changeScene} />}
          {scene === "about" && <About changeScene={changeScene} />}
          {scene === "play" && <Play key={plays} plays={plays} numObstacles={15} speed={1.5} changeScene={changeScene} />}
        </Canvas>
        {scene === "play" && <UI changeScene={changeScene} />}
        </KeyboardControls>
      </div>
  );
}
