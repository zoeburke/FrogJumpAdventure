import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Water() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Subtle wave motion
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.005;
  });
  
  return (
    <mesh ref={meshRef} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial 
        color="#87CEEB" 
        transparent 
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
