import { useState } from "react";
import { useFrogGame } from "../lib/stores/useFrogGame";

export default function ActuationGuide() {
  const [isVisible, setIsVisible] = useState(true);
  const { phase, startGame } = useFrogGame();
  
  if (phase !== "ready" || !isVisible) return null;
  
  const handleStartGame = () => {
    setIsVisible(false);
    startGame();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Frog Hopper - Keyboard Actuation Point Tester
        </h1>
        
        <div className="space-y-6">
          {/* What is Actuation Point */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              What is a Keyboard Actuation Point?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The <strong>actuation point</strong> is the exact moment when your keyboard registers that you've pressed a key. 
              It's measured in millimeters of key travel distance. Different keyboards have different actuation points:
            </p>
            <ul className="mt-3 ml-6 space-y-1 text-gray-700">
              <li>• <strong>Mechanical keyboards:</strong> Usually 1.5-2.2mm (very consistent)</li>
              <li>• <strong>Membrane keyboards:</strong> Usually 2.5-4mm (less consistent)</li>
              <li>• <strong>Low-profile keyboards:</strong> Usually 1.2-1.5mm (fast response)</li>
            </ul>
          </section>
          
          {/* Why It Matters */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Why Does This Matter?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Understanding your keyboard's actuation point helps you:
            </p>
            <ul className="mt-3 ml-6 space-y-1 text-gray-700">
              <li>• <strong>Game better:</strong> Know exactly when inputs register</li>
              <li>• <strong>Type faster:</strong> Avoid pressing keys too hard or soft</li>
              <li>• <strong>Reduce fatigue:</strong> Use just enough pressure</li>
              <li>• <strong>Choose keyboards:</strong> Pick one that matches your style</li>
            </ul>
          </section>
          
          {/* How to Test */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              How to Test Your Keyboard with This Game
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-3">
                This game uses precise timing to help you understand your keyboard's actuation point:
              </p>
              <ol className="ml-6 space-y-2 text-gray-700">
                <li><strong>1. Light Touch Test:</strong> Try barely pressing the 'J' key. Does it register?</li>
                <li><strong>2. Timing Test:</strong> Hold 'J' and release quickly. Notice the exact moment it registers.</li>
                <li><strong>3. Consistency Test:</strong> Repeat the same pressure multiple times. Is the timing consistent?</li>
                <li><strong>4. Pressure Mapping:</strong> Try different pressure levels to find your keyboard's sweet spot.</li>
              </ol>
            </div>
          </section>
          
          {/* Game Controls */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Game Controls
            </h2>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>J Key:</strong> Hold to charge jump power, release to jump
              </p>
              <p className="text-gray-700 text-sm">
                The charging bar shows exactly when your key press is detected and how long you hold it. 
                Use this visual feedback to understand your keyboard's behavior!
              </p>
            </div>
          </section>
        </div>
        
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleStartGame}
            className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Start Testing My Keyboard!
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Skip Guide
          </button>
        </div>
      </div>
    </div>
  );
}