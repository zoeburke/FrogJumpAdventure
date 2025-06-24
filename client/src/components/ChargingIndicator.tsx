import { useFrogGame } from "../lib/stores/useFrogGame";

export default function ChargingIndicator() {
  const { isCharging, chargeAmount } = useFrogGame();
  
  if (!isCharging) return null;
  
  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black bg-opacity-50 rounded-lg p-4">
        <div className="text-white text-sm mb-2 text-center">Jump Power</div>
        <div className="w-48 h-4 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all duration-100"
            style={{ width: `${chargeAmount * 100}%` }}
          />
        </div>
        <div className="text-white text-xs mt-2 text-center">
          {Math.round(chargeAmount * 100)}%
        </div>
      </div>
    </div>
  );
}
