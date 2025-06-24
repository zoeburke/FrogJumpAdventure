import { useFrogGame } from "../lib/stores/useFrogGame";

export default function MultiplierIndicator() {
  const { multiplier, consecutiveJumps } = useFrogGame();
  
  if (multiplier <= 1) return null;
  
  // Calculate progress to next multiplier
  const getProgressToNext = () => {
    if (consecutiveJumps < 6) return (consecutiveJumps - 3) / 3; // 3->6 for 2x
    if (consecutiveJumps < 10) return (consecutiveJumps - 6) / 4; // 6->10 for 3x
    if (consecutiveJumps < 15) return (consecutiveJumps - 10) / 5; // 10->15 for 4x
    return 1; // Max multiplier reached
  };
  
  const getNextMultiplier = () => {
    if (consecutiveJumps < 6) return 2;
    if (consecutiveJumps < 10) return 3;
    if (consecutiveJumps < 15) return 4;
    if (consecutiveJumps < 15) return 5;
    return 5; // Max
  };
  
  const progress = getProgressToNext();
  const nextMultiplier = getNextMultiplier();
  const isMaxed = multiplier >= 5;
  
  return (
    <div className="fixed top-4 right-1/2 transform translate-x-1/2 z-50">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-opacity-90 text-white p-3 rounded-lg text-center min-w-[200px]">
        <div className="text-lg font-bold text-yellow-100">
          {multiplier}x MULTIPLIER
        </div>
        {!isMaxed && (
          <>
            <div className="text-xs mt-1">
              Next: {nextMultiplier}x
            </div>
            <div className="w-full h-2 bg-black bg-opacity-30 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </>
        )}
        {isMaxed && (
          <div className="text-xs mt-1 text-yellow-100">
            MAX MULTIPLIER!
          </div>
        )}
      </div>
    </div>
  );
}