import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';

import Loading from './scenes/Loading';
import Play from './scenes/Play';
import Splash from './scenes/Splash';
import About from './scenes/About';

import UI from './components/UI';

import { useGameStore } from './store';

import { Perf } from 'r3f-perf'

export default function Game() {

  const [scene, setScene] = useState('loading');
  const [transitioning, setTransitioning] = useState(false);
  const [debug, setDebug] = useState(false);
  const { DEFAULT_CAMERA, setScore, setLives, setSpeed, setPlays, plays } = useGameStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // add ?debug=true to URL to view perf panel
    if (params.get('debug') === 'true') {
      setDebug(true);
    }

    // handy for testing out scenes in dev
    if (params.get('start')) {
      setScene(params.get('start'));
    }
  }, []);

  const changeScene = (newScene) => {
    setScore(0);
    setLives(2);
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
        { name: 'photo', keys: [ 'KeyP' ] },
        { name: 'vid', keys: [ 'KeyV' ] },
        { name: 'mute', keys: [ 'KeyM' ] },
        { name: 'up', keys: [ 'ArrowUp', 'KeyW' ] },
        { name: 'down', keys: [ 'ArrowDown', 'KeyS' ] },
        { name: 'left', keys: [ 'ArrowLeft', 'KeyA' ] },
        { name: 'right', keys: [ 'ArrowRight', 'KeyD' ] },
      ]}>
        <Canvas
          gl={{ preserveDrawingBuffer: true }}
          camera={DEFAULT_CAMERA}
          shadows
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
        {debug && <Perf position="bottom-right" /> }
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
