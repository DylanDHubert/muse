import { Scene } from "phaser";
import { GAME_CONSTANTS, GameKey } from "../config/GameConstants";
import { getChordFromKeys, keysToNotes } from "../config/NoteMapping";

interface ChordData {
  chordType: string;
  basePoints: number;
  accumulatedPoints: number;
  startTime: number;
  isComplete: boolean;
}

export class ChordDetector {
  private scene: Scene;
  private currentChord: ChordData | null = null;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  update(activeKeys: Set<string>): { points: number; chordName: string | null } {
    const keyArray = Array.from(activeKeys).sort();
    const notes = keysToNotes(keyArray);
    const noteString = notes.join(",");
    
    // Debug: Log the key combination being checked
    if (activeKeys.size > 1) {
      console.log("Keys pressed:", keyArray.join(","));
      console.log("Notes:", notes.join(","));
      console.log("Looking for chord:", noteString);
    }
    
    const chordDef = getChordFromKeys(keyArray);

    if (chordDef) {
      console.log("✅ Chord detected:", chordDef.name);
      // New chord detected or same chord continuing
      if (!this.currentChord || this.currentChord.chordType !== chordDef.name) {
        this.currentChord = {
          chordType: chordDef.name,
          basePoints: chordDef.points,
          accumulatedPoints: 0,
          startTime: this.scene.time.now,
          isComplete: false,
        };
      }

      // Calculate points earned this frame (not total accumulated)
      const elapsed = this.scene.time.now - this.currentChord.startTime;
      const progress = Math.min(elapsed / GAME_CONSTANTS.CHORD_DETECTION.ACCUMULATION_TIME, 1);
      const newAccumulatedPoints = Math.floor(this.currentChord.basePoints * progress);
      const pointsThisFrame = newAccumulatedPoints - this.currentChord.accumulatedPoints;
      
      this.currentChord.accumulatedPoints = newAccumulatedPoints;

      // Check if chord is complete
      if (progress >= 1 && !this.currentChord.isComplete) {
        this.currentChord.isComplete = true;
      }

      return { points: pointsThisFrame, chordName: this.currentChord.chordType };
    } else {
      // No valid chord detected
      if (activeKeys.size > 1) {
        console.log("❌ No chord found for:", noteString);
      }
      this.currentChord = null;
      return { points: 0, chordName: null };
    }
  }

  getCurrentChord(): ChordData | null {
    return this.currentChord;
  }
}
