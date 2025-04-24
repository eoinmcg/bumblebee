import { Text3D } from '@react-three/drei';

export default function OuchModel({ groupRef, angle, scale, text }) {

  return (
     <>
      <group ref={groupRef} rotation-z={angle} scale={scale}>
        <mesh position={[0,0,-.5]}>
          <circleGeometry args={[3,7]} />
          <meshStandardMaterial color="orange" />
        </mesh>
        <mesh position={[0,0,-.3]}>
          <ringGeometry args={[1,2,10]} />
          <meshStandardMaterial color="yellow" />
        </mesh>
        <mesh rotation-x={ - Math.PI * 2 } scale={ 2 }>
            <planeGeometry />
            <meshStandardMaterial color="red" />
        </mesh>
        <mesh position={[0,0,0.025]} rotation-x={ - Math.PI * 2 } rotation-z={1} scale={ 1.9 }>
            <planeGeometry />
            <meshStandardMaterial color="red" />
        </mesh>
        <mesh position={[0,0,0.03]} rotation-x={ - Math.PI * 2 } rotation-z={.5} scale={ 1.8 }>
            <planeGeometry />
            <meshStandardMaterial color="red" />
        </mesh>
      </group>
      <Text3D
        font="Bangers_Regular.json"
        position={[-.15*scale*4,-.1,0.07]}
        scale={(scale*.5)}
        rotation-z={scale * -.1}
        color="white">
        {text}
          <meshStandardMaterial color="white" />
      </Text3D>
    </>
  );
}

