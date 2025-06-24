import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Water() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Enhanced water movement to complement lily pad sway
    const time = state.clock.elapsedTime;
    
    // Multiple wave patterns for more realistic water movement
    meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.005 + 
                                  Math.sin(time * 0.7) * 0.002;
    meshRef.current.rotation.x = Math.cos(time * 0.4) * 0.003;
    
    // Subtle position offset for wave effect
    meshRef.current.position.y = -1 + Math.sin(time * 0.5) * 0.01;
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
