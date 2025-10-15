// Type aliases for better readability
export type GameKey = "S" | "D" | "F" | "G" | "H" | "J" | "K";

// Centralized game configuration constants
export const GAME_CONSTANTS = {
  // Character configuration
  CHARACTER: {
    SPEED: 100,
    WIDTH: 30,
    HEIGHT: 40,
    COLOR: 0x3498db,
    VISUAL_FEEDBACK_COLOR: 0xf39c12,
    VISUAL_FEEDBACK_DURATION: 200,
  },

  // Platform configuration
  PLATFORMS: {
    WIDTH: 120,
    HEIGHT: 20,
    EXTENSION_DISTANCE: 150,
    AHEAD_OFFSET: 20,
    CLEANUP_DISTANCE: 400,
    MIN_LENGTH: 20, // Minimum platform length for quick taps
    GROWTH_RATE: 100, // Pixels per second growth rate (matches character speed)
  },

  // Audio configuration
  AUDIO: {
    NOTE_DURATION: 0.5,
    ATTACK_TIME: 0.01,
    VOLUME: 0.3,
  },

  // Game mechanics
  GAME: {
    OVER_FALL_DISTANCE: 300,
    SCORE_PER_PLATFORM: 10,
    GROUND_OFFSET: 60,
    CHARACTER_HEIGHT_LERP_SPEED: 0.08,
    FALL_VELOCITY: 300,
    CAMERA_DEADZONE_X: 200,
    CAMERA_DEADZONE_Y: 100,
    CAMERA_FOLLOW_LERP_X: 0.1,
    CAMERA_FOLLOW_LERP_Y: 0.1,
  },
  CHORD_DETECTION: {
    ACCUMULATION_TIME: 1000, // ms
    TRIAD_POINTS: 50,
    SEVENTH_POINTS: 100,
    POWER_CHORD_POINTS: 25,
  },

  // Level heights for each key (relative to camera height)
  LEVEL_HEIGHTS: {
    S: -80, // Ground level offset
    D: -120, // Level 2 offset
    F: -160, // Level 3 offset
    G: -200, // Level 4 offset
    H: -240, // Level 5 offset
    J: -280, // Level 6 offset
    K: -320, // Highest level offset
  } as Record<GameKey, number>,

  // Level colors for each key
  LEVEL_COLORS: {
    S: 0xe74c3c, // Red (lowest)
    D: 0xf39c12, // Orange
    F: 0xf1c40f, // Yellow
    G: 0x2ecc71, // Green
    H: 0x3498db, // Blue
    J: 0x9b59b6, // Purple
    K: 0xe91e63, // Pink (highest)
  } as Record<GameKey, number>,

  // Valid game keys
  VALID_KEYS: ["S", "D", "F", "G", "H", "J", "K"] as readonly GameKey[],

  // Error handling
  ERROR_HANDLING: {
    MANAGER_INIT_FAILED: "Failed to initialize managers",
    INPUT_HANDLING_ERROR: "Input handling error",
    PLATFORM_EXTENSION_ERROR: "Platform extension error",
    CHARACTER_HEIGHT_ERROR: "Character height update error",
    PLATFORM_CLEANUP_ERROR: "Platform cleanup error",
    KEY_CHANGE_ERROR: "Key change handling error",
    PLATFORM_START_ERROR: "Failed to start platform",
    PLATFORM_END_ERROR: "Failed to end platform",
  },
} as const;
