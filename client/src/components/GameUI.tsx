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
      {/* Game HUD */}
      {phase === "playing" && (
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-black bg-opacity-50 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">Score: {score}</div>
            <div className="text-sm">Consecutive: {consecutiveJumps}</div>
            <div className="text-sm">Multiplier: x{multiplier.toFixed(1)}</div>
          </div>
        </div>
      )}
      
      {/* Audio toggle */}
      <button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 bg-black bg-opacity-50 text-white p-3 rounded-lg hover:bg-opacity-70 transition-colors"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
      
      {/* Start screen */}
      {phase === "ready" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center max-w-md">
            <h1 className="text-4xl font-bold text-green-600 mb-4">🐸 Frog Hopper</h1>
            <p className="text-gray-700 mb-6">
              Jump across lily pads to score points!<br/>
              Hold <strong>J</strong> to charge your jump, release to hop!
            </p>
            <button
              onClick={startGame}
              className="bg-green-500 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-green-600 transition-colors"
            >
              Start Game
            </button>
          </div>
        </div>
      )}
      
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
      
      {/* Instructions */}
      {phase === "playing" && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
            Hold <strong>J</strong> to charge jump, release to hop!
          </div>
        </div>
      )}
      
      <ChargingIndicator />
    </>
  );
}
