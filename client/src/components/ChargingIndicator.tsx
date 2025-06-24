import { useFrogGame } from "../lib/stores/useFrogGame";

export default function ChargingIndicator() {
  const { isCharging, chargeAmount } = useFrogGame();
  
  if (!isCharging) return null;
  
  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black bg-opacity-75 rounded-lg p-3">
        <div className="text-white text-sm mb-2 text-center">Jump Power</div>
        <div className="w-40 h-3 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-50 ease-out"
            style={{ 
              width: `${chargeAmount * 100}%`,
              transition: 'width 0.05s ease-out'
            }}
          />
        </div>
        <div className="text-white text-xs mt-1 text-center">
          {Math.round(chargeAmount * 100)}%
        </div>
      </div>
    </div>
  );
}
