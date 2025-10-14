import { Scene, GameObjects } from "phaser";

export class MainMenu extends Scene {
  private title: GameObjects.Text | null = null;
  private subtitle: GameObjects.Text | null = null;
  private instructions: GameObjects.Text | null = null;
  private startText: GameObjects.Text | null = null;
  private credits: GameObjects.Text | null = null;

  constructor() {
    super("MainMenu");
  }

  init(): void {
    this.title = null;
    this.subtitle = null;
    this.instructions = null;
    this.startText = null;
    this.credits = null;
  }

  create() {
    this.refreshLayout();

    // Re-calculate positions whenever the game canvas is resized
    this.scale.on("resize", () => this.refreshLayout());

    // Start game on click or space
    this.input.once("pointerdown", () => {
      this.scene.start("MuseRunnerGame");
    });

    this.input.keyboard!.on("keydown-SPACE", () => {
      this.scene.start("MuseRunnerGame");
    });
  }

  private refreshLayout(): void {
    const { width, height } = this.scale;

    // Resize camera to new viewport
    this.cameras.resize(width, height);

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x2c3e50);

    // Scale factor for responsive design
    const scaleFactor = Math.min(width / 1024, height / 768);

    // Title
    if (!this.title) {
      this.title = this.add
        .text(0, 0, "🎵 Muse Runner 🏃‍♂️", {
          fontSize: "48px",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        })
        .setOrigin(0.5);
    }
    this.title.setPosition(width / 2, height / 3);
    this.title.setScale(scaleFactor);

    // Subtitle
    if (!this.subtitle) {
      this.subtitle = this.add
        .text(0, 0, "Rhythm Platformer", {
          fontSize: "24px",
          color: "#3498db",
          fontFamily: "Arial, sans-serif",
        })
        .setOrigin(0.5);
    }
    this.subtitle.setPosition(width / 2, height / 3 + 60 * scaleFactor);
    this.subtitle.setScale(scaleFactor);

    // Instructions
    if (!this.instructions) {
      this.instructions = this.add
        .text(
          0,
          0,
          "Control your character by playing musical notes!\n\nPress S-D-F-G-H-J-K keys to create platforms\nKeep your character from falling off the screen",
          {
            fontSize: "18px",
            color: "#ecf0f1",
            fontFamily: "Arial, sans-serif",
            align: "center",
          },
        )
        .setOrigin(0.5);
    }
    this.instructions.setPosition(width / 2, height / 2);
    this.instructions.setScale(scaleFactor);

    // Start button text
    if (!this.startText) {
      this.startText = this.add
        .text(0, 0, "Click to Start or Press SPACE", {
          fontSize: "24px",
          color: "#2ecc71",
          fontFamily: "Arial, sans-serif",
        })
        .setOrigin(0.5);

      // Pulsing effect
      this.tweens.add({
        targets: this.startText,
        alpha: 0.5,
        duration: 1000,
        yoyo: true,
        repeat: -1,
      });
    }
    this.startText.setPosition(width / 2, height * 0.75);
    this.startText.setScale(scaleFactor);

    // Version info
    if (!this.credits) {
      this.credits = this.add
        .text(
          0,
          0,
          "v0.0.4 - Built with Phaser.js for Reddit's Community Games Challenge",
          {
            fontSize: "14px",
            color: "#95a5a6",
            fontFamily: "Arial, sans-serif",
          },
        )
        .setOrigin(0.5);
    }
    this.credits.setPosition(width / 2, height - 40);
    this.credits.setScale(scaleFactor * 0.8);
  }
}
