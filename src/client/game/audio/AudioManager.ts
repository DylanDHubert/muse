import { GAME_CONSTANTS, GameKey } from "../config/GameConstants";

// Note frequencies for each game key (C major scale)
const NOTE_FREQUENCIES: Record<GameKey, number> = {
  S: 261.63, // C4
  D: 293.66, // D4
  F: 329.63, // E4
  G: 349.23, // F4
  H: 392.0, // G4
  J: 440.0, // A4
  K: 493.88, // B4
};

export interface IAudioManager {
  initialize(): void;
  playNote(key: GameKey): void;
  isAudioAvailable(): boolean;
}

export class AudioManager implements IAudioManager {
  private audioContext: AudioContext | null = null;
  private isInitialized: boolean = false;
  private audioAvailable: boolean = false;

  initialize(): void {
    try {
      // Initialize Web Audio API context
      this.audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      this.audioAvailable = true;
      this.isInitialized = true;
      console.log("AudioManager initialized successfully");
    } catch (error) {
      console.warn("Web Audio API not available:", error);
      this.audioAvailable = false;
      this.isInitialized = true;
    }
  }

  playNote(key: GameKey): void {
    if (!this.isInitialized) {
      console.warn("AudioManager not initialized");
      return;
    }

    if (!this.audioAvailable || !this.audioContext) {
      // Graceful degradation - audio not available
      return;
    }

    const frequency = NOTE_FREQUENCIES[key];
    if (!frequency) {
      console.warn(`Unknown key: ${key}`);
      return;
    }

    try {
      this.playMusicalTone(frequency);
    } catch (error) {
      console.warn("Failed to play note:", error);
    }
  }

  isAudioAvailable(): boolean {
    return this.audioAvailable;
  }

  private playMusicalTone(frequency: number): void {
    if (!this.audioContext) return;

    // Create oscillator for the musical note
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Set frequency and type
    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime,
    );
    oscillator.type = "sine"; // Pure tone

    // Set volume envelope (attack and decay)
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      GAME_CONSTANTS.AUDIO.VOLUME,
      this.audioContext.currentTime + GAME_CONSTANTS.AUDIO.ATTACK_TIME,
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + GAME_CONSTANTS.AUDIO.NOTE_DURATION,
    );

    // Play the note
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(
      this.audioContext.currentTime + GAME_CONSTANTS.AUDIO.NOTE_DURATION,
    );
  }
}
