import { useFrogGame } from "../lib/stores/useFrogGame";
import { useAudio } from "../lib/stores/useAudio";
import ChargingIndicator from "./ChargingIndicator";
import MultiplierIndicator from "./MultiplierIndicator";

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
            <div className="text-sm">Streak: {consecutiveJumps}</div>
            {multiplier > 1 && (
              <div className="text-sm text-yellow-300 font-bold">
                {multiplier}x Multiplier!
              </div>
            )}
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
          <div className="bg-white p-8 rounded-lg text-center max-w-md shadow-2xl">
            <h2 className="text-4xl font-bold text-red-600 mb-6">Game Over!</h2>
            
            {/* Score Section */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="text-3xl font-bold text-gray-800 mb-2">{score}</div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>
            
            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xl font-bold text-blue-600">{consecutiveJumps}</div>
                <div className="text-xs text-blue-500">Best Streak</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-xl font-bold text-yellow-600">{multiplier}x</div>
                <div className="text-xs text-yellow-500">Max Multiplier</div>
              </div>
            </div>
            
            {/* Performance Message */}
            <div className="mb-6">
              {consecutiveJumps >= 15 && (
                <p className="text-green-600 font-semibold">🏆 Incredible! You reached the maximum multiplier!</p>
              )}
              {consecutiveJumps >= 10 && consecutiveJumps < 15 && (
                <p className="text-blue-600 font-semibold">🎯 Excellent streak! You're getting close to max multiplier!</p>
              )}
              {consecutiveJumps >= 6 && consecutiveJumps < 10 && (
                <p className="text-purple-600 font-semibold">🔥 Great job! You unlocked the 3x multiplier!</p>
              )}
              {consecutiveJumps >= 3 && consecutiveJumps < 6 && (
                <p className="text-orange-600 font-semibold">⭐ Nice work! You reached the 2x multiplier!</p>
              )}
              {consecutiveJumps < 3 && (
                <p className="text-gray-600">Keep practicing to unlock multipliers!</p>
              )}
            </div>
            
            <button
              onClick={restartGame}
              className="bg-green-500 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-green-600 transition-colors w-full shadow-lg"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      
      <ChargingIndicator />
      <MultiplierIndicator />
    </>
  );
}
