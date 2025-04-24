import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

export default function BeeModel({ wingAngle, wingLRef, wingRRef }) {

  const bee = useLoader(THREE.TextureLoader, 'bee.png');
  
  return (
    <group>
      {/* Wings */}
      <mesh ref={wingLRef} position={[-1, 0, 0]} rotation-x={Math.PI / 2} scale={.75} castShadow>
        <circleGeometry />
        <meshStandardMaterial color="lightblue" />
      </mesh>
      <mesh ref={wingRRef} position={[1, 0, 0]} rotation-x={Math.PI / 2} scale={.75} castShadow>
        <circleGeometry />
        <meshStandardMaterial color="lightblue" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0, -1.5]} scale={.7} rotation-x={-Math.PI / 2} castShadow>
        <coneGeometry />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh rotation-x={Math.PI * .5} castShadow>
        <capsuleGeometry />
        <meshStandardMaterial map={bee} />
      </mesh>



      {/* Anntenna */}
      <mesh position={[-1, .85, 1]} scale={.1} castShadow>
        <sphereGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      <mesh position={[1, .85, 1]} scale={.1} castShadow>
        <sphereGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      <mesh position={[.5, .5, .5]} rotation={[1, 0, -.7]} castShadow>
        <cylinderGeometry args={[.05, .05, 1.5]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-.5, .5, .5]} rotation={[1, 0, .7]} castShadow>
        <cylinderGeometry args={[.05, .05, 1.5]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0, 1]} scale={.8} castShadow>
        <sphereGeometry />
        <meshStandardMaterial color="black" />
      </mesh>
      {/* Eyes */}
      <mesh position={[.3, .2, 1.5]} scale={.3} castShadow>
        <sphereGeometry />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[-.3, .2, 1.5]} scale={.3} castShadow>
        <sphereGeometry />
        <meshStandardMaterial color="#fff" />
      </mesh>
    </group>
  );
}
