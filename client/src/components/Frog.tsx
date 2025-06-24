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
    
    // Smooth visual feedback for charging
    if (isCharging) {
      const scaleEffect = 1 + (chargeAmount * 0.15);
      const targetScale = scaleEffect;
      const currentScale = meshRef.current.scale.x;
      meshRef.current.scale.setScalar(currentScale + (targetScale - currentScale) * 0.3);
      
      // Smooth glow effect
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.emissive.setHex(0x00ff00);
        const targetIntensity = chargeAmount * 0.4;
        const currentIntensity = meshRef.current.material.emissiveIntensity;
        meshRef.current.material.emissiveIntensity = currentIntensity + (targetIntensity - currentIntensity) * 0.3;
      }
    } else {
      // Smooth return to normal
      const currentScale = meshRef.current.scale.x;
      meshRef.current.scale.setScalar(currentScale + (1 - currentScale) * 0.2);
      
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        const currentIntensity = meshRef.current.material.emissiveIntensity;
        meshRef.current.material.emissiveIntensity = currentIntensity * 0.8;
        if (currentIntensity < 0.01) {
          meshRef.current.material.emissive.setHex(0x000000);
          meshRef.current.material.emissiveIntensity = 0;
        }
      }
    }
    
    // Add smooth jumping animation
    if (isJumping) {
      // Create a smooth arc rotation during jump
      const jumpProgress = Math.max(0, frogPosition.y - 0.8) / 3; // Normalize jump height
      meshRef.current.rotation.x = Math.sin(jumpProgress * Math.PI) * 0.3;
    } else {
      // Smooth return to normal position
      meshRef.current.rotation.x *= 0.9;
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
