import { GAME_CONSTANTS } from "../config/GameConstants";
export class PlatformManager {
  scene;
  activePlatforms = new Map();
  platformsGroup;
  isInitialized = false;
  constructor(scene) {
    this.scene = scene;
    this.platformsGroup = this.scene.add.group();
  }
  initialize() {
    this.isInitialized = true;
    console.log("PlatformManager initialized successfully");
  }
  startNewPlatform(key, startX) {
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
    const platformData = {
      rectangle: platform,
      startX: startX,
      key: key,
    };
    this.activePlatforms.set(key, platformData);
    this.platformsGroup.add(platform);
    console.log(`Created platform for key ${key} at height ${platformY}`);
  }
  endPlatform(key) {
    const platformData = this.activePlatforms.get(key);
    if (!platformData) {
      return;
    }
    // Remove from active platforms but keep the visual platform
    this.activePlatforms.delete(key);
    console.log(`Ended platform for key ${key}`);
  }
  extendActivePlatforms(characterX) {
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
  getHighestActiveKey() {
    if (this.activePlatforms.size === 0) {
      return null;
    }
    // Find the key with the highest level (lowest Y value)
    let highestKey = null;
    let highestY = Number.POSITIVE_INFINITY;
    this.activePlatforms.forEach((_platformData, key) => {
      const levelHeight = GAME_CONSTANTS.LEVEL_HEIGHTS[key];
      if (levelHeight < highestY) {
        highestY = levelHeight;
        highestKey = key;
      }
    });
    return highestKey;
  }
  hasActivePlatforms() {
    return this.activePlatforms.size > 0;
  }
  cleanupOldPlatforms(characterX) {
    const platformsToRemove = [];
    // Check all platforms in the group, not just active ones
    this.platformsGroup.children.entries.forEach((platform) => {
      const rect = platform;
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
  getActivePlatforms() {
    return new Map(this.activePlatforms);
  }
  getPlatformsGroup() {
    return this.platformsGroup;
  }
  // Helper method to get level height for a key
  getLevelHeight(key) {
    return GAME_CONSTANTS.LEVEL_HEIGHTS[key];
  }
  // Helper method to get level color for a key
  getLevelColor(key) {
    return GAME_CONSTANTS.LEVEL_COLORS[key];
  }
}
//# sourceMappingURL=PlatformManager.js.map
