import { Scene } from "phaser";
import { GAME_CONSTANTS, GameKey } from "../config/GameConstants";

export interface IInputManager {
  initialize(): void;
  update(currentTime: number): { keyStateChanged: boolean };
  getInputState(): { pressedKeys: Set<string> };
}

export class InputManager implements IInputManager {
  private scene: Scene;
  private currentlyPressedKeys: Set<string> = new Set();
  private previouslyPressedKeys: Set<string> = new Set();
  private isInitialized: boolean = false;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  initialize(): void {
    if (!this.scene.input.keyboard) {
      console.warn("Keyboard input not available");
      return;
    }

    this.isInitialized = true;
    console.log("InputManager initialized successfully");
  }

  update(_currentTime: number): { keyStateChanged: boolean } {
    if (!this.isInitialized || !this.scene.input.keyboard) {
      return { keyStateChanged: false };
    }

    // Store previous state
    this.previouslyPressedKeys = new Set(this.currentlyPressedKeys);

    // Clear current state
    this.currentlyPressedKeys.clear();

    // Check each valid game key
    GAME_CONSTANTS.VALID_KEYS.forEach((key) => {
      const keyObject = this.scene.input.keyboard!.addKey(key);
      if (keyObject.isDown) {
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
