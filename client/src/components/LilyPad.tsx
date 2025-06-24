import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LilyPadData } from "../lib/stores/useFrogGame";

interface LilyPadProps {
  lilyPad: LilyPadData;
}

export default function LilyPad({ lilyPad }: LilyPadProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Update position
    meshRef.current.position.copy(lilyPad.position);
    
    // Add floating animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + lilyPad.position.x) * 0.1;
    
    // Add gentle rotation for moving pads
    if (lilyPad.isMoving) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
    
    // Add visual feedback for disappearing pads
    if (lilyPad.isDisappearing) {
      const pulseIntensity = Math.sin(state.clock.elapsedTime * 8) * 0.5 + 0.5;
      meshRef.current.scale.setScalar(1 - pulseIntensity * 0.2);
    } else {
      meshRef.current.scale.setScalar(1);
    }
  });
  
  return (
    <mesh ref={meshRef} receiveShadow>
      <cylinderGeometry args={[lilyPad.size, lilyPad.size, 0.1, 16]} />
      <meshStandardMaterial 
        color="#228B22" 
        transparent={lilyPad.isDisappearing}
        opacity={lilyPad.isDisappearing ? 0.5 : 1}
      />
      
      {/* Lily pad detail - center */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[lilyPad.size * 0.3, lilyPad.size * 0.3, 0.02, 8]} />
        <meshStandardMaterial color="#32CD32" />
      </mesh>
      
      {/* Lily pad notch */}
      <mesh position={[lilyPad.size * 0.7, 0.06, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[lilyPad.size * 0.2, 0.02, lilyPad.size * 0.1]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    </mesh>
  );
}
