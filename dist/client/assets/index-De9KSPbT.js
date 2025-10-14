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
class a extends i.Scene {
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
class r extends i.Scene {
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
const n = class t {
  constructor() {
    e(this, "audioContext", null),
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
  async initialize() {
    try {
      (this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)()),
        "suspended" === this.audioContext.state &&
          (await this.audioContext.resume());
    } catch (t) {
      console.warn("Audio initialization failed:", t);
    }
  }
  playNote(t) {
    const e = this.noteFrequencies[t];
    if (e && this.audioContext)
      try {
        this.playTone(e);
      } catch (s) {
        console.warn("Failed to play note:", s);
      }
    else console.warn(`Cannot play note: ${t}`);
  }
  playTone(e) {
    if (!this.audioContext) return;
    const s = this.audioContext.createOscillator(),
      i = this.audioContext.createGain();
    s.connect(i),
      i.connect(this.audioContext.destination),
      s.frequency.setValueAtTime(e, this.audioContext.currentTime),
      (s.type = "sine");
    const { VOLUME: a, ATTACK_TIME: r, NOTE_DURATION: n } = t.AUDIO_CONSTANTS;
    i.gain.setValueAtTime(0, this.audioContext.currentTime),
      i.gain.linearRampToValueAtTime(a, this.audioContext.currentTime + r),
      i.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + n,
      ),
      s.start(this.audioContext.currentTime),
      s.stop(this.audioContext.currentTime + n);
  }
  dispose() {
    this.audioContext &&
      (this.audioContext.close(), (this.audioContext = null));
  }
};
e(n, "AUDIO_CONSTANTS", { NOTE_DURATION: 0.5, ATTACK_TIME: 0.01, VOLUME: 0.3 });
let o = n;
class c {
  constructor(t) {
    e(this, "gameKeys", {}),
      e(this, "inputState", {
        pressedKeys: new Set(),
        keyPressStartTime: new Map(),
        lastPressedKey: null,
      }),
      (this.scene = t);
  }
  initialize() {
    this.gameKeys = {
      S: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      F: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
      G: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G),
      H: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H),
      J: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
      K: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
    };
  }
  update(t) {
    let e = !1;
    Object.keys(this.gameKeys).forEach((s) => {
      const i = this.gameKeys[s];
      i &&
        (Phaser.Input.Keyboard.JustDown(i) &&
          (this.inputState.pressedKeys.add(s),
          this.inputState.keyPressStartTime.set(s, t),
          (this.inputState.lastPressedKey = s),
          (e = !0)),
        Phaser.Input.Keyboard.JustUp(i) &&
          (this.inputState.pressedKeys.delete(s), (e = !0)));
    });
    const s =
      this.inputState.pressedKeys.size > 0
        ? this.inputState.lastPressedKey
        : null;
    return { keyStateChanged: e, targetKey: s };
  }
  getInputState() {
    return { ...this.inputState };
  }
  isValidGameKey(t) {
    return ["S", "D", "F", "G", "H", "J", "K"].includes(t);
  }
}
const h = class t {
  constructor(t) {
    e(this, "platforms"),
      e(this, "currentPlatform", null),
      e(this, "currentKey", null),
      e(this, "platformStartX", 0),
      (this.scene = t),
      (this.platforms = this.scene.add.group());
  }
  initialize() {
    const { height: t } = this.scene.cameras.main,
      e = this.scene.add.rectangle(200, t - 50, 800, 25, 9807270);
    this.scene.physics.add.existing(e, !0), this.platforms.add(e);
  }
  startNewPlatform(e, s) {
    const { height: i } = this.scene.cameras.main;
    this.platformStartX = s + t.PLATFORM_CONSTANTS.AHEAD_OFFSET;
    const a = i + t.PLATFORM_CONSTANTS.LEVEL_HEIGHTS[e],
      r = t.PLATFORM_CONSTANTS.LEVEL_COLORS[e];
    (this.currentPlatform = this.scene.add.rectangle(
      this.platformStartX + t.PLATFORM_CONSTANTS.CENTER_OFFSET,
      a,
      t.PLATFORM_CONSTANTS.WIDTH,
      t.PLATFORM_CONSTANTS.HEIGHT,
      r,
    )),
      this.scene.physics.add.existing(this.currentPlatform, !0),
      this.platforms.add(this.currentPlatform),
      (this.currentKey = e);
  }
  extendCurrentPlatform(e) {
    if (!this.currentPlatform) return;
    const s = e - this.platformStartX + t.PLATFORM_CONSTANTS.EXTENSION,
      i = this.platformStartX + s / 2;
    (this.currentPlatform.width = Math.max(60, s)),
      (this.currentPlatform.x = i);
    const a = this.currentPlatform.body;
    a.setSize(this.currentPlatform.width, this.currentPlatform.height),
      a.updateFromGameObject();
  }
  endCurrentPlatform() {
    (this.currentPlatform = null), (this.currentKey = null);
  }
  cleanupOldPlatforms(e) {
    this.platforms.children.entries.forEach((s) => {
      const i = s;
      i.x < e - t.PLATFORM_CONSTANTS.CLEANUP_DISTANCE && i.destroy();
    });
  }
  getPlatformsGroup() {
    return this.platforms;
  }
  getCurrentKey() {
    return this.currentKey;
  }
  hasCurrentPlatform() {
    return null !== this.currentPlatform;
  }
};
e(h, "PLATFORM_CONSTANTS", {
  WIDTH: 120,
  HEIGHT: 20,
  EXTENSION: 150,
  AHEAD_OFFSET: 20,
  CENTER_OFFSET: 80,
  CLEANUP_DISTANCE: 400,
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
let l = h;
const d = class t extends i.Scene {
  constructor() {
    super("MuseRunnerGame"),
      e(this, "character"),
      e(this, "scoreText"),
      e(this, "isGameRunning", !1),
      e(this, "score", 0),
      e(this, "audioManager"),
      e(this, "inputManager"),
      e(this, "platformManager");
  }
  async create() {
    const { width: t, height: e } = this.cameras.main;
    (this.audioManager = new o()),
      (this.inputManager = new c(this)),
      (this.platformManager = new l(this)),
      this.audioManager.initialize(),
      this.inputManager.initialize(),
      this.platformManager.initialize(),
      (this.character = this.add.rectangle(100, e - 80, 30, 40, 3447003)),
      this.physics.add.existing(this.character);
    const s = this.character.body;
    s.setCollideWorldBounds(!1),
      s.setBounce(0.1),
      s.setDragX(0),
      s.setFrictionX(0),
      s.setMaxVelocityX(200),
      s.setMaxVelocityY(1e3),
      this.physics.add.collider(
        this.character,
        this.platformManager.getPlatformsGroup(),
        void 0,
        (t, e) => {
          const s = t.body,
            i = e.body;
          return s.velocity.y >= 0 && s.bottom <= i.top + 10;
        },
      ),
      (this.scoreText = this.add.text(16, 16, "Score: 0", {
        fontSize: "24px",
        color: "#ffffff",
      }));
    const i = this.add
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
        targets: i,
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
    e.setVelocityX(t.GAME_CONSTANTS.CHARACTER_SPEED),
      e.setDragX(0),
      e.setFrictionX(0);
    const { keyStateChanged: s, targetKey: i } = this.inputManager.update(
        this.time.now,
      ),
      a = this.inputManager.getInputState();
    s &&
      0 === a.pressedKeys.size &&
      this.platformManager.getCurrentKey() &&
      this.platformManager.endCurrentPlatform(),
      s &&
        i &&
        i !== this.platformManager.getCurrentKey() &&
        this.switchToKey(i),
      this.platformManager.hasCurrentPlatform() &&
        this.platformManager.extendCurrentPlatform(this.character.x),
      this.character.y >
        this.cameras.main.height + t.GAME_CONSTANTS.GAME_OVER_FALL_DISTANCE &&
        this.gameOver(),
      this.platformManager.cleanupOldPlatforms(this.character.x);
  }
  playNote(e) {
    const s = this.noteFrequencies[e];
    s
      ? (console.log(`Playing note ${e} at ${s}Hz`),
        this.playMusicalTone(s),
        this.character.setFillStyle(15965202),
        this.time.delayedCall(t.GAME_CONSTANTS.VISUAL_FEEDBACK_DURATION, () => {
          this.character.setFillStyle(3447003);
        }))
      : console.warn(`Unknown key: ${e}`);
  }
  playMusicalTone(e) {
    try {
      this.audioContext ||
        (this.audioContext = new (window.AudioContext ||
          window.webkitAudioContext)());
      const s = this.audioContext.createOscillator(),
        i = this.audioContext.createGain();
      s.connect(i),
        i.connect(this.audioContext.destination),
        s.frequency.setValueAtTime(e, this.audioContext.currentTime),
        (s.type = "sine"),
        i.gain.setValueAtTime(0, this.audioContext.currentTime),
        i.gain.linearRampToValueAtTime(
          t.GAME_CONSTANTS.AUDIO_VOLUME,
          this.audioContext.currentTime + t.GAME_CONSTANTS.AUDIO_ATTACK_TIME,
        ),
        i.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + t.GAME_CONSTANTS.AUDIO_NOTE_DURATION,
        ),
        s.start(this.audioContext.currentTime),
        s.stop(
          this.audioContext.currentTime + t.GAME_CONSTANTS.AUDIO_NOTE_DURATION,
        );
    } catch (s) {
      console.log("Audio not available:", s);
    }
  }
  switchToKey(t) {
    this.platformManager.endCurrentPlatform(),
      this.platformManager.startNewPlatform(t, this.character.x),
      this.audioManager.playNote(t),
      console.log(
        `Switching to ${t} platform - character will move to that height`,
      ),
      (this.score += 10),
      this.scoreText.setText(`Score: ${Math.floor(this.score)}`);
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
  isValidGameKey(t) {
    return ["S", "D", "F", "G", "H", "J", "K"].includes(t);
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
e(d, "GAME_CONSTANTS", {
  CHARACTER_SPEED: 100,
  JUMP_BASE_VELOCITY: -200,
  JUMP_LEVEL_MULTIPLIER: 50,
  MAX_JUMP_LEVELS: 2,
  PLATFORM_WIDTH: 120,
  PLATFORM_HEIGHT: 20,
  PLATFORM_EXTENSION: 150,
  PLATFORM_AHEAD_OFFSET: 20,
  PLATFORM_CENTER_OFFSET: 80,
  CLEANUP_DISTANCE: 400,
  GAME_OVER_FALL_DISTANCE: 300,
  AUDIO_NOTE_DURATION: 0.5,
  AUDIO_ATTACK_TIME: 0.01,
  AUDIO_VOLUME: 0.3,
  VISUAL_FEEDBACK_DURATION: 200,
  SIMPLE_JUMP_BASE: -300,
  SIMPLE_JUMP_MULTIPLIER: 40,
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
let u = d;
class m extends i.Scene {
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
class p extends i.Scene {
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
const f = {
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
  scene: [a, p, m, u, r],
};
document.addEventListener("DOMContentLoaded", () => {
  new i.Game({ ...f, parent: "game-container" });
});
//# sourceMappingURL=index-De9KSPbT.js.map
