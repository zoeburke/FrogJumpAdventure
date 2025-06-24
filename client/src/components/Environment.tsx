import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useFrogGame } from "../lib/stores/useFrogGame";

export default function Environment() {
  const { frogPosition } = useFrogGame();
  
  // Generate reeds around the pond
  const reeds = Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * Math.PI * 2;
    const distance = 15 + Math.random() * 5;
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    const height = 2 + Math.random() * 3;
    
    return {
      id: i,
      position: new THREE.Vector3(x, height / 2, z),
      height,
      sway: Math.random() * 0.5
    };
  });
  
  // Generate floating leaves
  const floatingLeaves = Array.from({ length: 20 }, (_, i) => {
    return {
      id: i,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        -0.3,
        (Math.random() - 0.5) * 40
      ),
      rotation: Math.random() * Math.PI * 2,
      scale: 0.3 + Math.random() * 0.4
    };
  });
  
  return (
    <group>
      {/* Reeds around the pond */}
      {reeds.map((reed) => (
        <Reed key={reed.id} reed={reed} />
      ))}
      
      {/* Floating leaves on water */}
      {floatingLeaves.map((leaf) => (
        <FloatingLeaf key={leaf.id} leaf={leaf} />
      ))}
      
      {/* Directional indicators for lily pad progression */}
      <ProgressIndicators />
    </group>
  );
}

function Reed({ reed }: { reed: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Gentle swaying motion
    const time = state.clock.elapsedTime;
    meshRef.current.rotation.x = Math.sin(time * 0.5 + reed.sway) * 0.1;
    meshRef.current.rotation.z = Math.cos(time * 0.3 + reed.sway) * 0.05;
  });
  
  return (
    <mesh ref={meshRef} position={reed.position}>
      <cylinderGeometry args={[0.05, 0.02, reed.height, 6]} />
      <meshStandardMaterial color="#228B22" />
      
      {/* Reed top */}
      <mesh position={[0, reed.height / 2, 0]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </mesh>
  );
}

function FloatingLeaf({ leaf }: { leaf: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Gentle floating motion
    const time = state.clock.elapsedTime;
    meshRef.current.position.y = -0.3 + Math.sin(time * 0.8 + leaf.id) * 0.05;
    meshRef.current.rotation.y = leaf.rotation + Math.sin(time * 0.2) * 0.1;
  });
  
  return (
    <mesh 
      ref={meshRef} 
      position={leaf.position}
      scale={leaf.scale}
      rotation={[0, leaf.rotation, 0]}
    >
      <circleGeometry args={[0.8, 8]} />
      <meshStandardMaterial 
        color="#228B22" 
        transparent 
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function ProgressIndicators() {
  const { lilyPads, frogPosition } = useFrogGame();
  
  return (
    <group>
      {lilyPads.slice(1).map((pad, index) => {
        const distance = frogPosition.distanceTo(pad.position);
        const isVisible = distance < 20; // Only show nearby indicators
        
        if (!isVisible) return null;
        
        return (
          <mesh
            key={pad.id}
            position={[pad.position.x, 2, pad.position.z]}
            rotation={[0, 0, 0]}
          >
            <coneGeometry args={[0.2, 0.5, 4]} />
            <meshStandardMaterial 
              color="#FFD700" 
              emissive="#FFD700"
              emissiveIntensity={0.3}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
}