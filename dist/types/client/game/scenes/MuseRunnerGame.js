import { Scene } from "phaser";
import * as Phaser from "phaser";
import { AudioManager } from "../audio/AudioManager";
import { InputManager } from "../input/InputManager";
import { PlatformManager } from "../platform/PlatformManager";
import { GAME_CONSTANTS } from "../config/GameConstants";
export class MuseRunnerGame extends Scene {
  character;
  scoreText;
  // Game state
  isGameRunning = false;
  score = 0;
  // Managers
  audioManager;
  inputManager;
  platformManager;
  constructor() {
    super("MuseRunnerGame");
  }
  async create() {
    const { width, height } = this.cameras.main;
    // Initialize managers with error handling
    try {
      this.audioManager = new AudioManager();
      this.inputManager = new InputManager(this);
      this.platformManager = new PlatformManager(this);
      // Initialize managers with error handling
      this.audioManager.initialize();
      this.inputManager.initialize();
      this.platformManager.initialize();
      console.log("All managers initialized successfully");
    } catch (error) {
      console.error("Failed to initialize managers:", error);
      // Game can still continue with degraded functionality
    }
    // Create character (blue rectangle) - positioned on the neutral platform
    this.character = this.add.rectangle(
      100,
      height - 80,
      GAME_CONSTANTS.CHARACTER.WIDTH,
      GAME_CONSTANTS.CHARACTER.HEIGHT,
      GAME_CONSTANTS.CHARACTER.COLOR,
    );
    this.physics.add.existing(this.character);
    const characterBody = this.character.body;
    // Set up physics for endless running - no collision needed
    characterBody.setCollideWorldBounds(false);
    characterBody.setDragX(0);
    characterBody.setFrictionX(0);
    characterBody.setGravityY(0); // No gravity - character rides platforms directly
    // Create UI
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "24px",
      color: "#ffffff",
    });
    // Instructions
    const instructionText = this.add
      .text(
        width / 2,
        30,
        "🎵 Press S-D-F-G-H-J-K to create platforms at different heights! 🎵",
        {
          fontSize: "16px",
          color: "#ecf0f1",
          fontFamily: "Arial, sans-serif",
        },
      )
      .setOrigin(0.5);
    // Key guide
    this.add
      .text(width / 2, 60, "S=Low → D → F → G → H → J → K=High", {
        fontSize: "14px",
        color: "#95a5a6",
        fontFamily: "Arial, sans-serif",
      })
      .setOrigin(0.5);
    // Make instructions pulse to draw attention
    this.tweens.add({
      targets: instructionText,
      alpha: 0.6,
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });
    // Controls info
    this.add
      .text(width - 16, 16, "v0.0.4 | ESC: Menu | R: Restart", {
        fontSize: "14px",
        color: "#95a5a6",
      })
      .setOrigin(1, 0);
    // ESC key to return to menu
    this.input.keyboard.on("keydown-ESC", () => {
      this.scene.start("MainMenu");
    });
    // R key to restart
    this.input.keyboard.on("keydown-R", () => {
      this.scene.restart();
    });
    // Start the game
    this.isGameRunning = true;
    // Camera follows character
    this.cameras.main.startFollow(this.character, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(200, 100);
    // Reset game state
    this.score = 0;
    // Don't start with any musical platform - wait for first key press
  }
  update() {
    if (!this.isGameRunning) return;
    // Auto-run character forward - ALWAYS moving, never stops
    const characterBody = this.character.body;
    // Force constant forward movement - override any physics that might stop it
    characterBody.setVelocityX(GAME_CONSTANTS.CHARACTER.SPEED);
    characterBody.setDragX(0); // No drag to slow down
    characterBody.setFrictionX(0); // No friction from platforms
    // Handle input for multiple simultaneous keys with error handling
    try {
      const { keyStateChanged } = this.inputManager.update(this.time.now);
      const inputState = this.inputManager.getInputState();
      if (keyStateChanged) {
        this.handleKeyChanges(inputState.pressedKeys);
      }
    } catch (error) {
      console.warn("Input handling error:", error);
    }
    // Extend all active platforms as character moves with error handling
    try {
      if (this.platformManager.hasActivePlatforms()) {
        this.platformManager.extendActivePlatforms(this.character.x);
      }
    } catch (error) {
      console.warn("Platform extension error:", error);
    }
    // Make character ride the highest active platform with error handling
    try {
      this.updateCharacterHeight();
    } catch (error) {
      console.warn("Character height update error:", error);
    }
    // Debug: Log character position periodically
    if (Math.floor(this.character.x) % 500 === 0) {
      console.log(
        `Character at X: ${this.character.x}, Y: ${this.character.y}, Game running: ${this.isGameRunning}`,
      );
    }
    // Game over condition - only if character falls WAY off screen (make it more lenient)
    if (
      this.character.y >
      this.cameras.main.height + GAME_CONSTANTS.GAME.OVER_FALL_DISTANCE
    ) {
      console.log("Game over triggered - character fell too far");
      this.gameOver();
    }
    // Clean up old platforms through platform manager with error handling
    try {
      this.platformManager.cleanupOldPlatforms(this.character.x);
    } catch (error) {
      console.warn("Platform cleanup error:", error);
    }
  }
  handleKeyChanges(currentlyPressedKeys) {
    try {
      const activePlatforms = this.platformManager.getActivePlatforms();
      // Start new platforms for newly pressed keys
      currentlyPressedKeys.forEach((key) => {
        if (this.isValidGameKey(key) && !activePlatforms.has(key)) {
          try {
            this.platformManager.startNewPlatform(key, this.character.x);
            this.audioManager.playNote(key);
            console.log(`Started platform for ${key}`);
            // Visual feedback - change character color briefly
            this.character.setFillStyle(
              GAME_CONSTANTS.CHARACTER.VISUAL_FEEDBACK_COLOR,
            );
            this.time.delayedCall(
              GAME_CONSTANTS.CHARACTER.VISUAL_FEEDBACK_DURATION,
              () => {
                this.character.setFillStyle(GAME_CONSTANTS.CHARACTER.COLOR); // Back to blue
              },
            );
            this.score += GAME_CONSTANTS.GAME.SCORE_PER_PLATFORM;
            this.scoreText.setText(`Score: ${Math.floor(this.score)}`);
          } catch (error) {
            console.warn(`Failed to start platform for key ${key}:`, error);
          }
        }
      });
      // End platforms for released keys
      activePlatforms.forEach((_platformData, key) => {
        if (!currentlyPressedKeys.has(key)) {
          try {
            this.platformManager.endPlatform(key);
            console.log(`Ended platform for ${key}`);
          } catch (error) {
            console.warn(`Failed to end platform for key ${key}:`, error);
          }
        }
      });
    } catch (error) {
      console.error("Key change handling error:", error);
    }
  }
  isValidGameKey(key) {
    return GAME_CONSTANTS.VALID_KEYS.includes(key);
  }
  updateCharacterHeight() {
    const characterBody = this.character.body;
    // Get the highest active key to determine target height
    const highestKey = this.platformManager.getHighestActiveKey();
    if (highestKey) {
      // Calculate target Y based on the highest active key
      const { height } = this.cameras.main;
      const targetY = height + GAME_CONSTANTS.LEVEL_HEIGHTS[highestKey] - 10;
      const currentY = this.character.y;
      const heightDiff = targetY - currentY;
      // Very smooth transition with slower lerp
      if (Math.abs(heightDiff) > 0.5) {
        // Use slower lerp for ultra-smooth movement
        const newY = Phaser.Math.Linear(
          currentY,
          targetY,
          GAME_CONSTANTS.GAME.CHARACTER_HEIGHT_LERP_SPEED,
        );
        this.character.y = newY;
        characterBody.setVelocityY(0); // Override physics velocity
      } else {
        // Close enough, lock to platform
        this.character.y = targetY;
        characterBody.setVelocityY(0);
      }
    } else {
      // No active platforms - fall down smoothly to ground
      const { height } = this.cameras.main;
      const groundY = height - GAME_CONSTANTS.GAME.GROUND_OFFSET;
      if (this.character.y < groundY) {
        characterBody.setVelocityY(GAME_CONSTANTS.GAME.FALL_VELOCITY); // Fall down
      } else {
        this.character.y = groundY; // Hit ground
        characterBody.setVelocityY(0);
      }
    }
  }
  gameOver() {
    this.isGameRunning = false;
    const { width, height } = this.cameras.main;
    // Stop camera follow
    this.cameras.main.stopFollow();
    // Game over screen
    const gameOverBg = this.add.rectangle(
      this.cameras.main.scrollX + width / 2,
      this.cameras.main.scrollY + height / 2,
      width,
      height,
      0x000000,
      0.8,
    );
    gameOverBg.setScrollFactor(0);
    this.add
      .text(
        this.cameras.main.scrollX + width / 2,
        this.cameras.main.scrollY + height / 2 - 80,
        "Game Over!",
        {
          fontSize: "48px",
          color: "#e74c3c",
          fontFamily: "Arial, sans-serif",
        },
      )
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.add
      .text(
        this.cameras.main.scrollX + width / 2,
        this.cameras.main.scrollY + height / 2 - 20,
        `Final Score: ${Math.floor(this.score)}`,
        {
          fontSize: "24px",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        },
      )
      .setOrigin(0.5)
      .setScrollFactor(0);
    const restartText = this.add
      .text(
        this.cameras.main.scrollX + width / 2,
        this.cameras.main.scrollY + height / 2 + 30,
        "Press R to restart or ESC for menu",
        {
          fontSize: "18px",
          color: "#bdc3c7",
          fontFamily: "Arial, sans-serif",
        },
      )
      .setOrigin(0.5)
      .setScrollFactor(0);
    // Pulsing restart text
    this.tweens.add({
      targets: restartText,
      alpha: 0.5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
    // Send score to parent (Reddit)
    if (window.parent) {
      window.parent.postMessage(
        {
          type: "GAME_OVER",
          data: { finalScore: Math.floor(this.score) },
        },
        "*",
      );
    }
  }
}
//# sourceMappingURL=MuseRunnerGame.js.map
