import { Scene } from "phaser";
import { GameKey } from "../config/GameConstants";
export interface IInputManager {
  initialize(): void;
  update(currentTime: number): {
    keyStateChanged: boolean;
  };
  getInputState(): {
    pressedKeys: Set<string>;
  };
}
export declare class InputManager implements IInputManager {
  private scene;
  private currentlyPressedKeys;
  private previouslyPressedKeys;
  private isInitialized;
  constructor(scene: Scene);
  initialize(): void;
  update(_currentTime: number): {
    keyStateChanged: boolean;
  };
  getInputState(): {
    pressedKeys: Set<string>;
  };
  private hasKeyStateChanged;
  isValidGameKey(key: string): key is GameKey;
}
