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
    "C,D,G": { name: "Gsus4", points: 50 },
    "A,D,G": { name: "Dsus4", points: 50 },
  
    // ----------------------------
    // ADD CHORDS - 75 POINTS
    // ----------------------------
    "A,C,E,G": { name: "Cadd6", points: 75 },
    "C,D,E,G": { name: "Cadd9", points: 75 },
    "A,C,D,F": { name: "Fadd9", points: 75 },
    "B,D,E,G": { name: "Gadd9", points: 75 },
  
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
    "A,C,D#": { name: "A Diminished", points: 50 },
    "A,C#,E": { name: "A Major (borrowed from A Mixolydian)", points: 50 },
    "A,D,F#": { name: "D Major (secondary dominant of G)", points: 50 },
    "A#,C#,E": { name: "A# Diminished", points: 50 },
    "A#,D,F": { name: "Bb Major (bVII — borrowed from Mixolydian)", points: 50 },
    "A#,D,F,A": { name: "Bb Major 7", points: 100 },
    "A#,D,F#": { name: "D Major (secondary dominant of G)", points: 50 },
    "A#,F,G#": { name: "F Augmented (enharmonic)", points: 50 },
    "A#,F,C": { name: "F Minor (borrowed from parallel minor)", points: 50 },
    "A#,G,D": { name: "G Minor (borrowed from C minor)", points: 50 },
    "B,D#,F#": { name: "B Major (V/vi)", points: 50 },
    "B,D#,F#,A": { name: "B7 (secondary dominant of Em)", points: 100 },
    "B,D#,G#": { name: "G# Minor", points: 50 },
    "B,D#,G#,F#": { name: "G# Minor 7", points: 100 },
    "C,D#,G": { name: "C Minor", points: 50 },
    "C,D#,G,A#": { name: "C Minor 7 (borrowed from C minor)", points: 100 },
    "C,E,G#": { name: "C Augmented", points: 50 },
    "C,E,G#,B": { name: "C Augmented Major 7", points: 100 },
    "C#,E,G#": { name: "C# Diminished", points: 50 },
    "C#,F,G#": { name: "C# Minor", points: 50 },
    "C#,F,G#,B": { name: "C# Minor 7", points: 100 },
    "D,F,G#": { name: "D Augmented", points: 50 },
    "D,F,A#": { name: "D Minor (borrowed flat 6)", points: 50 },
    "D#,G,A#": { name: "D# Minor (Eb Minor)", points: 50 },
    "D#,G,B": { name: "D# Diminished", points: 50 },
    "E,G#,B": { name: "E Major (V/vi)", points: 50 },
    "E,G#,B,D": { name: "E7 (secondary dominant of Am)", points: 100 },
    "F,G#,C": { name: "F Augmented", points: 50 },
    "F#,A#,C#": { name: "F# Diminished", points: 50 },
    "F#,A#,C#,E": { name: "F# Diminished 7", points: 100 },
    "G,A#,D": { name: "G Minor (borrowed from C minor)", points: 50 },
    "G,B,D#": { name: "G Augmented", points: 50 },
    "G#,B,D#": { name: "G# Minor", points: 50 },
    "G#,B,D#,F#": { name: "G# Minor 7", points: 100 },
    "G#,C,D#": { name: "G# Major (Ab Major enharmonic)", points: 50 },
  
    // ----------------------------
    // SUS / ADD CHORDS - 75 POINTS
    // ----------------------------

    "F,A#,C": { name: "F Minor (borrowed)", points: 75 },
  
    // ----------------------------
    // POWER CHORDS (5ths) - 25 POINTS
    // ----------------------------
    "A#,F": { name: "Bb5", points: 25 },
    "D#,A#": { name: "Eb5", points: 25 },
    "G#,D#": { name: "Ab5", points: 25 },
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
  return CHORD_DEFINITIONS[noteString as keyof typeof CHORD_DEFINITIONS] || null;
}

export function getChordFromKeys(keys: string[]): { name: string; points: number } | null {
  const sortedKeys = [...keys].sort();
  const notes = keysToNotes(sortedKeys);
  return getChordFromNotes(notes);
}
