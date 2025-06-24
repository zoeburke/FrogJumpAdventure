import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import Frog from "./Frog";
import LilyPad from "./LilyPad";
import Water from "./Water";
import Environment from "./Environment";
import { useFrogGame } from "../lib/stores/useFrogGame";
import { useAudio } from "../lib/stores/useAudio";

export default function FrogGame() {
  const {
    phase,
    frogPosition,
    frogVelocity,
    isJumping,
    isCharging,
    jumpKeyPressed,
    chargeStartTime,
    chargeAmount,
    lilyPads,
    isOnLilyPad,
    currentLilyPadId,
    setFrogPosition,
    setFrogVelocity,
    setIsJumping,
    setIsCharging,
    setChargeAmount,
    setIsOnLilyPad,
    setJumpKeyPressed,
    setChargeStartTime,
    addScore,
    incrementConsecutiveJumps,
    resetConsecutiveJumps,
    endGame,
    updateLilyPads,
  } = useFrogGame();
  
  const { playHit, playSuccess } = useAudio();
  const lastTimeRef = useRef(0);
  const { camera } = useThree();
  const cameraTargetRef = useRef(new THREE.Vector3());
  const cameraOffsetRef = useRef(new THREE.Vector3(0, 8, 12));
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "KeyJ" && phase === "playing" && !jumpKeyPressed && !isJumping) {
        console.log("Jump key pressed - starting charge");
        setJumpKeyPressed(true);
        setIsCharging(true);
        setChargeStartTime(Date.now());
      }
    };
    
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "KeyJ" && phase === "playing" && jumpKeyPressed) {
        console.log("Jump key released - executing jump with charge:", chargeAmount);
        setJumpKeyPressed(false);
        setIsCharging(false);
        
        if (chargeAmount > 0) {
          executeJump();
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [phase, jumpKeyPressed, isJumping, chargeAmount]);
  
  // Execute jump based on charge amount
  const executeJump = () => {
    if (isJumping) return;
    
    const jumpPower = 5 + (chargeAmount * 10); // Base jump + charged power
    const jumpHeight = 3 + (chargeAmount * 5); // Base height + charged height
    
    // Calculate jump direction (forward in frog's facing direction)
    const jumpDirection = new THREE.Vector3(0, 0, -1); // Forward direction
    jumpDirection.multiplyScalar(jumpPower);
    jumpDirection.y = jumpHeight;
    
    setFrogVelocity(jumpDirection);
    setIsJumping(true);
    setIsOnLilyPad(false, undefined);
    setChargeAmount(0);
    
    playHit(); // Play jump sound
    console.log("Jump executed with power:", jumpPower, "height:", jumpHeight);
  };
  
  // Game loop
  useFrame((state) => {
    if (phase !== "playing") return;
    
    const currentTime = state.clock.getElapsedTime();
    const deltaTime = lastTimeRef.current ? currentTime - lastTimeRef.current : 0;
    lastTimeRef.current = currentTime;
    
    // Update charging
    if (isCharging && jumpKeyPressed) {
      const chargeDuration = (Date.now() - chargeStartTime) / 1000;
      const newChargeAmount = Math.min(chargeDuration / 2, 1); // 2 seconds for full charge
      setChargeAmount(newChargeAmount);
    }
    
    // Update lily pads
    updateLilyPads(deltaTime);
    
    // Update camera to follow frog
    const targetPosition = frogPosition.clone();
    targetPosition.add(cameraOffsetRef.current);
    cameraTargetRef.current.lerp(targetPosition, deltaTime * 2);
    camera.position.copy(cameraTargetRef.current);
    camera.lookAt(frogPosition.x, frogPosition.y, frogPosition.z);
    
    // Physics update for jumping frog
    if (isJumping) {
      const newPosition = frogPosition.clone();
      const newVelocity = frogVelocity.clone();
      
      // Apply gravity
      newVelocity.y -= 15 * deltaTime;
      
      // Update position
      newPosition.add(newVelocity.clone().multiplyScalar(deltaTime));
      
      // Check collision with lily pads
      let landedOnPad = false;
      for (const pad of lilyPads) {
        const distance = newPosition.distanceTo(pad.position);
        if (distance < pad.size && newPosition.y <= 0.5 && newVelocity.y <= 0) {
          // Landed on lily pad
          newPosition.y = 1;
          newVelocity.set(0, 0, 0);
          setIsJumping(false);
          setIsOnLilyPad(true, pad.id);
          landedOnPad = true;
          
          // Add score and increment consecutive jumps
          if (pad.id !== currentLilyPadId) {
            const basePoints = 10;
            const distanceBonus = Math.floor(Math.abs(pad.position.z) / 4) * 2; // Bonus for distance
            const sizeBonus = pad.size < 1 ? 5 : 0; // Bonus for smaller pads
            const totalPoints = basePoints + distanceBonus + sizeBonus;
            
            addScore(totalPoints);
            incrementConsecutiveJumps();
            playSuccess();
            console.log("Landed on lily pad:", pad.id, "Points:", totalPoints);
            
            // Trigger disappearing pad if applicable
            if (pad.disappearTime) {
              setTimeout(() => {
                // Mark pad as disappearing
                const currentPads = useFrogGame.getState().lilyPads;
                const updatedPads = currentPads.map(p => 
                  p.id === pad.id ? { ...p, isDisappearing: true } : p
                );
                useFrogGame.setState({ lilyPads: updatedPads });
              }, pad.disappearTime);
            }
          }
          break;
        }
      }
      
      // Check if fell in water
      if (!landedOnPad && newPosition.y < -0.5) {
        console.log("Fell in water - game over");
        endGame();
        resetConsecutiveJumps();
        return;
      }
      
      setFrogPosition(newPosition);
      setFrogVelocity(newVelocity);
    }
  });
  
  return (
    <group>
      <Frog />
      
      {/* Render lily pads */}
      {lilyPads.map((pad) => (
        <LilyPad key={pad.id} lilyPad={pad} />
      ))}
      
      <Water />
      <Environment />
    </group>
  );
}
