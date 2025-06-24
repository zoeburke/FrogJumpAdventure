import { useFrogGame } from "../lib/stores/useFrogGame";
import { useAudio } from "../lib/stores/useAudio";
import ChargingIndicator from "./ChargingIndicator";

export default function GameUI() {
  const { 
    phase, 
    score, 
    consecutiveJumps, 
    multiplier, 
    startGame, 
    restartGame 
  } = useFrogGame();
  
  const { toggleMute, isMuted } = useAudio();
  
  return (
    <>

      

      

      
      {/* Game over screen */}
      {phase === "gameOver" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center max-w-md">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Game Over!</h2>
            <p className="text-gray-700 mb-2">Final Score: <strong>{score}</strong></p>
            <p className="text-gray-700 mb-6">Best Streak: <strong>{consecutiveJumps}</strong></p>
            <div className="space-y-3">
              <button
                onClick={restartGame}
                className="bg-green-500 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-green-600 transition-colors w-full"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
      

      
      <ChargingIndicator />
    </>
  );
}
