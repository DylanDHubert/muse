import { Scene } from "phaser";
import * as Phaser from "phaser";
import { GameKey } from "../config/GameConstants";
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
export declare class PlatformManager implements IPlatformManager {
  private scene;
  private activePlatforms;
  private platformsGroup;
  private isInitialized;
  constructor(scene: Scene);
  initialize(): void;
  startNewPlatform(key: GameKey, startX: number): void;
  endPlatform(key: GameKey): void;
  extendActivePlatforms(characterX: number): void;
  getHighestActiveKey(): GameKey | null;
  hasActivePlatforms(): boolean;
  cleanupOldPlatforms(characterX: number): void;
  getActivePlatforms(): Map<string, PlatformData>;
  getPlatformsGroup(): Phaser.GameObjects.Group;
  getLevelHeight(key: GameKey): number;
  getLevelColor(key: GameKey): number;
}
export {};
