# Frog Hopper - 3D Platformer Game

## Overview

Frog Hopper is a 3D platformer game built with React Three Fiber, where players control a frog jumping across lily pads in a pond environment. The game features a charge-and-release jump mechanism using the 'J' key, scoring system with multipliers, and progressively challenging gameplay.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the main application framework
- **React Three Fiber** (@react-three/fiber) for 3D rendering and scene management
- **React Three Drei** (@react-three/drei) for additional 3D utilities and helpers
- **React Three Postprocessing** for visual effects and shaders
- **Vite** as the build tool and development server
- **TailwindCSS** for styling and UI components
- **Radix UI** components for consistent UI elements

### Backend Architecture
- **Express.js** server with TypeScript
- **In-memory storage** using MemStorage class for user data
- **REST API** structure with route registration system
- **Session management** preparation (connect-pg-simple included)

### State Management
- **Zustand** for global state management with two main stores:
  - `useFrogGame`: Manages game state, frog physics, lily pads, scoring
  - `useAudio`: Handles sound effects and background music
  - `useGame`: Basic game phase management

## Key Components

### Game Components
- **FrogGame**: Main game logic and physics loop
- **Frog**: 3D frog character with visual feedback for charging
- **LilyPad**: Interactive platforms with floating animations
- **Water**: Environmental water surface with ripple effects
- **GameUI**: User interface overlay with score, controls, and menus
- **ChargingIndicator**: Visual feedback for jump power

### 3D Scene Setup
- **Canvas**: React Three Fiber canvas with shadows and optimized settings
- **Lighting**: Ambient and directional lighting with shadow mapping
- **Camera**: Positioned for optimal gameplay view (0, 8, 12)
- **Background**: Sky blue color (#87CEEB) for pond atmosphere

### Physics System
- Custom physics implementation for:
  - Frog jumping mechanics with charge-based power
  - Gravity and velocity calculations
  - Collision detection with lily pads
  - Jump trajectory calculations

## Data Flow

1. **Input Handling**: Keyboard events captured at the game level
2. **State Updates**: Zustand stores manage game state changes
3. **Physics Loop**: useFrame hook updates physics at 60fps
4. **Rendering**: React Three Fiber renders 3D scene based on state
5. **UI Updates**: React components re-render based on state changes

### Game Loop
1. Player presses 'J' key to start charging
2. Charge amount increases over time while key is held
3. Player releases 'J' key to execute jump
4. Physics calculates trajectory and movement
5. Collision detection determines landing success
6. Score updates and new lily pads spawn
7. Game continues or ends based on landing outcome

## External Dependencies

### 3D Graphics
- **Three.js** (via React Three Fiber) for WebGL rendering
- **GLTF/GLB** support for 3D models
- **GLSL** shader support via vite-plugin-glsl

### UI Framework
- **Radix UI** primitives for accessible components
- **Lucide React** for icons
- **TailwindCSS** for styling
- **Class Variance Authority** for component variants

### Development Tools
- **TypeScript** for type safety
- **ESBuild** for production builds
- **Vite** for development and hot module replacement

### Database Ready
- **Drizzle ORM** configured for PostgreSQL
- **Neon Database** serverless driver
- Schema defined in shared/schema.ts with user model

## Deployment Strategy

### Build Process
- **Development**: `npm run dev` runs Express server with Vite middleware
- **Production Build**: `npm run build` creates optimized client and server bundles
- **Production Start**: `npm run start` runs the built Express server

### Replit Configuration
- **Auto-deployment** to Replit's autoscale platform
- **Port Configuration**: Internal port 5000 mapped to external port 80
- **Asset Handling**: Support for GLTF, GLB, and audio files
- **Environment**: Node.js 20 with web module support

### File Structure
```
├── client/          # Frontend React application
├── server/          # Express.js backend
├── shared/          # Shared TypeScript types and schemas
├── migrations/      # Database migration files
└── dist/           # Production build output
```

## Changelog
- June 24, 2025: Initial setup and basic frog platformer implementation
- June 24, 2025: Optimized lily pad layout for straight-line progression with achievable jump distances
- June 24, 2025: Improved collision detection and removed automatic snapping
- June 24, 2025: Simplified scoring to 1 point per successful jump
- June 24, 2025: Enhanced UI with proper overlays and polish
- June 24, 2025: Added progressive difficulty and improved camera following

## User Preferences

Preferred communication style: Simple, everyday language.