var t = Object.defineProperty,
  e = (e, s, a) =>
    ((e, s, a) =>
      s in e
        ? t(e, s, { enumerable: !0, configurable: !0, writable: !0, value: a })
        : (e[s] = a))(e, "symbol" != typeof s ? s + "" : s, a);
import { r as s } from "./phaser-CRaLQf_f.js";
!(function () {
  const t = document.createElement("link").relList;
  if (!(t && t.supports && t.supports("modulepreload"))) {
    for (const t of document.querySelectorAll('link[rel="modulepreload"]'))
      e(t);
    new MutationObserver((t) => {
      for (const s of t)
        if ("childList" === s.type)
          for (const t of s.addedNodes)
            "LINK" === t.tagName && "modulepreload" === t.rel && e(t);
    }).observe(document, { childList: !0, subtree: !0 });
  }
  function e(t) {
    if (t.ep) return;
    t.ep = !0;
    const e = (function (t) {
      const e = {};
      return (
        t.integrity && (e.integrity = t.integrity),
        t.referrerPolicy && (e.referrerPolicy = t.referrerPolicy),
        "use-credentials" === t.crossOrigin
          ? (e.credentials = "include")
          : "anonymous" === t.crossOrigin
            ? (e.credentials = "omit")
            : (e.credentials = "same-origin"),
        e
      );
    })(t);
    fetch(t.href, e);
  }
})();
var a = s();
class i extends a.Scene {
  constructor() {
    super("Boot");
  }
  preload() {
    this.load.image("background", "assets/bg.png");
  }
  create() {
    this.scene.start("Preloader");
  }
}
class r extends a.Scene {
  constructor() {
    super("GameOver"),
      e(this, "camera"),
      e(this, "background"),
      e(this, "gameover_text");
  }
  create() {
    (this.camera = this.cameras.main),
      this.camera.setBackgroundColor(16711680),
      (this.background = this.add
        .image(0, 0, "background")
        .setOrigin(0)
        .setAlpha(0.5)),
      (this.gameover_text = this.add
        .text(0, 0, "Game Over", {
          fontFamily: "Arial Black",
          fontSize: "64px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 8,
          align: "center",
        })
        .setOrigin(0.5)),
      this.updateLayout(this.scale.width, this.scale.height),
      this.scale.on("resize", (t) => {
        const { width: e, height: s } = t;
        this.updateLayout(e, s);
      }),
      this.input.once("pointerdown", () => {
        this.scene.start("MainMenu");
      });
  }
  updateLayout(t, e) {
    this.cameras.resize(t, e),
      this.background && this.background.setDisplaySize(t, e);
    const s = Math.min(Math.min(t / 1024, e / 768), 1);
    this.gameover_text &&
      (this.gameover_text.setPosition(t / 2, e / 2),
      this.gameover_text.setScale(s));
  }
}
class o extends a.Scene {
  constructor() {
    super("MuseRunnerGame"),
      e(this, "character"),
      e(this, "platforms"),
      e(this, "gameKeys"),
      e(this, "isGameRunning", !1),
      e(this, "score", 0),
      e(this, "streak", 0),
      e(this, "characterSpeed", 120),
      e(this, "scoreText"),
      e(this, "streakText"),
      e(this, "noteFrequencies", {
        S: 261.63,
        D: 293.66,
        F: 329.63,
        G: 349.23,
        H: 392,
        J: 440,
        K: 493.88,
      });
  }
  create() {
    const { width: t, height: e } = this.cameras.main;
    (this.character = this.add.rectangle(100, e - 100, 30, 40, 3447003)),
      this.physics.add.existing(this.character);
    const s = this.character.body;
    s.setCollideWorldBounds(!0),
      s.setBounce(0.1),
      (this.platforms = this.add.group());
    const a = this.add.rectangle(50, e - 50, 200, 20, 3066993);
    this.physics.add.existing(a, !0),
      this.platforms.add(a),
      this.physics.add.collider(this.character, this.platforms),
      (this.gameKeys = {
        S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        F: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
        G: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G),
        H: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H),
        J: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
        K: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
      }),
      (this.scoreText = this.add.text(16, 16, "Score: 0", {
        fontSize: "24px",
        color: "#ffffff",
      })),
      (this.streakText = this.add.text(16, 50, "Streak: 0", {
        fontSize: "18px",
        color: "#f39c12",
      }));
    const i = this.add
      .text(t / 2, 30, "🎵 Press S-D-F-G-H-J-K to create platforms! 🎵", {
        fontSize: "18px",
        color: "#ecf0f1",
        fontFamily: "Arial, sans-serif",
      })
      .setOrigin(0.5);
    this.tweens.add({
      targets: i,
      alpha: 0.6,
      duration: 1500,
      yoyo: !0,
      repeat: -1,
    }),
      this.add
        .text(t - 16, 16, "ESC: Menu | R: Restart", {
          fontSize: "14px",
          color: "#95a5a6",
        })
        .setOrigin(1, 0),
      this.input.keyboard.on("keydown-ESC", () => {
        this.scene.start("MainMenu");
      }),
      this.input.keyboard.on("keydown-R", () => {
        this.scene.restart();
      }),
      (this.isGameRunning = !0),
      this.cameras.main.startFollow(this.character, !0, 0.1, 0.1),
      this.cameras.main.setDeadzone(200, 100),
      (this.score = 0),
      (this.streak = 0),
      (this.characterSpeed = 120);
  }
  update() {
    this.isGameRunning &&
      (this.character.body.setVelocityX(this.characterSpeed),
      Object.keys(this.gameKeys).forEach((t) => {
        Phaser.Input.Keyboard.JustDown(this.gameKeys[t]) &&
          (this.playNote(t), this.createPlatform(), this.updateScore(10));
      }),
      (this.characterSpeed = Math.min(200, 120 + this.score / 100)),
      this.character.y > this.cameras.main.height + 100 && this.gameOver(),
      this.platforms.children.entries.forEach((t) => {
        t.x < this.character.x - 400 && t.destroy();
      }));
  }
  playNote(t) {
    console.log(`Playing note ${t} at ${this.noteFrequencies[t]}Hz`),
      this.character.setTint(15965202),
      this.time.delayedCall(150, () => {
        this.character.clearTint();
      });
    const e = this.add
      .text(this.character.x, this.character.y - 60, t, {
        fontSize: "28px",
        color: "#f39c12",
        fontFamily: "Arial, sans-serif",
      })
      .setOrigin(0.5);
    this.tweens.add({
      targets: e,
      y: e.y - 40,
      alpha: 0,
      duration: 600,
      ease: "Power2",
      onComplete: () => e.destroy(),
    });
    const s = this.add.rectangle(
      this.cameras.main.scrollX + this.cameras.main.width / 2,
      this.cameras.main.scrollY + this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      16777215,
      0.1,
    );
    s.setScrollFactor(0),
      this.tweens.add({
        targets: s,
        alpha: 0,
        duration: 100,
        onComplete: () => s.destroy(),
      });
  }
  createPlatform() {
    const { height: t } = this.cameras.main,
      e = this.character.x + 120 + 80 * Math.random(),
      s = t - 80 - 150 * Math.random(),
      a = 80 + 40 * Math.random(),
      i = this.add.rectangle(e, s, a, 20, 3066993);
    this.physics.add.existing(i, !0),
      this.platforms.add(i),
      i.setAlpha(0),
      i.setScale(0.1),
      this.tweens.add({
        targets: i,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: "Back.easeOut",
      });
    const r = this.add.circle(e, s, 20, 3066993, 0.5);
    this.tweens.add({
      targets: r,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 300,
      ease: "Power2",
      onComplete: () => r.destroy(),
    });
  }
  updateScore(t) {
    if (
      ((this.score += t * (1 + 0.1 * this.streak)),
      this.streak++,
      this.scoreText.setText(`Score: ${Math.floor(this.score)}`),
      this.streakText.setText(`Streak: ${this.streak}`),
      this.streak > 0 && this.streak % 5 == 0)
    ) {
      const t = this.add
        .text(
          this.character.x,
          this.character.y - 80,
          `${this.streak}x STREAK!`,
          {
            fontSize: "20px",
            color: "#e74c3c",
            fontFamily: "Arial, sans-serif",
          },
        )
        .setOrigin(0.5);
      this.tweens.add({
        targets: t,
        y: t.y - 40,
        alpha: 0,
        scale: 1.5,
        duration: 1200,
        ease: "Power2",
        onComplete: () => t.destroy(),
      });
    }
  }
  gameOver() {
    (this.isGameRunning = !1), (this.streak = 0);
    const { width: t, height: e } = this.cameras.main;
    this.cameras.main.stopFollow(),
      this.add
        .rectangle(
          this.cameras.main.scrollX + t / 2,
          this.cameras.main.scrollY + e / 2,
          t,
          e,
          0,
          0.8,
        )
        .setScrollFactor(0),
      this.add
        .text(
          this.cameras.main.scrollX + t / 2,
          this.cameras.main.scrollY + e / 2 - 80,
          "Game Over!",
          {
            fontSize: "48px",
            color: "#e74c3c",
            fontFamily: "Arial, sans-serif",
          },
        )
        .setOrigin(0.5)
        .setScrollFactor(0),
      this.add
        .text(
          this.cameras.main.scrollX + t / 2,
          this.cameras.main.scrollY + e / 2 - 20,
          `Final Score: ${Math.floor(this.score)}`,
          {
            fontSize: "24px",
            color: "#ffffff",
            fontFamily: "Arial, sans-serif",
          },
        )
        .setOrigin(0.5)
        .setScrollFactor(0);
    const s = this.add
      .text(
        this.cameras.main.scrollX + t / 2,
        this.cameras.main.scrollY + e / 2 + 30,
        "Press R to restart or ESC for menu",
        { fontSize: "18px", color: "#bdc3c7", fontFamily: "Arial, sans-serif" },
      )
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.tweens.add({
      targets: s,
      alpha: 0.5,
      duration: 1e3,
      yoyo: !0,
      repeat: -1,
    }),
      window.parent &&
        window.parent.postMessage(
          { type: "GAME_OVER", data: { finalScore: Math.floor(this.score) } },
          "*",
        );
  }
}
class n extends a.Scene {
  constructor() {
    super("MainMenu"),
      e(this, "title", null),
      e(this, "subtitle", null),
      e(this, "instructions", null),
      e(this, "startText", null),
      e(this, "credits", null);
  }
  init() {
    (this.title = null),
      (this.subtitle = null),
      (this.instructions = null),
      (this.startText = null),
      (this.credits = null);
  }
  create() {
    this.refreshLayout(),
      this.scale.on("resize", () => this.refreshLayout()),
      this.input.once("pointerdown", () => {
        this.scene.start("MuseRunnerGame");
      }),
      this.input.keyboard.on("keydown-SPACE", () => {
        this.scene.start("MuseRunnerGame");
      });
  }
  refreshLayout() {
    const { width: t, height: e } = this.scale;
    this.cameras.resize(t, e), this.add.rectangle(t / 2, e / 2, t, e, 2899536);
    const s = Math.min(t / 1024, e / 768);
    this.title ||
      (this.title = this.add
        .text(0, 0, "🎵 Muse Runner 🏃‍♂️", {
          fontSize: "48px",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        })
        .setOrigin(0.5)),
      this.title.setPosition(t / 2, e / 3),
      this.title.setScale(s),
      this.subtitle ||
        (this.subtitle = this.add
          .text(0, 0, "Rhythm Platformer", {
            fontSize: "24px",
            color: "#3498db",
            fontFamily: "Arial, sans-serif",
          })
          .setOrigin(0.5)),
      this.subtitle.setPosition(t / 2, e / 3 + 60 * s),
      this.subtitle.setScale(s),
      this.instructions ||
        (this.instructions = this.add
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
          .setOrigin(0.5)),
      this.instructions.setPosition(t / 2, e / 2),
      this.instructions.setScale(s),
      this.startText ||
        ((this.startText = this.add
          .text(0, 0, "Click to Start or Press SPACE", {
            fontSize: "24px",
            color: "#2ecc71",
            fontFamily: "Arial, sans-serif",
          })
          .setOrigin(0.5)),
        this.tweens.add({
          targets: this.startText,
          alpha: 0.5,
          duration: 1e3,
          yoyo: !0,
          repeat: -1,
        })),
      this.startText.setPosition(t / 2, 0.75 * e),
      this.startText.setScale(s),
      this.credits ||
        (this.credits = this.add
          .text(
            0,
            0,
            "Built with Phaser.js for Reddit's Community Games Challenge",
            {
              fontSize: "14px",
              color: "#95a5a6",
              fontFamily: "Arial, sans-serif",
            },
          )
          .setOrigin(0.5)),
      this.credits.setPosition(t / 2, e - 40),
      this.credits.setScale(0.8 * s);
  }
}
class h extends a.Scene {
  constructor() {
    super("Preloader");
  }
  init() {
    this.add.image(512, 384, "background"),
      this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 16777215);
    const t = this.add.rectangle(282, 384, 4, 28, 16777215);
    this.load.on("progress", (e) => {
      t.width = 4 + 460 * e;
    });
  }
  preload() {
    this.load.setPath("assets"), this.load.image("logo", "logo.png");
  }
  create() {
    this.scene.start("MainMenu");
  }
}
const c = {
  type: a.AUTO,
  parent: "game-container",
  backgroundColor: "#2c3e50",
  physics: { default: "arcade", arcade: { gravity: { y: 600 }, debug: !1 } },
  scale: {
    mode: a.Scale.RESIZE,
    autoCenter: a.Scale.CENTER_BOTH,
    width: 1024,
    height: 768,
  },
  scene: [i, h, n, o, r],
};
document.addEventListener("DOMContentLoaded", () => {
  new a.Game({ ...c, parent: "game-container" });
});
//# sourceMappingURL=index-DzyYjXk8.js.map
