import React, { useState, useEffect } from 'react';
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import { useGameStore } from '../store';

export default function UI({changeScene}) {
  const { score, hiScore, setHiScore, lives, mute, setMute } = useGameStore();

  const [showUI, setShowUI] = useState(false);
  const [newHiScore, setNewHiScore] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const { width, height } = useWindowSize()

  const handleToggleMute = () => {
    setMute(!mute);
  }


  useEffect(() => {
    if (lives === 2) {
      setShowUI(true);
      setShowGameOver(false);
      setNewHiScore(false);
    }

    if (lives < 0) {
      setShowGameOver(true);
      if (score > hiScore) {
        setHiScore(score);
        setNewHiScore(score);
      }
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
          <h4>{newHiScore ? 'NEW HISCORE!' : 'GAMEOVER'}</h4>
          <p>replay?</p>
        </div>
        {newHiScore && (
          <Confetti
            width={width}
            height={height}
          />
        )}
    </>
  );
}
