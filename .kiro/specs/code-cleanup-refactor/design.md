# Design Document

## Overview

This refactoring effort will clean up the Muse Runner codebase by implementing missing manager classes, fixing TypeScript errors, removing dead code, and establishing proper architectural patterns. The design maintains all existing functionality while improving code organization, type safety, and maintainability.

## Architecture

### Current Issues Identified

1. **Missing Manager Classes**: AudioManager, InputManager, and PlatformManager are referenced but not implemented
2. **TypeScript Errors**: Missing properties (audioContext, noteFrequencies, currentKey), unused variables
3. **Dead Code**: Unused methods, interfaces, and constants
4. **Mixed Concerns**: Main game scene handles audio, input, and platform logic directly
5. **Inconsistent Patterns**: Some functionality duplicated or partially implemented

### Proposed Architecture

```
MuseRunnerGame (Scene)
├── AudioManager (handles all audio/music functionality)
├── InputManager (handles keyboard input state)
├── PlatformManager (handles platform lifecycle)
└── GameState (centralized game state management)
```

## Components and Interfaces

### AudioManager

**Purpose**: Handle all audio-related functionality including note frequencies and Web Audio API management.

**Interface**:

```typescript
interface IAudioManager {
  initialize(): void;
  playNote(key: GameKey): void;
  isAudioAvailable(): boolean;
}
```

**Responsibilities**:

- Manage Web Audio API context
- Define note frequencies for each game key
- Play musical tones with proper envelope
- Handle audio initialization failures gracefully

### InputManager

**Purpose**: Track keyboard input state and detect key press/release changes.

**Interface**:

```typescript
interface IInputManager {
  initialize(): void;
  update(currentTime: number): { keyStateChanged: boolean };
  getInputState(): { pressedKeys: Set<string> };
}
```

**Responsibilities**:

- Track currently pressed keys
- Detect when key state changes
- Provide clean interface for querying input state
- Handle multiple simultaneous key presses

### PlatformManager

**Purpose**: Manage the lifecycle of musical platforms including creation, extension, and cleanup.

**Interface**:

```typescript
interface IPlatformManager {
  initialize(): void;
  startNewPlatform(key: GameKey, startX: number): void;
  endPlatform(key: GameKey): void;
  extendActivePlatforms(characterX: number): void;
  getHighestActiveKey(): GameKey | null;
  hasActivePlatforms(): boolean;
  cleanupOldPlatforms(characterX: number): void;
  getActivePlatforms(): Map<string, any>;
  getPlatformsGroup(): Phaser.GameObjects.Group;
}
```

**Responsibilities**:

- Create platforms at correct heights and colors
- Extend platforms as character moves
- Track active platforms by key
- Clean up old platforms for performance
- Determine highest active platform for character positioning

### GameState Management

**Purpose**: Centralize game state and reduce coupling between components.

**Properties**:

- Game running state
- Score tracking
- Character reference
- UI element references

## Data Models

### GameKey Type

```typescript
type GameKey = "S" | "D" | "F" | "G" | "H" | "J" | "K";
```

### Game Constants

Consolidate all game constants into a single, well-organized structure:

```typescript
const GAME_CONSTANTS = {
  CHARACTER: {
    SPEED: 100,
    WIDTH: 30,
    HEIGHT: 40,
    COLOR: 0x3498db,
  },
  PLATFORMS: {
    WIDTH: 120,
    HEIGHT: 20,
    EXTENSION_DISTANCE: 150,
  },
  AUDIO: {
    NOTE_DURATION: 0.5,
    ATTACK_TIME: 0.01,
    VOLUME: 0.3,
  },
  LEVEL_HEIGHTS: {
    S: -80,
    D: -120,
    F: -160,
    G: -200,
    H: -240,
    J: -280,
    K: -320,
  },
  LEVEL_COLORS: {
    S: 0xe74c3c,
    D: 0xf39c12,
    F: 0xf1c40f,
    G: 0x2ecc71,
    H: 0x3498db,
    J: 0x9b59b6,
    K: 0xe91e63,
  },
} as const;
```

### Note Frequencies

```typescript
const NOTE_FREQUENCIES: Record<GameKey, number> = {
  S: 261.63, // C4
  D: 293.66, // D4
  F: 329.63, // E4
  G: 349.23, // F4
  H: 392.0, // G4
  J: 440.0, // A4
  K: 493.88, // B4
};
```

## Error Handling

### Audio Fallback Strategy

- Gracefully handle Web Audio API unavailability
- Provide visual feedback when audio fails
- Continue game functionality without audio

### Manager Initialization

- Each manager should initialize independently
- Provide fallback behavior if managers fail to initialize
- Log meaningful error messages for debugging

### Input Validation

- Validate key inputs against allowed game keys
- Handle edge cases in key state transitions
- Prevent invalid platform creation

## Testing Strategy

### Unit Testing Focus Areas

- Manager class functionality
- Game constant validation
- Input state management
- Platform lifecycle operations

### Integration Testing

- Manager interaction with main game scene
- Audio system integration
- Platform creation and cleanup cycles

### Manual Testing Checklist

- All existing gameplay functionality preserved
- No TypeScript compilation errors
- No console errors during normal gameplay
- Smooth character movement and platform interaction
- Proper audio playback (when available)
- Game over conditions work correctly

## Migration Strategy

### Phase 1: Create Manager Classes

1. Implement AudioManager with proper Web Audio API handling
2. Implement InputManager with keyboard state tracking
3. Implement PlatformManager with platform lifecycle management

### Phase 2: Refactor Main Scene

1. Remove direct audio handling from MuseRunnerGame
2. Remove direct input handling from MuseRunnerGame
3. Remove direct platform management from MuseRunnerGame
4. Integrate managers into main game loop

### Phase 3: Clean Up Dead Code

1. Remove unused methods and properties
2. Remove unused interfaces and types
3. Consolidate constants and configuration
4. Fix all TypeScript errors and warnings

### Phase 4: Validation

1. Test all existing functionality
2. Verify no regressions in gameplay
3. Confirm improved code quality metrics
4. Validate error handling scenarios
