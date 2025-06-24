import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Water() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Create water ripple effect
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      const time = state.clock.elapsedTime;
      meshRef.current.material.opacity = 0.7 + Math.sin(time * 2) * 0.1;
    }
    
    // Gentle wave motion
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
  });
  
  return (
    <mesh ref={meshRef} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial 
        color="#4169E1" 
        transparent 
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
