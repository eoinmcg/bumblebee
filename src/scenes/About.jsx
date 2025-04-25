import React, { useState } from 'react';
import { Center, Html, Text3D } from '@react-three/drei';

import Lights from '../components/Lights';
import TextButton from '../components/TextButton';

export default function About({changeScene}) {

  const [color, setColor] = useState('white')

  const handleClick = (scene = 'play') => {
    changeScene(scene)
  }

  return (
    <>
      <Lights color="#222" />

        <Text3D scale={[.7,.7,.7]}
        font="Bangers_Regular.json"
          position={[-1,3,0]}
          fontWeight="bold">
          <meshStandardMaterial color="gold" />
          About
        </Text3D>

      <Html center>
        <div className="about">
        <p>Built by <br /><a target="blank" href="https://eoinmcgrath.com">eoinmcg</a></p>
        <p>Music by <a target="blank" href="https://pixabay.com/users/melodyayresgriffiths-27269767/">melodyayresgriffiths</a></p>
        <p>SFX generated with <a href="https://killedbyapixel.github.io/ZzFX/">ZzFX</a></p>
        <p>3D models by <a target="blank" href="https://kenney.nl/assets/platformer-kit">Kenney</a></p>
        <p>
          <a target="blank" href="https://github.com/eoinmcg/bumblebee/">Source code</a>
        </p>
        </div>
      </Html>

      <TextButton
        col="hotpink"
        hoverCol="limegreen"
        pos={[-.5,-3,0]}
        text="back"
        callback={() => {
          handleClick('splash')
        }}
      />

    </>
  );
}


