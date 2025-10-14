import { Scene } from "phaser";
import * as Phaser from "phaser";
export declare class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameover_text: Phaser.GameObjects.Text;
  constructor();
  create(): void;
  private updateLayout;
}
