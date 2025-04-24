export default function Ground({color}) {
  color = color || 'darkgreen';
  return (
    <mesh
      receiveShadow
      position={[0, -2, 0]}
      rotation-x={-Math.PI * 0.5}
      scale={1000}
    >
      <planeGeometry />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
