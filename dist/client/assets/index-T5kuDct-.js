var t = Object.defineProperty,
  e = (e, s, i) =>
    ((e, s, i) =>
      s in e
        ? t(e, s, { enumerable: !0, configurable: !0, writable: !0, value: i })
        : (e[s] = i))(e, "symbol" != typeof s ? s + "" : s, i);
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
var i = s();
class r extends i.Scene {
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
class a extends i.Scene {
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
const o = class t extends i.Scene {
  constructor() {
    super("MuseRunnerGame"),
      e(this, "character"),
      e(this, "platforms"),
      e(this, "gameKeys"),
      e(this, "isGameRunning", !1),
      e(this, "score", 0),
      e(this, "scoreText"),
      e(this, "currentPlatform", null),
      e(this, "currentKey", null),
      e(this, "platformStartX", 0),
      e(this, "pressedKeys", new Set()),
      e(this, "keyPressStartTime", new Map()),
      e(this, "noteFrequencies", {
        S: 261.63,
        D: 293.66,
        F: 329.63,
        G: 349.23,
        H: 392,
        J: 440,
        K: 493.88,
      }),
      e(this, "audioContext", null);
  }
  create() {
    const { width: t, height: e } = this.cameras.main;
    this.platforms = this.add.group();
    const s = this.add.rectangle(200, e - 50, 800, 25, 9807270);
    this.physics.add.existing(s, !0),
      this.platforms.add(s),
      (this.character = this.add.rectangle(100, e - 80, 30, 40, 3447003)),
      this.physics.add.existing(this.character);
    const i = this.character.body;
    i.setCollideWorldBounds(!1),
      i.setBounce(0.1),
      i.setDragX(0),
      i.setFrictionX(0),
      i.setMaxVelocityX(200),
      i.setMaxVelocityY(1e3),
      this.physics.add.collider(
        this.character,
        this.platforms,
        void 0,
        (t, e) => {
          const s = t.body,
            i = e.body;
          return s.velocity.y >= 0 && s.bottom <= i.top + 10;
        },
      ),
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
      }));
    const r = this.add
      .text(
        t / 2,
        30,
        "🎵 Press S-D-F-G-H-J-K to create platforms at different heights! 🎵",
        { fontSize: "16px", color: "#ecf0f1", fontFamily: "Arial, sans-serif" },
      )
      .setOrigin(0.5);
    this.add
      .text(t / 2, 60, "S=Low → D → F → G → H → J → K=High", {
        fontSize: "14px",
        color: "#95a5a6",
        fontFamily: "Arial, sans-serif",
      })
      .setOrigin(0.5),
      this.tweens.add({
        targets: r,
        alpha: 0.6,
        duration: 1500,
        yoyo: !0,
        repeat: -1,
      }),
      this.add
        .text(t - 16, 16, "v0.0.4 | ESC: Menu | R: Restart", {
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
      (this.score = 0);
  }
  update() {
    if (!this.isGameRunning) return;
    const e = this.character.body;
    if (
      (e.setVelocityX(t.GAME_CONSTANTS.CHARACTER_SPEED),
      e.setDragX(0),
      e.setFrictionX(0),
      Object.keys(this.gameKeys).forEach((t) => {
        const e = this.gameKeys[t];
        if (
          e &&
          (Phaser.Input.Keyboard.JustDown(e) &&
            (this.pressedKeys.add(t),
            this.keyPressStartTime.set(t, this.time.now),
            console.log(`Key ${t} pressed at ${this.time.now}`)),
          Phaser.Input.Keyboard.JustUp(e))
        ) {
          this.pressedKeys.delete(t);
          const e = this.time.now - (this.keyPressStartTime.get(t) || 0);
          console.log(`Key ${t} released after ${e}ms`),
            t === this.currentKey &&
              (this.endCurrentPlatform(), (this.currentKey = null));
        }
      }),
      this.pressedKeys.size > 0)
    ) {
      const t = Array.from(this.pressedKeys),
        e = this.getHighestReachableKey(t);
      e !== this.currentKey &&
        (console.log(`Keys held: ${t.join(",")}, switching to: ${e}`),
        this.switchToKey(e));
    }
    this.currentPlatform && this.currentKey && this.extendCurrentPlatform(),
      this.character.y > this.cameras.main.height + 300 && this.gameOver(),
      this.platforms.children.entries.forEach((t) => {
        t.x < this.character.x - 400 && t.destroy();
      });
  }
  playNote(t) {
    const e = this.noteFrequencies[t];
    e
      ? (console.log(`Playing note ${t} at ${e}Hz`),
        this.playMusicalTone(e),
        this.character.setFillStyle(15965202),
        this.time.delayedCall(200, () => {
          this.character.setFillStyle(3447003);
        }))
      : console.warn(`Unknown key: ${t}`);
  }
  playMusicalTone(t) {
    try {
      this.audioContext ||
        (this.audioContext = new (window.AudioContext ||
          window.webkitAudioContext)());
      const e = this.audioContext.createOscillator(),
        s = this.audioContext.createGain();
      e.connect(s),
        s.connect(this.audioContext.destination),
        e.frequency.setValueAtTime(t, this.audioContext.currentTime),
        (e.type = "sine"),
        s.gain.setValueAtTime(0, this.audioContext.currentTime),
        s.gain.linearRampToValueAtTime(
          0.3,
          this.audioContext.currentTime + 0.01,
        ),
        s.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + 0.5,
        ),
        e.start(this.audioContext.currentTime),
        e.stop(this.audioContext.currentTime + 0.5);
    } catch (e) {
      console.log("Audio not available:", e);
    }
  }
  switchToKey(t) {
    this.currentKey !== t && this.makeCharacterJump(t),
      this.endCurrentPlatform(),
      this.startNewPlatform(t),
      this.playNote(t),
      (this.score += 10),
      this.scoreText.setText(`Score: ${Math.floor(this.score)}`);
  }
  startNewPlatform(e) {
    const { height: s } = this.cameras.main;
    this.platformStartX = this.character.x + 20;
    const i = s + t.GAME_CONSTANTS.LEVEL_HEIGHTS[e],
      r = t.GAME_CONSTANTS.LEVEL_COLORS[e];
    (this.currentPlatform = this.add.rectangle(
      this.platformStartX + 80,
      i,
      t.GAME_CONSTANTS.PLATFORM_WIDTH,
      t.GAME_CONSTANTS.PLATFORM_HEIGHT,
      r,
    )),
      this.physics.add.existing(this.currentPlatform, !0),
      this.platforms.add(this.currentPlatform),
      (this.currentKey = e),
      console.log(`Started ${e} platform at height ${i}`);
  }
  extendCurrentPlatform() {
    if (!this.currentPlatform) return;
    const e =
        this.character.x -
        this.platformStartX +
        t.GAME_CONSTANTS.PLATFORM_EXTENSION,
      s = this.platformStartX + e / 2;
    (this.currentPlatform.width = Math.max(60, e)),
      (this.currentPlatform.x = s);
    const i = this.currentPlatform.body;
    i.setSize(this.currentPlatform.width, this.currentPlatform.height),
      i.updateFromGameObject();
  }
  endCurrentPlatform() {
    (this.currentPlatform = null), (this.currentKey = null);
  }
  makeCharacterJump(e) {
    const s = this.character.body,
      i = this.getCurrentCharacterLevel(),
      r = this.getKeyLevel(e),
      a = r - i;
    if ((console.log(`Moving from level ${i} to ${r} (${e})`), a <= 0))
      console.log("Dropping down or staying level");
    else if (a > t.GAME_CONSTANTS.MAX_JUMP_LEVELS) {
      const e = i + t.GAME_CONSTANTS.MAX_JUMP_LEVELS,
        r = this.getLevelKey(e);
      console.log(`Too high! Can only reach level ${e} (${r})`),
        this.endCurrentPlatform(),
        this.startNewPlatform(r);
      const a =
        t.GAME_CONSTANTS.JUMP_BASE_VELOCITY -
        t.GAME_CONSTANTS.MAX_JUMP_LEVELS *
          t.GAME_CONSTANTS.JUMP_LEVEL_MULTIPLIER;
      s.setVelocityY(a);
    } else {
      const i = this.character.y,
        r = this.cameras.main.height + t.GAME_CONSTANTS.LEVEL_HEIGHTS[e],
        a = i - r,
        o = 600,
        n = 0.9 * -Math.sqrt(2 * o * Math.abs(a));
      s.setVelocityY(n),
        console.log(
          `Precise jump from ${i} to ${r} (diff: ${a}), velocity: ${n}`,
        );
    }
  }
  getCurrentCharacterLevel() {
    return this.currentKey ? this.getKeyLevel(this.currentKey) : 0;
  }
  getKeyLevel(t) {
    return { S: 0, D: 1, F: 2, G: 3, H: 4, J: 5, K: 6 }[t] ?? 0;
  }
  getLevelKey(t) {
    return ["S", "D", "F", "G", "H", "J", "K"][Math.min(t, 6)] || "S";
  }
  getHighestReachableKey(e) {
    const s =
      this.getCurrentCharacterLevel() + t.GAME_CONSTANTS.MAX_JUMP_LEVELS;
    return (
      e
        .sort((t, e) => this.getKeyLevel(e) - this.getKeyLevel(t))
        .find((t) => this.getKeyLevel(t) <= s) ?? this.getLevelKey(s)
    );
  }
  gameOver() {
    this.isGameRunning = !1;
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
};
e(o, "GAME_CONSTANTS", {
  CHARACTER_SPEED: 100,
  JUMP_BASE_VELOCITY: -200,
  JUMP_LEVEL_MULTIPLIER: 50,
  MAX_JUMP_LEVELS: 2,
  PLATFORM_WIDTH: 120,
  PLATFORM_HEIGHT: 20,
  PLATFORM_EXTENSION: 150,
  LEVEL_HEIGHTS: {
    S: -80,
    D: -120,
    F: -160,
    G: -200,
    H: -240,
    J: -280,
    K: -320,
  },
  LEVEL_COLORS: {
    S: 15158332,
    D: 15965202,
    F: 15844367,
    G: 3066993,
    H: 3447003,
    J: 10181046,
    K: 15277667,
  },
});
let n = o;
class h extends i.Scene {
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
            "v0.0.4 - Built with Phaser.js for Reddit's Community Games Challenge",
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
class c extends i.Scene {
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
const l = {
  type: i.AUTO,
  parent: "game-container",
  backgroundColor: "#2c3e50",
  physics: { default: "arcade", arcade: { gravity: { y: 600 }, debug: !1 } },
  scale: {
    mode: i.Scale.RESIZE,
    autoCenter: i.Scale.CENTER_BOTH,
    width: 1024,
    height: 768,
  },
  scene: [r, c, h, n, a],
};
document.addEventListener("DOMContentLoaded", () => {
  new i.Game({ ...l, parent: "game-container" });
});
//# sourceMappingURL=index-T5kuDct-.js.map
