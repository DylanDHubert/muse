import { Scene } from "phaser";
import * as Phaser from "phaser";
import { AudioManager } from "../audio/AudioManager";
import { InputManager } from "../input/InputManager";
import { PlatformManager } from "../platform/PlatformManager";
import { ChordDetector } from "../audio/ChordDetector";
import { GAME_CONSTANTS, GameKey } from "../config/GameConstants";

export class MuseRunnerGame extends Scene {
  private character!: Phaser.GameObjects.Image;
  private scoreText!: Phaser.GameObjects.Text;

  // Game state
  private isGameRunning: boolean = false;
  private score: number = 0;

  // Managers
  private audioManager!: AudioManager;
  private inputManager!: InputManager;
  private platformManager!: PlatformManager;
  private chordDetector!: ChordDetector;

  constructor() {
    super("MuseRunnerGame");
  }

  async create(): Promise<void> {
    const { width, height } = this.cameras.main;

    // Initialize managers with error handling
    try {
      this.audioManager = new AudioManager();
      this.inputManager = new InputManager(this);
      this.platformManager = new PlatformManager(this);
      this.chordDetector = new ChordDetector(this);

      // Initialize managers with error handling
      this.audioManager.initialize();
      this.inputManager.initialize();
      this.platformManager.initialize();

      // All managers initialized successfully
    } catch (error) {
      console.error(GAME_CONSTANTS.ERROR_HANDLING.MANAGER_INIT_FAILED, error);
      // Game can still continue with degraded functionality
    }

    // Create character using player.png image
    this.character = this.add.image(
      100,
      height - 80,
      "player"
    );
    this.character.setDepth(1000); // Ensure character appears above platforms
    this.physics.add.existing(this.character);
    const characterBody = this.character.body as Phaser.Physics.Arcade.Body;

    // Set up physics for endless running - no collision needed
    characterBody.setCollideWorldBounds(false);
    characterBody.setDragX(0);
    characterBody.setFrictionX(0);
    characterBody.setGravityY(0); // No gravity - character rides platforms directly

    // Create UI - make sure it's visible and doesn't scroll
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "24px",
      color: "#ffffff",
      fontFamily: "Nabla, system-ui",
      stroke: "#000000",
      strokeThickness: 2,
    });
    this.scoreText.setScrollFactor(0); // Don't scroll with camera

    // REMOVED: Instructions and key guide UI elements

    // Controls info
    this.add
      .text(width - 16, 16, "v0.0.4 | ESC: Menu | R: Restart", {
        fontSize: "14px",
        color: "#95a5a6",
        fontFamily: "Nabla, system-ui",
      })
      .setOrigin(1, 0)
      .setScrollFactor(0); // Don't scroll with camera

    // ESC key to return to menu
    this.input.keyboard!.on("keydown-ESC", () => {
      this.scene.start("MainMenu");
    });

    // R key to restart
    this.input.keyboard!.on("keydown-R", () => {
      this.scene.restart();
    });

    // Start the game
    this.isGameRunning = true;

    // Camera follows character
    this.cameras.main.startFollow(
      this.character,
      true,
      GAME_CONSTANTS.GAME.CAMERA_FOLLOW_LERP_X,
      GAME_CONSTANTS.GAME.CAMERA_FOLLOW_LERP_Y,
    );
    this.cameras.main.setDeadzone(
      GAME_CONSTANTS.GAME.CAMERA_DEADZONE_X,
      GAME_CONSTANTS.GAME.CAMERA_DEADZONE_Y,
    );

    // Reset game state
    this.score = 0;

    // Don't start with any musical platform - wait for first key press
  }

  override update(): void {
    if (!this.isGameRunning) return;

    // Auto-run character forward - ALWAYS moving, never stops
    const characterBody = this.character.body as Phaser.Physics.Arcade.Body;

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

      // Update chord detection
      const chordResult = this.chordDetector.update(inputState.pressedKeys);
      if (chordResult.points > 0) {
        this.score += chordResult.points;
        this.scoreText.setText(`Score: ${Math.floor(this.score)}`);
        
        // Show chord name and points if detected (only show when points are earned)
        if (chordResult.chordName && chordResult.points > 0) {
          this.showChordName(chordResult.chordName, chordResult.points);
        }
      }
    } catch (error) {
      console.warn(GAME_CONSTANTS.ERROR_HANDLING.INPUT_HANDLING_ERROR, error);
    }

    // Extend all active platforms as character moves with error handling
    try {
      if (this.platformManager.hasActivePlatforms()) {
        this.platformManager.extendActivePlatforms(this.character.x);
      }
    } catch (error) {
      console.warn(GAME_CONSTANTS.ERROR_HANDLING.PLATFORM_EXTENSION_ERROR, error);
    }

    // Make character ride the highest active platform with error handling
    try {
      this.updateCharacterHeight();
    } catch (error) {
      console.warn(GAME_CONSTANTS.ERROR_HANDLING.CHARACTER_HEIGHT_ERROR, error);
    }

    // Character position tracking removed for performance

    // Game over condition - only if character falls WAY off screen (make it more lenient)
    if (
      this.character.y >
      this.cameras.main.height + GAME_CONSTANTS.GAME.OVER_FALL_DISTANCE
    ) {
      // Game over triggered - character fell too far
      this.gameOver();
    }

    // Clean up old platforms through platform manager with error handling
    try {
      this.platformManager.cleanupOldPlatforms(this.character.x);
    } catch (error) {
      console.warn(GAME_CONSTANTS.ERROR_HANDLING.PLATFORM_CLEANUP_ERROR, error);
    }
  }

  private handleKeyChanges(currentlyPressedKeys: Set<string>): void {
    try {
      const activePlatforms = this.platformManager.getActivePlatforms();

      // Start new platforms for newly pressed keys
      currentlyPressedKeys.forEach((key) => {
        if (this.isValidGameKey(key) && !activePlatforms.has(key)) {
          try {
            this.platformManager.startNewPlatform(key, this.character.x);
            this.audioManager.playNote(key);
            // Platform started for key

            // Visual feedback - scale character briefly
            this.character.setScale(1.2);
            this.time.delayedCall(
              GAME_CONSTANTS.CHARACTER.VISUAL_FEEDBACK_DURATION,
              () => {
                this.character.setScale(1.0); // Back to normal size
              },
            );

            this.score += GAME_CONSTANTS.GAME.SCORE_PER_PLATFORM;
            this.scoreText.setText(`Score: ${Math.floor(this.score)}`);
          } catch (error) {
            console.warn(`${GAME_CONSTANTS.ERROR_HANDLING.PLATFORM_START_ERROR} for key ${key}:`, error);
          }
        }
      });

      // End platforms for released keys
      activePlatforms.forEach((_platformData, key) => {
        if (!currentlyPressedKeys.has(key)) {
          try {
            this.platformManager.endPlatform(key as GameKey);
            // Platform ended for key
          } catch (error) {
            console.warn(`${GAME_CONSTANTS.ERROR_HANDLING.PLATFORM_END_ERROR} for key ${key}:`, error);
          }
        }
      });
    } catch (error) {
      console.error(GAME_CONSTANTS.ERROR_HANDLING.KEY_CHANGE_ERROR, error);
    }
  }

  private isValidGameKey(key: string): key is GameKey {
    return GAME_CONSTANTS.VALID_KEYS.includes(key as GameKey);
  }

  private updateCharacterHeight(): void {
    const characterBody = this.character.body as Phaser.Physics.Arcade.Body;

    // Get the highest active key to determine target height
    const highestKey = this.platformManager.getHighestActiveKey();

    if (highestKey) {
      // Calculate target Y based on the highest active key
      const { height } = this.cameras.main;
      const targetY = height + GAME_CONSTANTS.LEVEL_HEIGHTS[highestKey];
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

  private showChordName(chordName: string, points: number): void {
    // Remove any existing chord name text
    this.children.list.forEach(child => {
      if (child.name === 'chordName') {
        child.destroy();
      }
    });

    // Get current chord data to show accumulated points
    const currentChord = this.chordDetector.getCurrentChord();
    const accumulatedPoints = currentChord ? currentChord.accumulatedPoints : 0;

    // Create new chord name text - position relative to camera viewport
    const chordText = this.add.text(
      this.cameras.main.width / 2,
      100,
      `${chordName} ${accumulatedPoints}/${currentChord?.basePoints || 0}`,
      {
        fontSize: "32px",
        color: "#f39c12",
        fontFamily: "Nabla, system-ui",
        stroke: "#000000",
        strokeThickness: 2,
      }
    );
    chordText.setOrigin(0.5);
    chordText.setScrollFactor(0);
    chordText.name = 'chordName';

    // Animate the chord name
    this.tweens.add({
      targets: chordText,
      alpha: 0,
      y: chordText.y - 50,
      duration: 2000,
      ease: "Power2",
      onComplete: () => chordText.destroy(),
    });
  }

  private gameOver(): void {
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
