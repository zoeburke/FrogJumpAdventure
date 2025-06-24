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
  
  const { playHit, playSuccess, playCharge } = useAudio();
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
        playCharge();
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
  
  // Execute jump with smooth trajectory
  const executeJump = () => {
    if (isJumping) return;
    
    // Smooth power curve for better feel
    const smoothChargeAmount = Math.pow(chargeAmount, 0.8);
    const jumpPower = 5 + (smoothChargeAmount * 10); 
    const jumpHeight = 3.5 + (smoothChargeAmount * 4.5);
    
    // Calculate jump direction with slight arc
    const jumpDirection = new THREE.Vector3(0, 0, -1);
    jumpDirection.multiplyScalar(jumpPower);
    jumpDirection.y = jumpHeight;
    
    setFrogVelocity(jumpDirection);
    setIsJumping(true);
    setIsOnLilyPad(false, undefined);
    setChargeAmount(0);
    
    playHit();
    console.log("Jump executed with power:", jumpPower, "height:", jumpHeight);
  };
  
  // Game loop
  useFrame((state) => {
    if (phase !== "playing") return;
    
    const currentTime = state.clock.getElapsedTime();
    const deltaTime = lastTimeRef.current ? currentTime - lastTimeRef.current : 0;
    lastTimeRef.current = currentTime;
    
    // Update charging with smoother progression
    if (isCharging && jumpKeyPressed) {
      const chargeDuration = (Date.now() - chargeStartTime) / 1000;
      const rawChargeAmount = Math.min(chargeDuration / 2, 1); // 2 seconds for full charge
      // Apply easing function for smoother feel
      const easedChargeAmount = Math.sin(rawChargeAmount * Math.PI * 0.5);
      setChargeAmount(easedChargeAmount);
    }
    
    // Update lily pads
    updateLilyPads(deltaTime);
    
    // Smooth camera following
    const targetPosition = frogPosition.clone();
    targetPosition.add(cameraOffsetRef.current);
    cameraTargetRef.current.lerp(targetPosition, deltaTime * 3);
    camera.position.copy(cameraTargetRef.current);
    
    // Look slightly ahead of the frog
    const lookTarget = new THREE.Vector3(frogPosition.x, frogPosition.y, frogPosition.z - 2);
    camera.lookAt(lookTarget);
    
    // Physics update for jumping frog
    if (isJumping) {
      const newPosition = frogPosition.clone();
      const newVelocity = frogVelocity.clone();
      
      // Apply gravity with smoother curve
      newVelocity.y -= 12 * deltaTime;
      
      // Update position
      newPosition.add(newVelocity.clone().multiplyScalar(deltaTime));
      
      // Check collision with lily pads using base positions
      let landedOnPad = false;
      for (const pad of lilyPads) {
        // Use base position for collision since sway is just visual
        const horizontalDistance = Math.sqrt(
          Math.pow(newPosition.x - pad.position.x, 2) + 
          Math.pow(newPosition.z - pad.position.z, 2)
        );
        
        // Only land if frog is close horizontally, at the right height, and descending
        if (horizontalDistance < pad.size * 0.9 && 
            newPosition.y <= 0.9 && 
            newPosition.y > 0.2 && 
            newVelocity.y <= 0) {
          
          // Landed on lily pad - use base position
          newPosition.x = pad.position.x;
          newPosition.z = pad.position.z;
          newPosition.y = 0.8;
          newVelocity.set(0, 0, 0);
          setIsJumping(false);
          setIsOnLilyPad(true, pad.id);
          landedOnPad = true;
          
          // Add score and increment consecutive jumps
          if (pad.id !== currentLilyPadId) {
            const basePoints = 1;
            incrementConsecutiveJumps(); // This updates the multiplier
            const currentMultiplier = useFrogGame.getState().multiplier;
            const earnedPoints = basePoints * currentMultiplier;
            addScore(basePoints); // addScore applies the multiplier internally
            playSuccess();
            console.log(`Landed on lily pad: ${pad.id}, Points: ${basePoints} x ${currentMultiplier} = ${earnedPoints}`);
          }
          break;
        }
      }
      
      // Check if fell in water
      if (!landedOnPad && newPosition.y < -1.0) {
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
