import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Text, Center, Text3D, Float } from '@react-three/drei';
import * as THREE from 'three';

import Lights from '../components/Lights';
import TextButton from '../components/TextButton';

import BeeModel from '../models/BeeModel';


export default function Splash({changeScene}) {

  const hexTexture = useLoader(THREE.TextureLoader, 'hex.png');
  const [opacity, setOpacity] = useState(.5);

  const [rot, setRot] = useState(0);
  const bumble = useRef();
  const wingL = useRef();
  const wingR = useRef();


  const handleClick = (scene = 'play') => {
    changeScene(scene)
  }

  let wingAngle = 0;
  let wingDir = -1;
  let wingSpeed = 100;

  useFrame((state, delta) => {
    bumble.current.rotation.y += delta / 2;

    wingAngle += (wingSpeed * wingDir) * delta;
    wingL.current.rotation.y = wingAngle;
    wingR.current.rotation.y = wingAngle;


  });


  return (
    <>
      <Lights color="lightblue" />
      <mesh scale={0.5} rotation-x={.25} ref={bumble}>
      <BeeModel wingLRef={wingL} wingRRef={wingR} />
      </mesh>
      <Center position={[0,3,0]} scale={1.1} rotation={[0,.1,0]}>
        <Float>
        <Text3D scale={.4}
          font="Bangers_Regular.json"
          position={[.5,0,0]}>
          <meshStandardMaterial color="#333" />
          might of the
  
        </Text3D>
        <Text3D
          scale={.7}
          font="Bangers_Regular.json"
          position={[0,-1,0]}>
          <meshStandardMaterial color="gold" />
          BUMBLEBEE
        </Text3D>
        </Float>
      </Center>
      <TextButton
        col="hotpink"
        hoverCol="limegreen"
        pos={[-.6,-2,0]}
        text="play"
        callback={() => {
          handleClick('play')
        }}
      />

      <TextButton
        col="hotpink"
        hoverCol="limegreen"
        pos={[-.8,-3,0]}
        text="about"
        callback={() => {
          handleClick('about')
        }}
      />

      <mesh scale={10} position={[1.5,-1.5,-3]}>
          material-toneMapped={false}
        <planeGeometry />
        <meshBasicMaterial
          map={hexTexture}
          transparent={true}
          opacity={opacity}
          side={THREE.DoubleSide}
        />
      </mesh>
 
    </>
  );
}
