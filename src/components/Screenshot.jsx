import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

/**
 * Takes screenshot (gl canvas only)
 *
 * Press [p] to activate
 * 
 */
export default function Screenshot() {
  const { gl } = useThree();

  useEffect(() => {
    const captureKey = (e) => {
      if (e.code === 'KeyP') {
        saveScreenshot();
      }
    }

    window.addEventListener('keyup', captureKey)
    return () => {
      window.removeEventListener('keyup', captureKey)
    }
  }, []);

  const saveScreenshot = () => {
    const dataUrl = gl.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `screenshot-${new Date().getMilliseconds()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return <></>
}
