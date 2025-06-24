import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@fontsource/inter";
import FrogGame from "./components/FrogGame";
import GameUI from "./components/GameUI";
import { useFrogGame } from "./lib/stores/useFrogGame";
import { useAudio } from "./lib/stores/useAudio";

const queryClient = new QueryClient();

function App() {
  const { gamePhase } = useFrogGame();
  
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <Canvas
          shadows
          camera={{
            position: [0, 8, 12],
            fov: 45,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "high-performance"
          }}
        >
          <color attach="background" args={["#87CEEB"]} />
          
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          
          <Suspense fallback={null}>
            <FrogGame />
          </Suspense>
        </Canvas>
        
        <GameUI />
      </div>
    </QueryClientProvider>
  );
}

export default App;
