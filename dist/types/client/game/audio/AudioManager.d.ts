import { GameKey } from "../config/GameConstants";
export interface IAudioManager {
  initialize(): void;
  playNote(key: GameKey): void;
  isAudioAvailable(): boolean;
}
export declare class AudioManager implements IAudioManager {
  private audioContext;
  private isInitialized;
  private audioAvailable;
  initialize(): void;
  playNote(key: GameKey): void;
  isAudioAvailable(): boolean;
  private playMusicalTone;
}
