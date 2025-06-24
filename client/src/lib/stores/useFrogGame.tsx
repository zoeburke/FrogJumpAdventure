import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export type GamePhase = "ready" | "playing" | "gameOver";

export interface LilyPadData {
  id: string;
  position: THREE.Vector3;
  size: number;
  isMoving: boolean;
  moveDirection?: THREE.Vector3;
  isDisappearing: boolean;
  disappearTime?: number;
}

interface FrogGameState {
  // Game state
  phase: GamePhase;
  score: number;
  consecutiveJumps: number;
  multiplier: number;
  
  // Frog state
  frogPosition: THREE.Vector3;
  frogVelocity: THREE.Vector3;
  isJumping: boolean;
  isCharging: boolean;
  chargeAmount: number;
  isOnLilyPad: boolean;
  currentLilyPadId: string | null;
  
  // Lily pads
  lilyPads: LilyPadData[];
  
  // Input state
  jumpKeyPressed: boolean;
  chargeStartTime: number;
  
  // Actions
  startGame: () => void;
  endGame: () => void;
  restartGame: () => void;
  
  // Frog actions
  setFrogPosition: (position: THREE.Vector3) => void;
  setFrogVelocity: (velocity: THREE.Vector3) => void;
  setIsJumping: (jumping: boolean) => void;
  setIsCharging: (charging: boolean) => void;
  setChargeAmount: (amount: number) => void;
  setIsOnLilyPad: (onPad: boolean, padId?: string) => void;
  
  // Input actions
  setJumpKeyPressed: (pressed: boolean) => void;
  setChargeStartTime: (time: number) => void;
  
  // Game actions
  addScore: (points: number) => void;
  incrementConsecutiveJumps: () => void;
  resetConsecutiveJumps: () => void;
  generateLilyPads: () => void;
  updateLilyPads: (deltaTime: number) => void;
}

export const useFrogGame = create<FrogGameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    phase: "ready",
    score: 0,
    consecutiveJumps: 0,
    multiplier: 1,
    
    frogPosition: new THREE.Vector3(0, 1, 0),
    frogVelocity: new THREE.Vector3(0, 0, 0),
    isJumping: false,
    isCharging: false,
    chargeAmount: 0,
    isOnLilyPad: true,
    currentLilyPadId: "start",
    
    lilyPads: [],
    
    jumpKeyPressed: false,
    chargeStartTime: 0,
    
    // Actions
    startGame: () => {
      set((state) => {
        if (state.phase === "ready") {
          const newState = {
            phase: "playing" as GamePhase,
            score: 0,
            consecutiveJumps: 0,
            multiplier: 1,
            frogPosition: new THREE.Vector3(0, 1, 0),
            frogVelocity: new THREE.Vector3(0, 0, 0),
            isJumping: false,
            isCharging: false,
            chargeAmount: 0,
            isOnLilyPad: true,
            currentLilyPadId: "start",
            jumpKeyPressed: false,
            chargeStartTime: 0,
          };
          
          // Generate initial lily pads
          setTimeout(() => {
            get().generateLilyPads();
          }, 0);
          
          return newState;
        }
        return {};
      });
    },
    
    endGame: () => {
      set((state) => {
        if (state.phase === "playing") {
          return { phase: "gameOver" };
        }
        return {};
      });
    },
    
    restartGame: () => {
      set(() => ({
        phase: "ready",
        score: 0,
        consecutiveJumps: 0,
        multiplier: 1,
        frogPosition: new THREE.Vector3(0, 1, 0),
        frogVelocity: new THREE.Vector3(0, 0, 0),
        isJumping: false,
        isCharging: false,
        chargeAmount: 0,
        isOnLilyPad: true,
        currentLilyPadId: "start",
        lilyPads: [],
        jumpKeyPressed: false,
        chargeStartTime: 0,
      }));
    },
    
    // Frog actions
    setFrogPosition: (position) => set({ frogPosition: position }),
    setFrogVelocity: (velocity) => set({ frogVelocity: velocity }),
    setIsJumping: (jumping) => set({ isJumping: jumping }),
    setIsCharging: (charging) => set({ isCharging: charging }),
    setChargeAmount: (amount) => set({ chargeAmount: Math.min(Math.max(amount, 0), 1) }),
    setIsOnLilyPad: (onPad, padId) => set({ isOnLilyPad: onPad, currentLilyPadId: padId || null }),
    
    // Input actions
    setJumpKeyPressed: (pressed) => set({ jumpKeyPressed: pressed }),
    setChargeStartTime: (time) => set({ chargeStartTime: time }),
    
    // Game actions
    addScore: (points) => {
      set((state) => ({
        score: state.score + (points * state.multiplier)
      }));
    },
    
    incrementConsecutiveJumps: () => {
      set((state) => {
        const newConsecutive = state.consecutiveJumps + 1;
        const newMultiplier = Math.min(1 + Math.floor(newConsecutive / 3) * 0.5, 3);
        return {
          consecutiveJumps: newConsecutive,
          multiplier: newMultiplier
        };
      });
    },
    
    resetConsecutiveJumps: () => {
      set({ consecutiveJumps: 0, multiplier: 1 });
    },
    
    generateLilyPads: () => {
      const pads: LilyPadData[] = [];
      
      // Starting lily pad
      pads.push({
        id: "start",
        position: new THREE.Vector3(0, 0, 0),
        size: 1.5,
        isMoving: false,
        isDisappearing: false,
      });
      
      // Generate sequential lily pads in a progressive path
      let currentScore = get().score;
      let difficulty = Math.min(Math.floor(currentScore / 50), 10); // Increase difficulty every 50 points
      
      for (let i = 0; i < 25; i++) {
        // Create a progressive path - starts easy, gets harder
        const baseDistance = 3 + (i * 0.3) + (difficulty * 0.2); // Gradually increase distance
        const baseZ = -(i + 1) * baseDistance;
        
        // Create strategic positioning - some easy, some challenging
        let baseX = 0;
        if (i % 3 === 1) {
          baseX = Math.sin(i * 0.6) * (4 + difficulty); // Sine wave pattern
        } else if (i % 3 === 2) {
          baseX = (Math.random() - 0.5) * (6 + difficulty); // Random positioning
        }
        
        // Add manageable randomness
        const x = baseX + (Math.random() - 0.5) * 1.5;
        const z = baseZ + (Math.random() - 0.5) * 1;
        
        // Size gets smaller as difficulty increases, but not too small
        const baseSize = Math.max(1.2 - (difficulty * 0.08), 0.7);
        const size = baseSize + (Math.random() - 0.5) * 0.2;
        
        // Moving pads appear later and become more common with difficulty
        const movingChance = Math.max(0, (i - 8) * 0.02 + difficulty * 0.03);
        const isMoving = Math.random() < movingChance;
        
        // Some pads disappear after being used (advanced mechanic)
        const disappearingChance = Math.max(0, (i - 15) * 0.01 + difficulty * 0.02);
        const isDisappearing = Math.random() < disappearingChance;
        
        pads.push({
          id: `pad-${i}`,
          position: new THREE.Vector3(x, 0, z),
          size,
          isMoving,
          moveDirection: isMoving ? new THREE.Vector3(
            (Math.random() - 0.5) * (0.4 + difficulty * 0.1),
            0,
            (Math.random() - 0.5) * (0.2 + difficulty * 0.05)
          ) : undefined,
          isDisappearing: false, // Will be triggered when landed on
          disappearTime: isDisappearing ? 3000 + Math.random() * 2000 : undefined, // 3-5 seconds
        });
      }
      
      set({ lilyPads: pads });
    },
    
    updateLilyPads: (deltaTime) => {
      set((state) => {
        const updatedPads = state.lilyPads.map(pad => {
          if (pad.isMoving && pad.moveDirection) {
            const newPosition = pad.position.clone();
            newPosition.add(pad.moveDirection.clone().multiplyScalar(deltaTime));
            
            // Keep pads within bounds
            if (Math.abs(newPosition.x) > 12 || Math.abs(newPosition.z) > 12) {
              pad.moveDirection.multiplyScalar(-1);
            } else {
              pad.position.copy(newPosition);
            }
          }
          
          return pad;
        });
        
        return { lilyPads: updatedPads };
      });
    },
  }))
);
