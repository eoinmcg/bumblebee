import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function Fog() {
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.Fog('lightblue', 50, 300);
    return () => { scene.fog = null };
  }, [scene]);

  return null;
}

