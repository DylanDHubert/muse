import { Scene } from "phaser";
import * as Phaser from "phaser";
import { GAME_CONSTANTS, GameKey } from "../config/GameConstants";

export interface IInputManager {
  initialize(): void;
  update(currentTime: number): { keyStateChanged: boolean };
  getInputState(): { pressedKeys: Set<string> };
  getArrowKeyState(): { up: boolean; down: boolean; left: boolean; right: boolean };
}

export class InputManager implements IInputManager {
  private scene: Scene;
  private currentlyPressedKeys: Set<string> = new Set();
  private previouslyPressedKeys: Set<string> = new Set();
  private isInitialized: boolean = false;
  private keyObjects: Map<string, Phaser.Input.Keyboard.Key> = new Map();
  private arrowKeys: {
    up: Phaser.Input.Keyboard.Key | null;
    down: Phaser.Input.Keyboard.Key | null;
    left: Phaser.Input.Keyboard.Key | null;
    right: Phaser.Input.Keyboard.Key | null;
  } = { up: null, down: null, left: null, right: null };

  constructor(scene: Scene) {
    this.scene = scene;
  }

  initialize(): void {
    if (!this.scene.input.keyboard) {
      console.warn("Keyboard input not available");
      return;
    }

    // Create key objects once during initialization
    GAME_CONSTANTS.VALID_KEYS.forEach((key) => {
      if (key === ";") {
        this.keyObjects.set(key, this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SEMICOLON));
      } else if (key === "'") {
        this.keyObjects.set(key, this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.QUOTES));
      } else {
        this.keyObjects.set(key, this.scene.input.keyboard!.addKey(key));
      }
    });

    // INITIALIZE ARROW KEYS FOR SYNTHESIS CONTROLS
    this.arrowKeys.up = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.arrowKeys.down = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.arrowKeys.left = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.arrowKeys.right = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    // ADDITIONAL SYNTHESIS CONTROLS (NUMBER KEYS)
    this.keyObjects.set("1", this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ONE));
    this.keyObjects.set("2", this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.TWO));
    this.keyObjects.set("3", this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.THREE));
    this.keyObjects.set("4", this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR));
    this.keyObjects.set("5", this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE));
    this.keyObjects.set("6", this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SIX));
    this.keyObjects.set("7", this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN));
    this.keyObjects.set("8", this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT));
    this.keyObjects.set("0", this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO));

    this.isInitialized = true;
    // InputManager initialized successfully
  }

  update(_currentTime: number): { keyStateChanged: boolean } {
    if (!this.isInitialized || !this.scene.input.keyboard) {
      return { keyStateChanged: false };
    }

    // Store previous state
    this.previouslyPressedKeys = new Set(this.currentlyPressedKeys);

    // Clear current state
    this.currentlyPressedKeys.clear();

    // Check each valid game key using pre-created key objects
    GAME_CONSTANTS.VALID_KEYS.forEach((key) => {
      const keyObject = this.keyObjects.get(key);
      if (keyObject && keyObject.isDown) {
        this.currentlyPressedKeys.add(key);
      }
    });

    // CHECK NUMBER KEYS FOR SYNTHESIS CONTROLS
    ["1", "2", "3", "4", "5", "6", "7", "8", "0"].forEach((key) => {
      const keyObject = this.keyObjects.get(key);
      if (keyObject && keyObject.isDown) {
        this.currentlyPressedKeys.add(key);
      }
    });

    // Determine if key state changed
    const keyStateChanged = this.hasKeyStateChanged();

    return { keyStateChanged };
  }

  getInputState(): { pressedKeys: Set<string> } {
    return {
      pressedKeys: new Set(this.currentlyPressedKeys),
    };
  }

  getArrowKeyState(): { up: boolean; down: boolean; left: boolean; right: boolean } {
    return {
      up: this.arrowKeys.up?.isDown || false,
      down: this.arrowKeys.down?.isDown || false,
      left: this.arrowKeys.left?.isDown || false,
      right: this.arrowKeys.right?.isDown || false,
    };
  }

  private hasKeyStateChanged(): boolean {
    // Check if the sets are different
    if (this.currentlyPressedKeys.size !== this.previouslyPressedKeys.size) {
      return true;
    }

    // Check if any key in current set is not in previous set
    for (const key of this.currentlyPressedKeys) {
      if (!this.previouslyPressedKeys.has(key)) {
        return true;
      }
    }

    // Check if any key in previous set is not in current set
    for (const key of this.previouslyPressedKeys) {
      if (!this.currentlyPressedKeys.has(key)) {
        return true;
      }
    }

    return false;
  }

  // Helper method to check if a key is a valid game key
  isValidGameKey(key: string): key is GameKey {
    return GAME_CONSTANTS.VALID_KEYS.includes(key as GameKey);
  }
}
