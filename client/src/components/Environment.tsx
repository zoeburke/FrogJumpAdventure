import * as THREE from "three";
import { useFrogGame } from "../lib/stores/useFrogGame";

export default function Environment() {
  return (
    <group>
      {/* Directional indicators for lily pad progression */}
      <ProgressIndicators />
    </group>
  );
}

function ProgressIndicators() {
  const { lilyPads, frogPosition } = useFrogGame();
  
  return (
    <group>
      {lilyPads.slice(1).map((pad, index) => {
        const distance = frogPosition.distanceTo(pad.position);
        const isVisible = distance < 15; // Show nearby indicators
        
        if (!isVisible) return null;
        
        return (
          <mesh
            key={pad.id}
            position={[pad.position.x, 1.5, pad.position.z]}
            rotation={[0, 0, 0]}
          >
            <coneGeometry args={[0.15, 0.4, 4]} />
            <meshStandardMaterial 
              color="#FFD700" 
              emissive="#FFD700"
              emissiveIntensity={0.2}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}