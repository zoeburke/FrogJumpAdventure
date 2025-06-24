import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useFrogGame } from "../lib/stores/useFrogGame";

export default function Frog() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { frogPosition, isJumping, isCharging, chargeAmount } = useFrogGame();
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Update frog position
    meshRef.current.position.copy(frogPosition);
    
    // Add visual feedback for charging
    if (isCharging) {
      const scaleEffect = 1 + (chargeAmount * 0.15);
      meshRef.current.scale.setScalar(scaleEffect);
      
      // Add glow effect
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.emissive.setHex(0x00ff00);
        meshRef.current.material.emissiveIntensity = chargeAmount * 0.4;
      }
    } else {
      meshRef.current.scale.setScalar(1);
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.emissive.setHex(0x000000);
        meshRef.current.material.emissiveIntensity = 0;
      }
    }
    
    // Add jumping animation
    if (isJumping) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 10) * 0.2;
    } else {
      meshRef.current.rotation.x = 0;
    }
  });
  
  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {/* Frog body */}
      <boxGeometry args={[0.8, 0.6, 1.2]} />
      <meshStandardMaterial color="#228B22" />
      
      {/* Frog eyes */}
      <mesh position={[0.2, 0.4, 0.3]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.2, 0.4, 0.3]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Frog legs */}
      <mesh position={[0.4, -0.2, -0.3]}>
        <boxGeometry args={[0.3, 0.2, 0.6]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[-0.4, -0.2, -0.3]}>
        <boxGeometry args={[0.3, 0.2, 0.6]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    </mesh>
  );
}
