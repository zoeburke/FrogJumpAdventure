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
      {/* Score Display */}
      {phase === "playing" && (
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-black bg-opacity-75 text-white p-3 rounded-lg">
            <div className="text-xl font-bold">Score: {score}</div>
          </div>
        </div>
      )}
      
      {/* Audio Toggle */}
      <button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 bg-black bg-opacity-75 text-white p-3 rounded-lg hover:bg-opacity-90 transition-opacity"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
      
      {/* Instructions */}
      {phase === "playing" && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm text-center">
            Hold <strong>J</strong> to charge jump, release to hop!
          </div>
        </div>
      )}
      
      {/* Game over screen */}
      {phase === "gameOver" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center max-w-md">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Game Over!</h2>
            <p className="text-gray-700 mb-2">Final Score: <strong>{score}</strong></p>
            <p className="text-gray-700 mb-6">Lily Pads Reached: <strong>{score}</strong></p>
            <button
              onClick={restartGame}
              className="bg-green-500 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-green-600 transition-colors w-full"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      
      <ChargingIndicator />
    </>
  );
}
