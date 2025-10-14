import { Scene } from "phaser";
export declare class MuseRunnerGame extends Scene {
  private character;
  private scoreText;
  private isGameRunning;
  private score;
  private audioManager;
  private inputManager;
  private platformManager;
  constructor();
  create(): Promise<void>;
  update(): void;
  private handleKeyChanges;
  private isValidGameKey;
  private updateCharacterHeight;
  private gameOver;
}
