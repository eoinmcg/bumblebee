import React, {  useEffect } from 'react';
import { Html, Center } from '@react-three/drei';

export default function Loading({changeScene}) {

  useEffect(() => {
    changeScene('splash');
  });

  return (
    <Center>
    <Html>
      <div className="loading">
        <h1>loading...</h1>
        <span> 🐝 </span>
      </div>
    </Html>
    </Center>
  );

}
