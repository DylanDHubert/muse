import { GAME_CONSTANTS, GameKey } from "../config/GameConstants";

// Note frequencies for each game key (C major scale + chromatic notes)
const NOTE_FREQUENCIES: Record<GameKey, number> = {
  S: 261.63, // C4
  D: 293.66, // D4
  F: 329.63, // E4
  G: 349.23, // F4
  H: 392.0, // G4
  J: 440.0, // A4
  K: 493.88, // B4
  // Chromatic notes
  R: 311.13, // D#4 (Eb4)
  U: 415.30, // G#4 (Ab4)
  I: 466.16, // Bb4
  // LOWER OCTAVE NOTES (same note names for chord detection)
  A: 246.94, // B3 (one octave below K)
  L: 523.25, // C5 (one octave above S)
  ";": 587.33, // D5 (one octave above D)
  "'": 659.25, // E5 (one octave above F)
};

export interface IAudioManager {
  initialize(): void;
  playNote(key: GameKey): void;
  stopNote(key: GameKey): void;
  isAudioAvailable(): boolean;
  updateLFORate(delta: number): void;
  updateChorusDepth(delta: number): void;
  updateDelayVolume(delta: number): void;
  updateReverbAmount(delta: number): void;
  switchWaveform(): void;
  // GROUND MECHANICS AUDIO
  playGroundC2(): void;
  stopGroundC2(): void;
  playDissonance(intensity: number): void;
  stopDissonance(): void;
}

export class AudioManager implements IAudioManager {
  private audioContext: AudioContext | null = null;
  private isInitialized: boolean = false;
  private audioAvailable: boolean = false;
  
  // SYNTHESIS PARAMETERS
  private lfoRate: number = 2.0; // Hz - vibrato speed
  private chorusDepth: number = 0.1; // 0-1 - detuning amount
  private delayTime: number = 0.25; // seconds - FIXED delay time
  private delayVolume: number = 0.3; // 0-1 - delay wet level
  private reverbAmount: number = 0.3; // 0-1 - reverb wet/dry mix
  private distortionAmount: number = 0.2; // 0-1 - wave shaping amount
  private currentWaveform: OscillatorType = "sawtooth"; // CURRENT WAVEFORM
  
  // SUSTAIN SYSTEM
  private activeNotes: Map<GameKey, {
    oscillators: OscillatorNode[];
    gainNode: GainNode;
    isSustaining: boolean;
  }> = new Map();
  
  // GROUND MECHANICS AUDIO
  private groundC2Oscillators: OscillatorNode[] = [];
  private groundC2Gain: GainNode | null = null;
  private dissonanceOscillator: OscillatorNode | null = null;
  private dissonanceGain: GainNode | null = null;

  initialize(): void {
    try {
      // Initialize Web Audio API context
      this.audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      this.audioAvailable = true;
      this.isInitialized = true;
      // AudioManager initialized successfully
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

    // IF NOTE IS ALREADY PLAYING, DON'T START ANOTHER
    if (this.activeNotes.has(key)) {
      return;
    }

    try {
      this.startSustainedNote(key, frequency);
    } catch (error) {
      console.warn("Failed to play note:", error);
    }
  }

  stopNote(key: GameKey): void {
    const activeNote = this.activeNotes.get(key);
    if (activeNote) {
      // FADE OUT GRACEFULLY
      const now = this.audioContext!.currentTime;
      activeNote.gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      
      // STOP ALL OSCILLATORS AFTER FADE
      setTimeout(() => {
        activeNote.oscillators.forEach(osc => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (e) {
            // Oscillator might already be stopped
          }
        });
        activeNote.gainNode.disconnect();
        this.activeNotes.delete(key);
      }, 100);
    }
  }

  isAudioAvailable(): boolean {
    return this.audioAvailable;
  }

  // ARROW KEY CONTROLS FOR SYNTHESIS PARAMETERS
  updateLFORate(delta: number): void {
    this.lfoRate = Math.max(0.1, Math.min(10, this.lfoRate + delta));
    console.log(`LFO Rate: ${this.lfoRate.toFixed(1)} Hz`);
  }

  updateChorusDepth(delta: number): void {
    this.chorusDepth = Math.max(0, Math.min(1, this.chorusDepth + delta));
    console.log(`Chorus Depth: ${(this.chorusDepth * 100).toFixed(0)}%`);
  }

  updateDelayVolume(delta: number): void {
    this.delayVolume = Math.max(0, Math.min(1, this.delayVolume + delta));
    console.log(`Delay Volume: ${(this.delayVolume * 100).toFixed(0)}%`);
  }

  updateReverbAmount(delta: number): void {
    this.reverbAmount = Math.max(0, Math.min(1, this.reverbAmount + delta));
    console.log(`Reverb Amount: ${(this.reverbAmount * 100).toFixed(0)}%`);
  }

  switchWaveform(): void {
    const waveforms: OscillatorType[] = ["sawtooth", "square", "triangle", "sine"];
    const currentIndex = waveforms.indexOf(this.currentWaveform);
    const nextIndex = (currentIndex + 1) % waveforms.length;
    this.currentWaveform = waveforms[nextIndex];
    console.log(`🎵 Waveform switched to: ${this.currentWaveform}`);
  }

  // GETTERS FOR SYNTHESIS PARAMETERS
  getLFORate(): number { return this.lfoRate; }
  getChorusDepth(): number { return this.chorusDepth; }
  getDelayVolume(): number { return this.delayVolume; }
  getReverbAmount(): number { return this.reverbAmount; }
  getDistortionAmount(): number { return this.distortionAmount; }
  getCurrentWaveform(): OscillatorType { return this.currentWaveform; }

  private startSustainedNote(key: GameKey, frequency: number): void {
    if (!this.audioContext) return;

    // CREATE MAIN OSCILLATOR WITH LFO VIBRATO
    const mainOsc = this.audioContext.createOscillator();
    const lfoOsc = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    
    // LFO SETUP FOR VIBRATO
    lfoOsc.frequency.setValueAtTime(this.lfoRate, this.audioContext.currentTime);
    lfoOsc.type = "sine";
    lfoGain.gain.setValueAtTime(2, this.audioContext.currentTime); // REDUCED VIBRATO DEPTH
    
    lfoOsc.connect(lfoGain);
    lfoGain.connect(mainOsc.frequency);
    
    // MAIN OSCILLATOR SETUP
    mainOsc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    mainOsc.type = this.currentWaveform;
    
    // CREATE CHORUS EFFECT (MULTIPLE DETUNED OSCILLATORS)
    const chorusOsc1 = this.audioContext.createOscillator();
    const chorusOsc2 = this.audioContext.createOscillator();
    const chorusGain1 = this.audioContext.createGain();
    const chorusGain2 = this.audioContext.createGain();
    
    // DETUNE CHORUS OSCILLATORS
    const detuneAmount = this.chorusDepth * 10; // REDUCED DETUNING
    chorusOsc1.frequency.setValueAtTime(frequency + detuneAmount, this.audioContext.currentTime);
    chorusOsc2.frequency.setValueAtTime(frequency - detuneAmount, this.audioContext.currentTime);
    chorusOsc1.type = this.currentWaveform;
    chorusOsc2.type = this.currentWaveform;
    
    // CHORUS VOLUME (QUIETER THAN MAIN)
    chorusGain1.gain.setValueAtTime(0.2, this.audioContext.currentTime); // REDUCED
    chorusGain2.gain.setValueAtTime(0.2, this.audioContext.currentTime); // REDUCED
    
    // CREATE DELAY
    const delay = this.audioContext.createDelay();
    const delayGain = this.audioContext.createGain();
    const delayFeedback = this.audioContext.createGain();
    
    delay.delayTime.setValueAtTime(this.delayTime, this.audioContext.currentTime);
    delayGain.gain.setValueAtTime(this.delayVolume, this.audioContext.currentTime); // DELAY WET LEVEL (CONTROLLABLE)
    delayFeedback.gain.setValueAtTime(0.2, this.audioContext.currentTime); // FEEDBACK AMOUNT
    
    // CREATE DISTORTION
    const distortion = this.audioContext.createWaveShaper();
    const distortionCurve = this.createDistortionCurve(this.distortionAmount * 0.5); // REDUCED DISTORTION
    distortion.curve = distortionCurve;
    distortion.oversample = "2x"; // REDUCED OVERSAMPLING
    
    // CREATE MAIN GAIN NODE
    const mainGain = this.audioContext.createGain();
    
    // CONNECT AUDIO GRAPH
    mainOsc.connect(mainGain);
    chorusOsc1.connect(chorusGain1).connect(mainGain);
    chorusOsc2.connect(chorusGain2).connect(mainGain);
    
    // SPLIT SIGNAL: DRY AND WET (DELAY)
    const dryGain = this.audioContext.createGain();
    const wetGain = this.audioContext.createGain();
    
    dryGain.gain.setValueAtTime(1 - this.delayVolume, this.audioContext.currentTime); // DRY LEVEL (CONTROLLABLE)
    wetGain.gain.setValueAtTime(this.delayVolume, this.audioContext.currentTime); // WET LEVEL (CONTROLLABLE)
    
    mainGain.connect(dryGain);
    mainGain.connect(wetGain);
    
    // DELAY CHAIN
    wetGain.connect(delay);
    delay.connect(delayGain);
    delay.connect(delayFeedback);
    delayFeedback.connect(delay); // FEEDBACK LOOP
    delayGain.connect(distortion);
    
    // COMBINE DRY AND WET
    const outputGain = this.audioContext.createGain();
    dryGain.connect(outputGain);
    distortion.connect(outputGain);
    outputGain.connect(this.audioContext.destination);
    
    // SET SUSTAIN VOLUME
    const now = this.audioContext.currentTime;
    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(GAME_CONSTANTS.AUDIO.VOLUME * 0.5, now + 0.01); // QUICK ATTACK
    
    // START ALL OSCILLATORS
    mainOsc.start(now);
    lfoOsc.start(now);
    chorusOsc1.start(now);
    chorusOsc2.start(now);
    
    // STORE ACTIVE NOTE
    this.activeNotes.set(key, {
      oscillators: [mainOsc, lfoOsc, chorusOsc1, chorusOsc2],
      gainNode: mainGain,
      isSustaining: true
    });
  }

  private playMusicalTone(frequency: number): void {
    if (!this.audioContext) return;

    // CREATE MAIN OSCILLATOR WITH LFO VIBRATO
    const mainOsc = this.audioContext.createOscillator();
    const lfoOsc = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    
    // LFO SETUP FOR VIBRATO
    lfoOsc.frequency.setValueAtTime(this.lfoRate, this.audioContext.currentTime);
    lfoOsc.type = "sine";
    lfoGain.gain.setValueAtTime(5, this.audioContext.currentTime); // 5Hz vibrato depth
    
    lfoOsc.connect(lfoGain);
    lfoGain.connect(mainOsc.frequency);
    
    // MAIN OSCILLATOR SETUP
    mainOsc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    mainOsc.type = "sawtooth"; // RICHER SOUND THAN SINE
    
    // CREATE CHORUS EFFECT (MULTIPLE DETUNED OSCILLATORS)
    const chorusOsc1 = this.audioContext.createOscillator();
    const chorusOsc2 = this.audioContext.createOscillator();
    const chorusGain1 = this.audioContext.createGain();
    const chorusGain2 = this.audioContext.createGain();
    
    // DETUNE CHORUS OSCILLATORS
    const detuneAmount = this.chorusDepth * 20; // 0-20 cents detuning
    chorusOsc1.frequency.setValueAtTime(frequency + detuneAmount, this.audioContext.currentTime);
    chorusOsc2.frequency.setValueAtTime(frequency - detuneAmount, this.audioContext.currentTime);
    chorusOsc1.type = "sawtooth";
    chorusOsc2.type = "sawtooth";
    
    // CHORUS VOLUME (QUIETER THAN MAIN)
    chorusGain1.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    chorusGain2.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    
    // CREATE FILTER
    const filter = this.audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(this.filterFrequency, this.audioContext.currentTime);
    filter.Q.setValueAtTime(1, this.audioContext.currentTime); // RESONANCE
    
    // CREATE DISTORTION
    const distortion = this.audioContext.createWaveShaper();
    const distortionCurve = this.createDistortionCurve(this.distortionAmount);
    distortion.curve = distortionCurve;
    distortion.oversample = "4x";
    
    // CREATE REVERB USING DELAY (FIXED FEEDBACK)
    const reverbDelay = this.audioContext.createDelay();
    const reverbGain = this.audioContext.createGain();
    const reverbFeedback = this.audioContext.createGain();
    
    reverbDelay.delayTime.setValueAtTime(0.1, this.audioContext.currentTime); // SHORTER DELAY
    reverbGain.gain.setValueAtTime(this.reverbAmount * 0.3, this.audioContext.currentTime); // REDUCED GAIN
    reverbFeedback.gain.setValueAtTime(0.1, this.audioContext.currentTime); // MUCH LOWER FEEDBACK
    
    // CREATE MAIN GAIN NODE
    const mainGain = this.audioContext.createGain();
    
    // CONNECT AUDIO GRAPH
    mainOsc.connect(mainGain);
    chorusOsc1.connect(chorusGain1).connect(mainGain);
    chorusOsc2.connect(chorusGain2).connect(mainGain);
    
    mainGain.connect(filter);
    filter.connect(distortion);
    
    // SPLIT SIGNAL: DRY AND WET (REVERB)
    const dryGain = this.audioContext.createGain();
    const wetGain = this.audioContext.createGain();
    
    dryGain.gain.setValueAtTime(1 - this.reverbAmount, this.audioContext.currentTime);
    wetGain.gain.setValueAtTime(this.reverbAmount, this.audioContext.currentTime);
    
    distortion.connect(dryGain);
    distortion.connect(wetGain);
    
    // REVERB CHAIN (FIXED ROUTING)
    wetGain.connect(reverbDelay);
    reverbDelay.connect(reverbFeedback);
    reverbFeedback.connect(reverbDelay); // CONTROLLED FEEDBACK
    reverbDelay.connect(outputGain); // DIRECT TO OUTPUT, NO LOOP
    
    // COMBINE DRY AND WET
    const outputGain = this.audioContext.createGain();
    dryGain.connect(outputGain);
    wetGain.connect(outputGain);
    outputGain.connect(this.audioContext.destination);
    
    // ENVELOPE (ADSR)
    const now = this.audioContext.currentTime;
    const attackTime = 0.01;
    const decayTime = 0.1;
    const sustainLevel = 0.7;
    const releaseTime = 0.3;
    const noteDuration = GAME_CONSTANTS.AUDIO.NOTE_DURATION;
    
    // ATTACK
    outputGain.gain.setValueAtTime(0, now);
    outputGain.gain.linearRampToValueAtTime(GAME_CONSTANTS.AUDIO.VOLUME, now + attackTime);
    
    // DECAY
    outputGain.gain.linearRampToValueAtTime(
      GAME_CONSTANTS.AUDIO.VOLUME * sustainLevel, 
      now + attackTime + decayTime
    );
    
    // RELEASE
    outputGain.gain.exponentialRampToValueAtTime(
      0.001, 
      now + noteDuration
    );
    
    // START ALL OSCILLATORS
    mainOsc.start(now);
    lfoOsc.start(now);
    chorusOsc1.start(now);
    chorusOsc2.start(now);
    
    // STOP ALL OSCILLATORS
    const stopTime = now + noteDuration;
    mainOsc.stop(stopTime);
    lfoOsc.stop(stopTime);
    chorusOsc1.stop(stopTime);
    chorusOsc2.stop(stopTime);
  }
  
  private createDistortionCurve(amount: number): Float32Array {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    
    return curve;
  }
  
  // GROUND MECHANICS AUDIO METHODS
  playGroundC2(): void {
    if (!this.audioContext || this.groundC2Oscillators.length > 0) return;
    
    // CREATE RICH PAD-LIKE C2 BASS WITH MULTIPLE OSCILLATORS
    this.groundC2Gain = this.audioContext.createGain();
    const now = this.audioContext.currentTime;
    
    // FUNDAMENTAL C2 (65.41 Hz) - SINE WAVE
    const fundamental = this.audioContext.createOscillator();
    fundamental.frequency.setValueAtTime(GAME_CONSTANTS.GAME.C2_FREQUENCY, now);
    fundamental.type = "sine";
    
    // OCTAVE C3 (130.81 Hz) - SAWTOOTH FOR RICHNESS
    const octave = this.audioContext.createOscillator();
    octave.frequency.setValueAtTime(GAME_CONSTANTS.GAME.C2_FREQUENCY * 2, now);
    octave.type = "sawtooth";
    
    // FIFTH G2 (98.00 Hz) - TRIANGLE FOR WARMTH
    const fifth = this.audioContext.createOscillator();
    fifth.frequency.setValueAtTime(GAME_CONSTANTS.GAME.C2_FREQUENCY * 1.5, now);
    fifth.type = "triangle";
    
    // SUB-BASS C1 (32.70 Hz) - SINE FOR DEEP FOUNDATION
    const subBass = this.audioContext.createOscillator();
    subBass.frequency.setValueAtTime(GAME_CONSTANTS.GAME.C2_FREQUENCY * 0.5, now);
    subBass.type = "sine";
    
    // CREATE INDIVIDUAL GAIN NODES FOR MIXING
    const fundamentalGain = this.audioContext.createGain();
    const octaveGain = this.audioContext.createGain();
    const fifthGain = this.audioContext.createGain();
    const subBassGain = this.audioContext.createGain();
    
    // SET VOLUME LEVELS FOR RICH PAD SOUND
    fundamentalGain.gain.setValueAtTime(0.4, now); // FUNDAMENTAL
    octaveGain.gain.setValueAtTime(0.2, now); // OCTAVE (QUIETER)
    fifthGain.gain.setValueAtTime(0.3, now); // FIFTH
    subBassGain.gain.setValueAtTime(0.3, now); // SUB-BASS
    
    // CONNECT OSCILLATORS TO THEIR GAINS
    fundamental.connect(fundamentalGain);
    octave.connect(octaveGain);
    fifth.connect(fifthGain);
    subBass.connect(subBassGain);
    
    // CONNECT ALL TO MAIN GAIN
    fundamentalGain.connect(this.groundC2Gain);
    octaveGain.connect(this.groundC2Gain);
    fifthGain.connect(this.groundC2Gain);
    subBassGain.connect(this.groundC2Gain);
    
    // CONNECT TO AUDIO CONTEXT
    this.groundC2Gain.connect(this.audioContext.destination);
    
    // SET MAIN VOLUME (QUIET, SUSTAINED)
    this.groundC2Gain.gain.setValueAtTime(0, now);
    this.groundC2Gain.gain.linearRampToValueAtTime(GAME_CONSTANTS.AUDIO.VOLUME * 0.4, now + 0.8);
    
    // START ALL OSCILLATORS
    fundamental.start(now);
    octave.start(now);
    fifth.start(now);
    subBass.start(now);
    
    // STORE OSCILLATORS
    this.groundC2Oscillators = [fundamental, octave, fifth, subBass];
  }
  
  stopGroundC2(): void {
    if (this.groundC2Oscillators.length > 0 && this.groundC2Gain) {
      const now = this.audioContext!.currentTime;
      this.groundC2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      
      setTimeout(() => {
        try {
          // STOP ALL OSCILLATORS
          this.groundC2Oscillators.forEach(osc => {
            osc.stop();
            osc.disconnect();
          });
          this.groundC2Gain!.disconnect();
        } catch (e) {
          // Oscillators might already be stopped
        }
        this.groundC2Oscillators = [];
        this.groundC2Gain = null;
      }, 300);
    }
  }
  
  playDissonance(intensity: number): void {
    if (!this.audioContext || this.dissonanceOscillator) return;
    
    // CREATE DISSONANT OSCILLATOR (TRITONE ABOVE C2)
    this.dissonanceOscillator = this.audioContext.createOscillator();
    this.dissonanceGain = this.audioContext.createGain();
    
    // TRITONE FREQUENCY (C2 + 6 semitones = F#2)
    const dissonanceFreq = GAME_CONSTANTS.GAME.C2_FREQUENCY * Math.pow(2, 6/12);
    this.dissonanceOscillator.frequency.setValueAtTime(dissonanceFreq, this.audioContext.currentTime);
    this.dissonanceOscillator.type = "sawtooth"; // HARSH, DISSONANT
    
    // CONNECT TO AUDIO CONTEXT
    this.dissonanceOscillator.connect(this.dissonanceGain);
    this.dissonanceGain.connect(this.audioContext.destination);
    
    // SET VOLUME BASED ON INTENSITY
    const now = this.audioContext.currentTime;
    this.dissonanceGain.gain.setValueAtTime(0, now);
    this.dissonanceGain.gain.linearRampToValueAtTime(intensity * GAME_CONSTANTS.AUDIO.VOLUME * 0.2, now + 0.3);
    
    // START OSCILLATOR
    this.dissonanceOscillator.start(now);
  }
  
  stopDissonance(): void {
    if (this.dissonanceOscillator && this.dissonanceGain) {
      const now = this.audioContext!.currentTime;
      this.dissonanceGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      
      setTimeout(() => {
        try {
          this.dissonanceOscillator!.stop();
          this.dissonanceOscillator!.disconnect();
          this.dissonanceGain!.disconnect();
        } catch (e) {
          // Oscillator might already be stopped
        }
        this.dissonanceOscillator = null;
        this.dissonanceGain = null;
      }, 300);
    }
  }
}
