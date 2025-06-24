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
  subscribeWithSelector((set, get) => {
    // Initialize lily pads immediately
    const initialLilyPads: LilyPadData[] = [];
    
    // Starting lily pad
    initialLilyPads.push({
      id: "start",
      position: new THREE.Vector3(0, 0, 0),
      size: 1.5,
      isMoving: false,
      isDisappearing: false,
    });
    
    // Generate lily pads in a straight line with varying distances
    const jumpDistances = [4, 6, 8, 5, 7, 9, 6, 8, 10, 7, 9, 11, 8, 10, 9, 7, 11, 8, 6, 10, 9, 8, 7, 11, 10];
    let currentZ = 0;
    
    for (let i = 0; i < 25; i++) {
      currentZ -= jumpDistances[i];
      const size = 1.0 + (Math.random() - 0.5) * 0.3;
      
      initialLilyPads.push({
        id: `pad-${i}`,
        position: new THREE.Vector3(0, 0, currentZ),
        size,
        isMoving: false,
        isDisappearing: false,
      });
    }

    return {
      // Initial state
      phase: "playing",
      score: 0,
      consecutiveJumps: 0,
      multiplier: 1,
      
      frogPosition: new THREE.Vector3(0, 0.8, 0),
      frogVelocity: new THREE.Vector3(0, 0, 0),
      isJumping: false,
      isCharging: false,
      chargeAmount: 0,
      isOnLilyPad: true,
      currentLilyPadId: "start",
      
      lilyPads: initialLilyPads,
      
      jumpKeyPressed: false,
      chargeStartTime: 0,
    
    // Actions
    startGame: () => {
      set(() => ({
        phase: "playing" as GamePhase,
        score: 0,
        consecutiveJumps: 0,
        multiplier: 1,
        frogPosition: new THREE.Vector3(0, 0.8, 0),
        frogVelocity: new THREE.Vector3(0, 0, 0),
        isJumping: false,
        isCharging: false,
        chargeAmount: 0,
        isOnLilyPad: true,
        currentLilyPadId: "start",
        jumpKeyPressed: false,
        chargeStartTime: 0,
      }));
      
      // Generate initial lily pads
      setTimeout(() => {
        get().generateLilyPads();
      }, 0);
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
        phase: "playing",
        score: 0,
        consecutiveJumps: 0,
        multiplier: 1,
        frogPosition: new THREE.Vector3(0, 0.8, 0),
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
      
      // Generate lily pads immediately for restart
      setTimeout(() => {
        get().generateLilyPads();
      }, 0);
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
        score: state.score + points // Simple addition, no multiplier
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
      
      // Generate lily pads in a straight line with varying distances
      // Frog's max jump is about 15 units (5 base + 10 max charge), so we keep distances under 12
      const jumpDistances = [4, 6, 8, 5, 7, 9, 6, 8, 10, 7, 9, 11, 8, 10, 9, 7, 11, 8, 6, 10, 9, 8, 7, 11, 10];
      
      let currentZ = 0;
      
      for (let i = 0; i < 25; i++) {
        currentZ -= jumpDistances[i]; // Move forward by jump distance
        
        const size = 1.0 + (Math.random() - 0.5) * 0.3; // Consistent size with small variation
        
        pads.push({
          id: `pad-${i}`,
          position: new THREE.Vector3(0, 0, currentZ), // Straight line at x=0
          size,
          isMoving: false, // Remove moving pads for easier gameplay
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
  };
  })
);
