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
      
      // Generate random lily pads
      for (let i = 0; i < 15; i++) {
        const angle = (Math.random() * Math.PI * 2);
        const distance = 3 + Math.random() * 8;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        
        const size = 0.8 + Math.random() * 0.6;
        const isMoving = Math.random() < 0.3; // 30% chance of moving
        
        pads.push({
          id: `pad-${i}`,
          position: new THREE.Vector3(x, 0, z),
          size,
          isMoving,
          moveDirection: isMoving ? new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            0,
            (Math.random() - 0.5) * 0.5
          ) : undefined,
          isDisappearing: false,
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
