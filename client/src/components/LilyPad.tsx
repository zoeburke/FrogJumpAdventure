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
    
    // Base position from lily pad data
    const baseX = lilyPad.position.x;
    const baseZ = lilyPad.position.z;
    
    // Create unique phase offset for each lily pad
    const phaseOffset = (baseX + baseZ) * 0.1;
    const time = state.clock.elapsedTime;
    
    // Dynamic sway animation - simulate water currents
    const swayX = Math.sin(time * 0.8 + phaseOffset) * 0.08 + 
                  Math.sin(time * 1.3 + phaseOffset * 2) * 0.04;
    const swayZ = Math.cos(time * 0.6 + phaseOffset) * 0.06 + 
                  Math.cos(time * 1.1 + phaseOffset * 1.5) * 0.03;
    
    // Apply sway to position
    meshRef.current.position.x = baseX + swayX;
    meshRef.current.position.z = baseZ + swayZ;
    
    // Vertical floating with more natural bobbing
    const bobbing = Math.sin(time * 1.2 + phaseOffset) * 0.025 + 
                    Math.sin(time * 2.1 + phaseOffset * 0.7) * 0.015;
    meshRef.current.position.y = 0.05 + bobbing;
    
    // Gentle tilting to simulate floating on water
    meshRef.current.rotation.x = Math.sin(time * 0.9 + phaseOffset) * 0.02;
    meshRef.current.rotation.z = Math.cos(time * 0.7 + phaseOffset * 1.2) * 0.025;
    
    // Subtle rotation around Y axis for natural movement
    meshRef.current.rotation.y = Math.sin(time * 0.4 + phaseOffset) * 0.03;
    
    // Visual feedback for disappearing pads
    if (lilyPad.isDisappearing) {
      const pulseIntensity = Math.sin(time * 8) * 0.5 + 0.5;
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
