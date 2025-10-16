import { Scene } from "phaser";
import * as Phaser from "phaser";
import { AudioManager } from "../audio/AudioManager";
import { InputManager } from "../input/InputManager";
import { PlatformManager } from "../platform/PlatformManager";
import { ChordDetector } from "../audio/ChordDetector";
import { SynthControlPanel } from "../ui/SynthControlPanel";
import { GAME_CONSTANTS, GameKey } from "../config/GameConstants";

export class MuseRunnerGame extends Scene {
  private character!: Phaser.GameObjects.Image;
  private scoreText!: Phaser.GameObjects.Text;

  // Game state
  private isGameRunning: boolean = false;
  private score: number = 0;
  
  // GROUND MECHANICS STATE
  private isGrounded: boolean = false;
  private groundStartTime: number = 0;
  private lastScoreDecayTime: number = 0;
  
  // SYNTHESIS PARAMETER DISPLAY
  private synthControlPanel!: SynthControlPanel;
  
  // FLOATING POINTS SYSTEM
  private floatingPoints: Phaser.GameObjects.Text[] = [];
  private floatingPointsFrameCount: number = 0;
  
  // CHORD DETECTION TRACKING
  private lastDetectedChord: string | null = null;
  
  // MATHEMATICAL VISUAL BOX
  private mathVisualBox!: Phaser.GameObjects.Rectangle;
  private chordDisplayText!: Phaser.GameObjects.Text;
  private chordProgressBar!: Phaser.GameObjects.Rectangle;
  
  // GROUND VISUAL
  private groundVisual!: Phaser.GameObjects.Rectangle;
  
  // MATHEMATICAL BACKGROUND
  private mathBackground!: Phaser.GameObjects.Graphics;
  private backgroundData: number[][] = [];

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
    this.character.setOrigin(0.5, 1); // BOTTOM CENTER ANCHOR - character's bottom touches platforms
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

    // CREATE SYNTHESIS PARAMETER DISPLAY
    this.synthControlPanel = new SynthControlPanel(this, this.audioManager, {
      x: 16,
      y: 50,
      width: 500,
      height: 100
    });
    this.synthControlPanel.create();

    // CREATE MATHEMATICAL VISUAL BOX AT BOTTOM
    this.createMathVisualBox();

    // REMOVED: Instructions and key guide UI elements

    // Controls info
    this.add
      .text(width - 16, 16, "v0.0.4 | ESC: Menu | T: Restart", {
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

    // T key to restart (R is now used for D# note)
    this.input.keyboard!.on("keydown-T", () => {
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

    // ADD RESPONSIVE LAYOUT LISTENER
    this.scale.on("resize", (gameSize: Phaser.Structs.Size) => {
      this.synthControlPanel.updateLayout();
    });

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
      const arrowKeys = this.inputManager.getArrowKeyState();

      // SYNTHESIS CONTROLS (NUMBER KEYS)
      if (inputState.pressedKeys.has("5")) {
        this.audioManager.updateLFORate(-0.1); // DECREASE LFO RATE
        console.log("🎛️ Key 5 pressed - LFO Rate decreased");
      }
      if (inputState.pressedKeys.has("6")) {
        this.audioManager.updateLFORate(0.1); // INCREASE LFO RATE
        console.log("🎛️ Key 6 pressed - LFO Rate increased");
      }
      if (inputState.pressedKeys.has("7")) {
        this.audioManager.updateChorusDepth(-0.05); // DECREASE CHORUS DEPTH
        console.log("🎛️ Key 7 pressed - Chorus Depth decreased");
      }
      if (inputState.pressedKeys.has("8")) {
        this.audioManager.updateChorusDepth(0.05); // INCREASE CHORUS DEPTH
        console.log("🎛️ Key 8 pressed - Chorus Depth increased");
      }
      if (inputState.pressedKeys.has("1")) {
        this.audioManager.updateDelayVolume(-0.05); // DECREASE DELAY VOLUME
      }
      if (inputState.pressedKeys.has("2")) {
        this.audioManager.updateDelayVolume(0.05); // INCREASE DELAY VOLUME
      }
      if (inputState.pressedKeys.has("3")) {
        this.audioManager.updateReverbAmount(-0.05); // DECREASE REVERB
      }
      if (inputState.pressedKeys.has("4")) {
        this.audioManager.updateReverbAmount(0.05); // INCREASE REVERB
      }
      // WAVEFORM SWITCHING (ONLY ON KEY PRESS, NOT HOLD)
      if (keyStateChanged && inputState.pressedKeys.has("0")) {
        this.audioManager.switchWaveform(); // SWITCH WAVEFORM
        console.log("🎛️ Key 0 pressed - Waveform switched");
      }

      // UPDATE SYNTHESIS PARAMETER DISPLAY
      this.updateSynthesisDisplay();

      if (keyStateChanged) {
        this.handleKeyChanges(inputState.pressedKeys);
      }

      // Update chord detection
      const chordResult = this.chordDetector.update(inputState.pressedKeys);
      
      // RESET CHORD TRACKING IF NO CHORD DETECTED
      if (!chordResult.chordName) {
        this.lastDetectedChord = null;
      }
      
      if (chordResult.points > 0) {
        this.score += chordResult.points;
        this.scoreText.setText(`Score: ${Math.floor(this.score)}`);
        
        // SHOW FLOATING POINTS FOR CHORD POINTS (FIXED SCREEN POSITION)
        const currentChord = this.chordDetector.getCurrentChord();
        if (currentChord) {
          this.showFloatingPoints(currentChord.accumulatedPoints, this.cameras.main.width / 2, this.cameras.main.height / 2);
        }
        
        // UPDATE MATH VISUAL BOX
        this.updateMathVisualBox(chordResult.chordName, chordResult.points);
        
        // SHOW CHORD NAME AS FLOATING TEXT WHEN FIRST DETECTED
        if (chordResult.chordName && chordResult.chordName !== this.lastDetectedChord) {
          this.showChordNameFloating(chordResult.chordName);
          this.lastDetectedChord = chordResult.chordName;
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
    
    // UPDATE MATHEMATICAL BACKGROUND
    this.updateMathBackground();
  }

  private updateSynthesisDisplay(): void {
    // UPDATE SYNTH CONTROL PANEL VISUALS
    this.synthControlPanel.update();
    
    // UPDATE RESPONSIVE LAYOUT ON SCREEN RESIZE
    this.synthControlPanel.updateLayout();

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
            
            // SHOW FLOATING POINTS FOR PLATFORM CREATION (FIXED SCREEN POSITION)
            this.showFloatingPoints(GAME_CONSTANTS.GAME.SCORE_PER_PLATFORM, this.cameras.main.width / 2, this.cameras.main.height / 2);
            
            // CREATE PLATFORM PARTICLE EFFECTS
            this.createPlatformParticles(key, this.character.x);
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
            this.audioManager.stopNote(key as GameKey); // STOP AUDIO WHEN KEY IS RELEASED
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
      // CHARACTER IS ON A PLATFORM - NOT GROUNDED
      if (this.isGrounded) {
        this.handleLeaveGround();
      }
      
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
      // NO ACTIVE PLATFORMS - CHARACTER IS GROUNDED
      const { height } = this.cameras.main;
      const groundY = height - 20; // BELOW all notes (A is at -40, so ground at -20)

      if (this.character.y < groundY) {
        characterBody.setVelocityY(GAME_CONSTANTS.GAME.FALL_VELOCITY); // Fall down
      } else {
        this.character.y = groundY; // Hit ground
        characterBody.setVelocityY(0);
        
        // HANDLE GROUND MECHANICS
        if (!this.isGrounded) {
          this.handleHitGround();
        } else {
          this.handleStayGrounded();
        }
      }
    }
  }

  // GROUND MECHANICS HANDLERS
  private handleHitGround(): void {
    this.isGrounded = true;
    this.groundStartTime = this.time.now;
    this.lastScoreDecayTime = this.time.now;
    
    // START C2 BASE NOTE
    this.audioManager.playGroundC2();
    
    // UPDATE CHARACTER VISUAL (DARKER)
    this.character.setTint(0x666666);
    
    console.log("🎵 Character hit ground - C2 base note started");
  }
  
  private handleStayGrounded(): void {
    const timeOnGround = this.time.now - this.groundStartTime;
    
    // SCORE DECAY AFTER GRACE PERIOD
    if (timeOnGround > GAME_CONSTANTS.GAME.GROUND_GRACE_PERIOD) {
      const timeSinceLastDecay = this.time.now - this.lastScoreDecayTime;
      if (timeSinceLastDecay >= 1000) { // 1 second intervals
        this.score -= GAME_CONSTANTS.GAME.SCORE_DECAY_RATE;
        this.score = Math.max(0, this.score); // PREVENT NEGATIVE SCORE
        this.scoreText.setText(`Score: ${Math.floor(this.score)}`);
        this.lastScoreDecayTime = this.time.now;
        
        // SHOW NEGATIVE FLOATING POINTS
        this.showFloatingPoints(-GAME_CONSTANTS.GAME.SCORE_DECAY_RATE, this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        console.log("📉 Score decay: -1 point");
      }
    }
    
    // DISSONANCE REMOVED
  }
  
  private handleLeaveGround(): void {
    this.isGrounded = false;
    
    // STOP GROUND AUDIO
    this.audioManager.stopGroundC2();
    
    // RESTORE CHARACTER VISUAL (NORMAL COLOR)
    this.character.clearTint();
    
    console.log("🎵 Character left ground - audio stopped");
  }
  

  private showFloatingPoints(points: number, x: number, y: number): void {
    // CREATE FLOATING POINTS TEXT
    const pointsText = this.add.text(x, y, `${points > 0 ? '+' : ''}${points}`, {
      fontSize: "24px",
      color: this.getPointsColor(points),
      fontFamily: "Nabla, system-ui",
      stroke: "#000000",
      strokeThickness: 2,
    });
    pointsText.setOrigin(0.5);
    pointsText.setScrollFactor(0);
    
    // ADD TO FLOATING POINTS ARRAY
    this.floatingPoints.push(pointsText);
    
    // CREATE PARTICLE EFFECTS
    this.createPointsParticles(x, y, points);
    
    // ANIMATE THE FLOATING TEXT
    this.animateFloatingPoints(pointsText, points);
  }
  
  private getPointsColor(points: number): string {
    if (points < 0) return "#E74C3C"; // Red for negative points
    if (points >= 100) return "#FFD700"; // Gold for 100+
    if (points >= 50) return "#9B59B6";  // Purple for 50+
    if (points >= 25) return "#3498DB";  // Blue for 25+
    return "#2ECC71"; // Green for 10+
  }
  
  private createPointsParticles(x: number, y: number, points: number): void {
    // ONLY CREATE PARTICLES FOR FINAL CHORD COMPLETION (100+ points) OR PLATFORM CREATION
    const shouldShowParticles = (points >= 100) || (points === 10); // FINAL CHORD COMPLETION OR PLATFORM CREATION
    
    if (!shouldShowParticles) {
      return; // NO PARTICLES FOR CHORD ACCUMULATION
    }
    
    // CREATE SPARKLE PARTICLES
    const particleCount = Math.min(points / 10, 8); // More particles for higher points
    
    for (let i = 0; i < particleCount; i++) {
      const sparkle = this.add.circle(x, y, 2, 0xFFFFFF, 0.8);
      sparkle.setScrollFactor(0);
      
      // RANDOM DIRECTION AND SPEED
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const speed = 50 + Math.random() * 100;
      
      this.tweens.add({
        targets: sparkle,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0,
        duration: 800 + Math.random() * 400,
        ease: "Power2",
        onComplete: () => sparkle.destroy(),
      });
    }
  }
  
  private animateFloatingPoints(pointsText: Phaser.GameObjects.Text, points: number): void {
    let frameCount = 0;
    const maxFrames = 60; // 1 second at 60fps
    
    // UPDATE FUNCTION FOR PULSING EFFECT
    const updatePulse = () => {
      frameCount++;
      
      // PULSE ONLY ON MULTIPLES OF 10 POINTS
      if (points % 10 === 0) {
        if (frameCount % 10 === 0) { // PULSE EVERY 10 FRAMES (1/2 PULSE TIME)
          const pulseScale = 1.2 + (frameCount % 20 === 0 ? 0.3 : 0.1); // BIGGER PULSE EVERY 20TH FRAME
          this.tweens.add({
            targets: pointsText,
            scaleX: pulseScale,
            scaleY: pulseScale,
            duration: 100,
            yoyo: true,
            ease: "Power2",
          });
        }
      }
      
      if (frameCount < maxFrames) {
        this.time.delayedCall(16, updatePulse); // ~60fps
      }
    };
    
    // START THE PULSING
    updatePulse();
    
    // MAIN FLOATING ANIMATION
    this.tweens.add({
      targets: pointsText,
      y: pointsText.y - 100,
      alpha: 0,
      rotation: Math.random() * 0.5 - 0.25, // SLIGHT ROTATION
      duration: 1500,
      ease: "Power2",
      onComplete: () => {
        pointsText.destroy();
        // REMOVE FROM ARRAY
        const index = this.floatingPoints.indexOf(pointsText);
        if (index > -1) {
          this.floatingPoints.splice(index, 1);
        }
      },
    });
  }

  private createMathVisualBox(): void {
    const { width, height } = this.cameras.main;
    
    // USE BOTTOM 30% OF SCREEN
    const boxHeight = Math.floor(height * 0.3);
    const boxY = height - boxHeight;
    
    // CREATE MATHEMATICAL VISUAL BOX (FULLY OPAQUE)
    this.mathVisualBox = this.add.rectangle(
      width / 2,
      boxY + boxHeight / 2,
      width,
      boxHeight,
      0x2c3e50,
      1.0 // FULLY OPAQUE
    );
    this.mathVisualBox.setScrollFactor(0);
    this.mathVisualBox.setStrokeStyle(2, 0x3498db);
    
    // CREATE CHORD TEXT (HIDDEN - MATH BOX IS PURELY VISUAL)
    this.chordDisplayText = this.add.text(
      width / 2,
      boxY + boxHeight / 2 - 20,
      "",
      {
        fontSize: "20px",
        color: "#ecf0f1",
        fontFamily: "Nabla, system-ui",
        stroke: "#000000",
        strokeThickness: 1,
      }
    );
    this.chordDisplayText.setOrigin(0.5);
    this.chordDisplayText.setScrollFactor(0);
    this.chordDisplayText.setVisible(false); // HIDDEN
    
    // CREATE PROGRESS BAR BACKGROUND
    const progressBg = this.add.rectangle(
      width / 2,
      boxY + boxHeight - 20,
      width - 40,
      8,
      0x34495e
    );
    progressBg.setScrollFactor(0);
    
    // CREATE PROGRESS BAR
    this.chordProgressBar = this.add.rectangle(
      width / 2 - (width - 40) / 2,
      boxY + boxHeight - 20,
      0,
      8,
      0x2ecc71
    );
    this.chordProgressBar.setOrigin(0, 0.5);
    this.chordProgressBar.setScrollFactor(0);
    
    // CREATE MATHEMATICAL BACKGROUND
    this.createMathBackground();
  }


  private createPlatformParticles(key: string, x: number): void {
    const { height } = this.cameras.main;
    const platformY = height + GAME_CONSTANTS.LEVEL_HEIGHTS[key as GameKey];
    const platformColor = GAME_CONSTANTS.LEVEL_COLORS[key as GameKey];
    
    // CREATE MUSICAL PARTICLE EFFECTS
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
      // CREATE MUSICAL NOTE PARTICLES
      const particle = this.add.text(x, platformY, "♪", {
        fontSize: "12px",
        color: `#${platformColor.toString(16).padStart(6, '0')}`,
        fontFamily: "Nabla, system-ui",
        stroke: "#FFFFFF",
        strokeThickness: 1,
      });
      particle.setOrigin(0.5);
      
      // RANDOM DIRECTION AND SPEED
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const speed = 80 + Math.random() * 120;
      const endX = x + Math.cos(angle) * speed;
      const endY = platformY + Math.sin(angle) * speed;
      
      // ANIMATE PARTICLES
      this.tweens.add({
        targets: particle,
        x: endX,
        y: endY,
        alpha: 0,
        scale: 0.3,
        rotation: Math.random() * Math.PI * 2,
        duration: 800 + Math.random() * 400,
        ease: "Power2",
        onComplete: () => particle.destroy(),
      });
    }
    
    // CREATE SPARKLE EFFECT
    const sparkleCount = 5;
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = this.add.circle(x, platformY, 2, platformColor, 0.8);
      
      const sparkleAngle = (Math.PI * 2 * i) / sparkleCount;
      const sparkleSpeed = 60 + Math.random() * 80;
      const sparkleEndX = x + Math.cos(sparkleAngle) * sparkleSpeed;
      const sparkleEndY = platformY + Math.sin(sparkleAngle) * sparkleSpeed;
      
      this.tweens.add({
        targets: sparkle,
        x: sparkleEndX,
        y: sparkleEndY,
        alpha: 0,
        scale: 0,
        duration: 600 + Math.random() * 300,
        ease: "Power2",
        onComplete: () => sparkle.destroy(),
      });
    }
  }

  private updateMathVisualBox(chordName: string | null, points: number): void {
    // MATH BOX IS PURELY MATHEMATICAL BACKGROUND - NO PROGRESS BAR OR TEXT
    // The mathematical background updates automatically in updateMathBackground()
  }

  private showChordNameFloating(chordName: string): void {
    // Create floating chord name text - position relative to camera viewport
    const chordText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 50, // ABOVE THE POINTS
      chordName,
      {
        fontSize: "28px",
        color: "#f39c12",
        fontFamily: "Nabla, system-ui",
        stroke: "#000000",
        strokeThickness: 2,
      }
    );
    chordText.setOrigin(0.5);
    chordText.setScrollFactor(0);

    // Animate the chord name floating up
    this.tweens.add({
      targets: chordText,
      y: chordText.y - 80,
      alpha: 0,
      duration: 3000,
      ease: "Power2",
      onComplete: () => chordText.destroy(),
    });
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
        "Press T to restart or ESC for menu",
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

  private createMathBackground(): void {
    const { width, height } = this.cameras.main;
    
    // CREATE GRAPHICS OBJECT FOR MATHEMATICAL BACKGROUND
    this.mathBackground = this.add.graphics();
    this.mathBackground.setScrollFactor(0);
    this.mathBackground.setDepth(1); // ABOVE THE MATH BOX
    
    // USE BOTTOM 30% OF SCREEN
    const boxWidth = width;
    const boxHeight = Math.floor(height * 0.3); // 30% of screen height
    const boxX = 0;
    const boxY = height - boxHeight; // Start from bottom
    
    // CREATE 2D ARRAY FOR BACKGROUND VALUES
    this.backgroundData = [];
    for (let y = 0; y < boxHeight; y++) {
      this.backgroundData[y] = [];
      for (let x = 0; x < boxWidth; x++) {
        this.backgroundData[y][x] = 0;
      }
    }
  }

  private updateMathBackground(): void {
    if (!this.mathBackground) return;
    
    const { width, height } = this.cameras.main;
    const boxWidth = width;
    const boxHeight = Math.floor(height * 0.3); // 30% of screen height
    const boxX = 0;
    const boxY = height - boxHeight; // Start from bottom
    
    // GET AUDIO PARAMETERS
    const lfoRate = this.audioManager.getLFORate();
    const chorusDepth = this.audioManager.getChorusDepth();
    const delayVolume = this.audioManager.getDelayVolume();
    const reverbAmount = this.audioManager.getReverbAmount();
    
    // GET ACTIVE NOTES
    const activeNotes = this.platformManager.getActivePlatforms();
    const time = this.time.now * 0.001; // CONVERT TO SECONDS
    
    // CLEAR PREVIOUS GRAPHICS
    this.mathBackground.clear();
    
    // CALCULATE MATHEMATICAL FUNCTION FOR EACH PIXEL
    for (let y = 0; y < boxHeight; y++) {
      for (let x = 0; x < boxWidth; x++) {
        let value = 0;
        
        // BASE LFO WAVE (SINE) - INCREASED AMPLITUDE
        value += Math.sin(x * lfoRate * 0.1 + time) * 0.8;
        
        // CHORUS WAVE (COSINE) - INCREASED AMPLITUDE
        value += Math.cos(y * chorusDepth * 0.1 + time) * 0.6;
        
        // DELAY WAVE (SINE WITH PHASE SHIFT) - INCREASED AMPLITUDE
        value += Math.sin((x + y) * delayVolume * 0.05 + time) * 0.4;
        
        // REVERB WAVE (TANGENT FOR COMPLEXITY) - INCREASED AMPLITUDE
        value += Math.tan(x * reverbAmount * 0.02 + time) * 0.3;
        
        // ADD NOTE-SPECIFIC WAVES - INCREASED AMPLITUDE
        activeNotes.forEach((note, key) => {
          const frequency = this.getNoteFrequency(key);
          if (frequency) {
            value += Math.sin(x * frequency * 0.001 + time) * 0.5;
            value += Math.cos(y * frequency * 0.001 + time) * 0.5;
          }
        });
        
        // NORMALIZE VALUE TO 0-1 RANGE
        value = (value + 1) / 2;
        
        // CREATE VIBRANT COLOR SPECTRUM BASED ON VALUE
        let color;
        if (value < 0.25) {
          // BLUE TO CYAN
          color = Phaser.Display.Color.Interpolate.ColorWithColor(
            { r: 0, g: 0, b: 255 }, // BLUE
            { r: 0, g: 255, b: 255 }, // CYAN
            100,
            (value / 0.25) * 100
          );
        } else if (value < 0.5) {
          // CYAN TO GREEN
          color = Phaser.Display.Color.Interpolate.ColorWithColor(
            { r: 0, g: 255, b: 255 }, // CYAN
            { r: 0, g: 255, b: 0 }, // GREEN
            100,
            ((value - 0.25) / 0.25) * 100
          );
        } else if (value < 0.75) {
          // GREEN TO YELLOW
          color = Phaser.Display.Color.Interpolate.ColorWithColor(
            { r: 0, g: 255, b: 0 }, // GREEN
            { r: 255, g: 255, b: 0 }, // YELLOW
            100,
            ((value - 0.5) / 0.25) * 100
          );
        } else {
          // YELLOW TO RED
          color = Phaser.Display.Color.Interpolate.ColorWithColor(
            { r: 255, g: 255, b: 0 }, // YELLOW
            { r: 255, g: 0, b: 0 }, // RED
            100,
            ((value - 0.75) / 0.25) * 100
          );
        }
        
        // DRAW PIXEL WITH HIGHER OPACITY
        this.mathBackground.fillStyle(
          Phaser.Display.Color.GetColor(color.r, color.g, color.b),
          0.7 // MUCH HIGHER TRANSPARENCY FOR VIBRANCY
        );
        this.mathBackground.fillRect(boxX + x, boxY + y, 1, 1);
      }
    }
  }

  private getNoteFrequency(key: string): number | null {
    const NOTE_FREQUENCIES: Record<string, number> = {
      S: 261.63, // C4
      D: 293.66, // D4
      F: 329.63, // E4
      G: 349.23, // F4
      H: 392.0, // G4
      J: 440.0, // A4
      K: 493.88, // B4
      R: 311.13, // D#4
      U: 415.30, // G#4
      I: 466.16, // Bb4
      A: 246.94, // B3
      L: 523.25, // C5
      ";": 587.33, // D5
      "'": 659.25, // E5
    };
    return NOTE_FREQUENCIES[key] || null;
  }
}
