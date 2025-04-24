import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store';

export default function UI({changeScene}) {
  const { score, lives, mute, setMute } = useGameStore();

  const [showUI, setShowUI] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  const handleToggleMute = () => {
    setMute(!mute);
  }


  useEffect(() => {
    if (lives === 2) {
      setShowUI(true);
      setShowGameOver(false);
    }

    if (lives < 0) {
      setShowGameOver(true);
    }
  }, [lives]);

  return (
    <>
      <div className={showUI ? 'top active' : 'top'}>
      <div className="lives">
        {lives > -1 && [...Array(lives)].map((e, i) => {
          return <span key={i}>❤️</span>
        })}
      </div>
      <div className="score">
        {score}
      </div>
      <button className={mute ? 'mute muted': 'mute'} onClick={handleToggleMute}></button>
      </div>
        <div className={showGameOver ? 'gameover active' : 'gameover'} onClick={(e) => {
          changeScene('play');
        }}>
          <h4>GAMEOVER</h4>
          <p>replay?</p>
        </div>
      
    </>
  );
}
