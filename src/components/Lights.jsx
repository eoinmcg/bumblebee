export default function Lights({color}) {

  color = color || 'lightblue';

  return (
    <>
      <color args={ [ color ] } attach="background" />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} castShadow />
      <directionalLight 
        position={[1, 15, 30]}
        intensity={1.5} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={250}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
    </>
  );

}

