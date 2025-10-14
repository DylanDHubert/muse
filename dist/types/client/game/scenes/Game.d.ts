import { Scene } from "phaser";
import * as Phaser from "phaser";
export declare class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  count: number;
  countText: Phaser.GameObjects.Text;
  incButton: Phaser.GameObjects.Text;
  decButton: Phaser.GameObjects.Text;
  goButton: Phaser.GameObjects.Text;
  constructor();
  create(): void;
  updateLayout(width: number, height: number): void;
  updateCountText(): void;
}
