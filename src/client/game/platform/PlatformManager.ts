import { Scene } from "phaser";
import * as Phaser from "phaser";
import { GAME_CONSTANTS, GameKey } from "../config/GameConstants";

interface PlatformData {
  rectangle: Phaser.GameObjects.Rectangle;
  startX: number;
  key: GameKey;
  startTime: number;
  isGrowing: boolean;
  // VISUAL EFFECTS
  glowEffect?: Phaser.GameObjects.Rectangle;
  noteSymbol?: Phaser.GameObjects.Text;
  pulseTween?: Phaser.Tweens.Tween;
}

export interface IPlatformManager {
  initialize(): void;
  startNewPlatform(key: GameKey, startX: number): void;
  endPlatform(key: GameKey): void;
  extendActivePlatforms(characterX: number): void;
  getHighestActiveKey(): GameKey | null;
  hasActivePlatforms(): boolean;
  cleanupOldPlatforms(characterX: number): void;
  getActivePlatforms(): Map<string, PlatformData>;
  getPlatformsGroup(): Phaser.GameObjects.Group;
}

export class PlatformManager implements IPlatformManager {
  private scene: Scene;
  private activePlatforms: Map<string, PlatformData> = new Map();
  private platformsGroup: Phaser.GameObjects.Group;
  private isInitialized: boolean = false;

  constructor(scene: Scene) {
    this.scene = scene;
    this.platformsGroup = this.scene.add.group();
  }

  initialize(): void {
    this.isInitialized = true;
    // PlatformManager initialized successfully
  }

  startNewPlatform(key: GameKey, startX: number): void {
    if (!this.isInitialized) {
      console.warn("PlatformManager not initialized");
      return;
    }

    // Don't create duplicate platforms for the same key
    if (this.activePlatforms.has(key)) {
      return;
    }

    const { height } = this.scene.cameras.main;
    const platformY = height + GAME_CONSTANTS.LEVEL_HEIGHTS[key];
    const platformColor = GAME_CONSTANTS.LEVEL_COLORS[key];

    // CREATE GLOW EFFECT (BEHIND PLATFORM)
    const glowEffect = this.scene.add.rectangle(
      startX + GAME_CONSTANTS.PLATFORMS.AHEAD_OFFSET,
      platformY,
      GAME_CONSTANTS.PLATFORMS.MIN_LENGTH + 20, // SLIGHTLY LARGER
      GAME_CONSTANTS.PLATFORMS.HEIGHT + 10, // SLIGHTLY TALLER
      platformColor,
      0.3 // TRANSPARENT
    );
    glowEffect.setStrokeStyle(3, platformColor, 0.6);

    // CREATE MAIN PLATFORM WITH GRADIENT EFFECT
    const platform = this.scene.add.rectangle(
      startX + GAME_CONSTANTS.PLATFORMS.AHEAD_OFFSET,
      platformY,
      GAME_CONSTANTS.PLATFORMS.MIN_LENGTH,
      GAME_CONSTANTS.PLATFORMS.HEIGHT,
      platformColor,
    );
    
    // ADD GRADIENT OVERLAY
    const gradientOverlay = this.scene.add.rectangle(
      startX + GAME_CONSTANTS.PLATFORMS.AHEAD_OFFSET,
      platformY - 2, // SLIGHTLY ABOVE
      GAME_CONSTANTS.PLATFORMS.MIN_LENGTH,
      GAME_CONSTANTS.PLATFORMS.HEIGHT / 2,
      0xFFFFFF, // WHITE GRADIENT
      0.2
    );
    
    // ADD MUSICAL NOTE SYMBOL
    const noteSymbol = this.scene.add.text(
      startX + GAME_CONSTANTS.PLATFORMS.AHEAD_OFFSET,
      platformY,
      this.getNoteSymbol(key),
      {
        fontSize: "16px",
        color: "#FFFFFF",
        fontFamily: "Nabla, system-ui",
        stroke: "#000000",
        strokeThickness: 2,
      }
    );
    noteSymbol.setOrigin(0.5);

    // Add to physics (optional, for future collision detection)
    this.scene.physics.add.existing(platform, true); // true = static body

    // CREATE PULSING ANIMATION
    const pulseTween = this.scene.tweens.add({
      targets: [platform, glowEffect, gradientOverlay],
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });

    // Store platform data
    const platformData: PlatformData = {
      rectangle: platform,
      startX: startX,
      key: key,
      startTime: this.scene.time.now,
      isGrowing: true,
      glowEffect: glowEffect,
      noteSymbol: noteSymbol,
      pulseTween: pulseTween,
    };

    this.activePlatforms.set(key, platformData);
    this.platformsGroup.add(platform);
    this.platformsGroup.add(glowEffect);
    this.platformsGroup.add(gradientOverlay);
    this.platformsGroup.add(noteSymbol);

    // Platform created for key at specified height
  }

  private getNoteSymbol(key: GameKey): string {
    const noteSymbols: Record<GameKey, string> = {
      S: "♪", // C
      D: "♫", // D  
      F: "♪", // E
      G: "♫", // F
      H: "♪", // G
      J: "♫", // A
      K: "♪", // B
      R: "♯", // D#
      U: "♯", // G#
      I: "♭", // Bb
      A: "♪", // B3
      L: "♫", // C5
      ";": "♪", // D5
      "'": "♫", // E5
    };
    return noteSymbols[key] || "♪";
  }

  endPlatform(key: GameKey): void {
    const platformData = this.activePlatforms.get(key);
    if (!platformData) {
      return;
    }

    // STOP PULSING ANIMATION
    if (platformData.pulseTween) {
      platformData.pulseTween.stop();
    }

    // FADE OUT VISUAL EFFECTS
    this.scene.tweens.add({
      targets: [platformData.rectangle, platformData.glowEffect, platformData.noteSymbol],
      alpha: 0.3,
      duration: 500,
      ease: "Power2"
    });

    // Stop growing the platform
    platformData.isGrowing = false;
    
    // Remove from active platforms but keep the visual platform
    this.activePlatforms.delete(key);
    // Platform ended for key
  }

  extendActivePlatforms(characterX: number): void {
    this.activePlatforms.forEach((platformData, _key) => {
      if (!platformData.isGrowing) return;
      
      const platform = platformData.rectangle;
      
      // Calculate how far the character has moved since platform creation
      const distanceMoved = characterX - platformData.startX;
      
      // Platform should extend to keep up with character movement
      const newWidth = Math.max(
        GAME_CONSTANTS.PLATFORMS.MIN_LENGTH,
        GAME_CONSTANTS.PLATFORMS.MIN_LENGTH + distanceMoved
      );
      
      // Update platform size and position
      const leftEdge = platform.x - platform.width / 2;
      const newCenterX = leftEdge + newWidth / 2;
      
      platform.setSize(newWidth, platform.height);
      platform.setPosition(newCenterX, platform.y);
    });
  }

  getHighestActiveKey(): GameKey | null {
    if (this.activePlatforms.size === 0) {
      return null;
    }

    // Find the key with the highest level (lowest Y value)
    let highestKey: GameKey | null = null;
    let highestY = Number.POSITIVE_INFINITY;

    this.activePlatforms.forEach((_platformData, key) => {
      const levelHeight = GAME_CONSTANTS.LEVEL_HEIGHTS[key as GameKey];
      if (levelHeight < highestY) {
        highestY = levelHeight;
        highestKey = key as GameKey;
      }
    });

    return highestKey;
  }

  hasActivePlatforms(): boolean {
    return this.activePlatforms.size > 0;
  }

  cleanupOldPlatforms(characterX: number): void {
    const platformsToRemove: Phaser.GameObjects.Rectangle[] = [];

    // Check all platforms in the group, not just active ones
    this.platformsGroup.children.entries.forEach((platform) => {
      const rect = platform as Phaser.GameObjects.Rectangle;
      const platformRightEdge = rect.x + rect.width / 2;

      // Remove platforms that are far behind the character
      if (
        platformRightEdge <
        characterX - GAME_CONSTANTS.PLATFORMS.CLEANUP_DISTANCE
      ) {
        platformsToRemove.push(rect);
      }
    });

    // Remove old platforms
    platformsToRemove.forEach((platform) => {
      this.platformsGroup.remove(platform);
      platform.destroy();
    });

    // Old platforms cleaned up
  }

  getActivePlatforms(): Map<string, PlatformData> {
    return new Map(this.activePlatforms);
  }

  getPlatformsGroup(): Phaser.GameObjects.Group {
    return this.platformsGroup;
  }

  // Helper method to get level height for a key
  getLevelHeight(key: GameKey): number {
    return GAME_CONSTANTS.LEVEL_HEIGHTS[key];
  }

  // Helper method to get level color for a key
  getLevelColor(key: GameKey): number {
    return GAME_CONSTANTS.LEVEL_COLORS[key];
  }
}
