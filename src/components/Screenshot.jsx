import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';

export default function Screenshot() {

  const { gl, camera, viewport } = useThree();
  const groupRef = useRef(null);

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

  useEffect(() => {
    const groupRefCopy = groupRef.current;
    camera.add(groupRefCopy);
    return () => {
      camera.remove(groupRefCopy);
    };
  }, [camera, groupRef.current]);



  const saveScreenshot = () => {
    const dataUrl = gl.domElement.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = 'r3f-screenshot.png';
    link.href = dataUrl;
    link.click();
  };


  return <></>

}
