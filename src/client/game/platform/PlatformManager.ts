import { Scene } from "phaser";
import * as Phaser from "phaser";
import { GAME_CONSTANTS, GameKey } from "../config/GameConstants";

interface PlatformData {
  rectangle: Phaser.GameObjects.Rectangle;
  startX: number;
  key: GameKey;
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
    console.log("PlatformManager initialized successfully");
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

    // Create platform rectangle
    const platform = this.scene.add.rectangle(
      startX +
        GAME_CONSTANTS.PLATFORMS.AHEAD_OFFSET +
        GAME_CONSTANTS.PLATFORMS.CENTER_OFFSET,
      platformY,
      GAME_CONSTANTS.PLATFORMS.WIDTH,
      GAME_CONSTANTS.PLATFORMS.HEIGHT,
      platformColor,
    );

    // Add to physics (optional, for future collision detection)
    this.scene.physics.add.existing(platform, true); // true = static body

    // Store platform data
    const platformData: PlatformData = {
      rectangle: platform,
      startX: startX,
      key: key,
    };

    this.activePlatforms.set(key, platformData);
    this.platformsGroup.add(platform);

    console.log(`Created platform for key ${key} at height ${platformY}`);
  }

  endPlatform(key: GameKey): void {
    const platformData = this.activePlatforms.get(key);
    if (!platformData) {
      return;
    }

    // Remove from active platforms but keep the visual platform
    this.activePlatforms.delete(key);
    console.log(`Ended platform for key ${key}`);
  }

  extendActivePlatforms(characterX: number): void {
    this.activePlatforms.forEach((platformData, _key) => {
      const platform = platformData.rectangle;
      const targetRightEdge =
        characterX + GAME_CONSTANTS.PLATFORMS.EXTENSION_DISTANCE;
      const currentRightEdge = platform.x + platform.width / 2;

      if (targetRightEdge > currentRightEdge) {
        // Extend platform by increasing width and adjusting position
        const newWidth = targetRightEdge - (platform.x - platform.width / 2);
        const newCenterX = platform.x - platform.width / 2 + newWidth / 2;

        platform.setSize(newWidth, platform.height);
        platform.setPosition(newCenterX, platform.y);
      }
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

    if (platformsToRemove.length > 0) {
      console.log(`Cleaned up ${platformsToRemove.length} old platforms`);
    }
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
