// Note mapping system - maps keyboard keys to musical notes
export const NOTE_MAPPING = {
  // Keyboard key -> Musical note
  S: "C",  // C (Root)
  D: "D",  // D (2nd)
  F: "E",  // E (3rd)
  G: "F",  // F (4th)
  H: "G",  // G (5th)
  J: "A",  // A (6th)
  K: "B",  // B (7th)
  // Chromatic notes
  R: "D#", // D# (Sharp 2nd)
  U: "G#", // G# (Sharp 5th)
  I: "Bb", // Bb (Flat 7th)
  // Additional octave keys (same note names for chord detection)
  A: "B",  // B (same as K for chord detection)
  L: "C",  // C (same as S for chord detection)
  ";": "D", // D (same as D for chord detection)
  "'": "E", // E (same as F for chord detection)
} as const;

// Reverse mapping - Musical note -> Keyboard key
export const KEY_MAPPING = {
  C: "S",
  D: "D", 
  E: "F",
  F: "G",
  G: "H",
  A: "J",
  B: "K",
  // Chromatic notes
  "D#": "R",
  "G#": "U",
  "Bb": "I",
} as const;

// ALL COMMON CHORDS IN THE C MAJOR KEY (NOTES SORTED ALPHABETICALLY)
export const CHORD_DEFINITIONS = {
    // ----------------------------
    // TRIADS (3 NOTES) - 50 POINTS
    // ----------------------------
    "C,E,G": { name: "C Major (I)", points: 50 },
    "A,D,F": { name: "D Minor (ii)", points: 50 },
    "B,E,G": { name: "E Minor (iii)", points: 50 },
    "A,C,F": { name: "F Major (IV)", points: 50 },
    "B,D,G": { name: "G Major (V)", points: 50 },
    "A,C,E": { name: "A Minor (vi)", points: 50 },
    "B,D,F": { name: "B Diminished (vii°)", points: 50 },
  
    // ----------------------------
    // SEVENTHS (4 NOTES) - 100 POINTS
    // ----------------------------
    "B,C,E,G": { name: "C Major 7 (IΔ7)", points: 100 },
    "A,C,D,F": { name: "D Minor 7 (ii7)", points: 100 },
    "B,D,E,G": { name: "E Minor 7 (iii7)", points: 100 },
    "A,C,E,F": { name: "F Major 7 (IVΔ7)", points: 100 },
    "B,D,F,G": { name: "G Dominant 7 (V7)", points: 100 },
    "A,C,E,G": { name: "A Minor 7 (vi7)", points: 100 },
    "A,B,D,F": { name: "B Half-Diminished 7 (viiø7)", points: 100 },
  
    // ----------------------------
    // EXTENDED CHORDS - 150 POINTS
    // ----------------------------
    "B,C,D,E,G": { name: "C Major 9", points: 150 },
    "A,C,D,E,F": { name: "D Minor 9", points: 150 },
    "A,B,D,F,G": { name: "G9 (Dominant 9)", points: 150 },
    "A,B,C,E,G": { name: "A Minor 9", points: 150 },
  
    // ----------------------------
    // SUSPENDED CHORDS - 50 POINTS
    // ----------------------------
    "C,F,G": { name: "Csus4", points: 50 },
    "C,D,G": { name: "Csus2", points: 50 },
    "A,D,G": { name: "Dsus4", points: 50 },
  
    // ----------------------------
    // ADD CHORDS - 75 POINTS
    // ----------------------------
    "C,D,E,G": { name: "Cadd9", points: 75 },
  
    // ----------------------------
    // POWER CHORDS (5ths) - 25 POINTS
    // ----------------------------
    "C,G": { name: "C5", points: 25 },
    "A,D": { name: "D5", points: 25 },
    "B,E": { name: "E5", points: 25 },
    "C,F": { name: "F5", points: 25 },
    "D,G": { name: "G5", points: 25 },
    "A,E": { name: "A5", points: 25 },
    "B,F": { name: "B5", points: 25 },
  } as const;
  
// C MAJOR + CHROMATIC EXTENSIONS (Bb, D#, G# INCLUDED, NOTES SORTED ALPHABETICALLY)
export const CHORD_DEFINITIONS_EXTENDED = {
    // ----------------------------
    // CHROMATIC TRIADS - 50 POINTS
    // ----------------------------
    "A,C,D#": { name: "A Diminished (viio/iii)", points: 50 },
    "A,C#,E": { name: "A Major (V/ii)", points: 50 },
    "A,D,F#": { name: "D Major (V/V)", points: 50 },
    "A#,C#,E": { name: "A# Diminished (viio/bII)", points: 50 },
    "A#,C,D,F": { name: "F Minor (iv)", points: 50 },
    "A#,F,G#": { name: "F Augmented (IV+)", points: 50 },
    "A#,D,F": { name: "Bb Major (bVII)", points: 50 },
    "A#,D,G": { name: "G Minor (v)", points: 50 },
    "A#,D,G#": { name: "Ab Major (bVI)", points: 50 },
    "B,D#,G#": { name: "G# Minor (iii/vi)", points: 50 },
    "C,D#,G": { name: "C Minor (i)", points: 50 },
    "A#,C,D#,G": { name: "C Minor 7 (i7)", points: 100 },
    "C,E,G#": { name: "C Augmented (I+)", points: 50 },
    "B,C,E,G#": { name: "C Augmented Major 7 (I+Δ7)", points: 100 },
    "C#,E,G#": { name: "C# Diminished (viio/ii)", points: 50 },
    "C#,F,G#": { name: "C# Minor (ii/ii)", points: 50 },
    "B,C#,F,G#": { name: "C# Minor 7 (ii7/ii)", points: 100 },
    "D,F,G#": { name: "D Augmented (II+)", points: 50 },
    "A#,D#,G": { name: "Eb Minor (biii)", points: 50 },
    "B,D#,G": { name: "D# Diminished", points: 50 },
    "B,E,G#": { name: "E Major (III)", points: 50 },
    "B,D,E,G#": { name: "E Dominant 7 (V7/vi)", points: 100 },
    "C,F,G#": { name: "F Augmented (IV+)", points: 50 },
    "A#,C,F": { name: "F Minor (iv)", points: 50 },
    "A#,C,F,G#": { name: "F Augmented (IV+)", points: 50 },

  
    // ----------------------------
    // POWER CHORDS (5ths) - 25 POINTS
    // ----------------------------
    "A#,F": { name: "Bb5 (bVII5)", points: 25 },
    "A#,D#": { name: "Eb5 (bIII5)", points: 25 },
    "D#,G#": { name: "Ab5 (bVI5)", points: 25 },
  } as const;
  
  

// Helper functions
export function keysToNotes(keys: string[]): string[] {
  return keys.map(key => NOTE_MAPPING[key as keyof typeof NOTE_MAPPING] || key);
}

export function notesToKeys(notes: string[]): string[] {
  return notes.map(note => KEY_MAPPING[note as keyof typeof KEY_MAPPING] || note);
}

export function getChordFromNotes(notes: string[]): { name: string; points: number } | null {
  const sortedNotes = [...notes].sort();
  const noteString = sortedNotes.join(",");
  
  // Debug: Log what we're looking for
  console.log("Looking for chord:", noteString);
  console.log("Available main chords:", Object.keys(CHORD_DEFINITIONS).length);
  console.log("Available extended chords:", Object.keys(CHORD_DEFINITIONS_EXTENDED).length);
  
  // Check main chord definitions first
  const mainChord = CHORD_DEFINITIONS[noteString as keyof typeof CHORD_DEFINITIONS];
  if (mainChord) {
    console.log("✅ Found in main chords:", mainChord.name);
    return mainChord;
  }
  
  // Check extended chord definitions
  const extendedChord = CHORD_DEFINITIONS_EXTENDED[noteString as keyof typeof CHORD_DEFINITIONS_EXTENDED];
  if (extendedChord) {
    console.log("✅ Found in extended chords:", extendedChord.name);
    return extendedChord;
  }
  
  console.log("❌ No chord found for:", noteString);
  return null;
}

export function getChordFromKeys(keys: string[]): { name: string; points: number } | null {
  const sortedKeys = [...keys].sort();
  const notes = keysToNotes(sortedKeys);
  return getChordFromNotes(notes);
}
