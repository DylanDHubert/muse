import * as Phaser from "phaser";
import { AudioManager } from "../audio/AudioManager";

export interface SynthControlConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class SynthControlPanel {
  private scene: Phaser.Scene;
  private audioManager: AudioManager;
  private config: SynthControlConfig;
  
  // SIMPLE VISUAL COMPONENTS
  private panelBackground!: Phaser.GameObjects.Graphics;
  private titleText!: Phaser.GameObjects.Text;
  
  // CONTROL LABELS AND VALUES
  private lfoLabel!: Phaser.GameObjects.Text;
  private lfoValue!: Phaser.GameObjects.Text;
  private chorusLabel!: Phaser.GameObjects.Text;
  private chorusValue!: Phaser.GameObjects.Text;
  private delayLabel!: Phaser.GameObjects.Text;
  private delayValue!: Phaser.GameObjects.Text;
  private reverbLabel!: Phaser.GameObjects.Text;
  private reverbValue!: Phaser.GameObjects.Text;
  private waveformLabel!: Phaser.GameObjects.Text;
  private waveformValue!: Phaser.GameObjects.Text;
  
  constructor(scene: Phaser.Scene, audioManager: AudioManager, config: SynthControlConfig) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.config = config;
  }
  
  create(): void {
    this.createPanelBackground();
    this.createTitle();
    this.createControls();
  }
  
  private createPanelBackground(): void {
    const { x, y, width, height } = this.config;
    
    // SIMPLE PANEL BACKGROUND
    this.panelBackground = this.scene.add.graphics();
    this.panelBackground.setScrollFactor(0);
    this.panelBackground.setDepth(100);
    
    // DARK BACKGROUND
    this.panelBackground.fillStyle(0x2c3e50, 0.9);
    this.panelBackground.fillRoundedRect(x, y, width, height, 8);
    
    // SIMPLE BORDER
    this.panelBackground.lineStyle(2, 0x7f8c8d, 1);
    this.panelBackground.strokeRoundedRect(x, y, width, height, 8);
  }
  
  private createTitle(): void {
    const { x, y, width } = this.config;
    
    this.titleText = this.scene.add.text(x + width / 2, y + 15, "🎛️ SYNTH CONTROLS", {
      fontSize: "14px",
      color: "#ecf0f1",
      fontFamily: "Nabla, system-ui",
      stroke: "#000000",
      strokeThickness: 1,
    });
    this.titleText.setOrigin(0.5, 0.5);
    this.titleText.setScrollFactor(0);
    this.titleText.setDepth(101);
  }
  
  private createControls(): void {
    const { x, y, width } = this.config;
    const startY = y + 35;
    const spacing = width / 5;
    
    // LFO CONTROL
    this.lfoLabel = this.scene.add.text(x + spacing * 0.5, startY, "LFO", {
      fontSize: "14px",
      color: "#f39c12",
      fontFamily: "Nabla, system-ui",
      stroke: "#000000",
      strokeThickness: 2,
    });
    this.lfoLabel.setOrigin(0.5, 0.5);
    this.lfoLabel.setScrollFactor(0);
    this.lfoLabel.setDepth(101);
    
    this.lfoValue = this.scene.add.text(x + spacing * 0.5, startY + 25, "2.0Hz", {
      fontSize: "12px",
      color: "#ffffff",
      fontFamily: "Nabla, system-ui",
      stroke: "#000000",
      strokeThickness: 2,
    });
    this.lfoValue.setOrigin(0.5, 0.5);
    this.lfoValue.setScrollFactor(0);
    this.lfoValue.setDepth(101);
    
    // CHORUS CONTROL
    this.chorusLabel = this.scene.add.text(x + spacing * 1.5, startY, "CHORUS", {
      fontSize: "14px",
      color: "#3498db",
      fontFamily: "Nabla, system-ui",
      stroke: "#000000",
      strokeThickness: 2,
    });
    this.chorusLabel.setOrigin(0.5, 0.5);
    this.chorusLabel.setScrollFactor(0);
    this.chorusLabel.setDepth(101);
    
    this.chorusValue = this.scene.add.text(x + spacing * 1.5, startY + 25, "10%", {
      fontSize: "12px",
      color: "#ffffff",
      fontFamily: "Nabla, system-ui",
      stroke: "#000000",
      strokeThickness: 2,
    });
    this.chorusValue.setOrigin(0.5, 0.5);
    this.chorusValue.setScrollFactor(0);
    this.chorusValue.setDepth(101);
    
    // DELAY CONTROL
    this.delayLabel = this.scene.add.text(x + spacing * 2.5, startY, "DELAY", {
      fontSize: "14px",
      color: "#2ecc71",
      fontFamily: "Nabla, system-ui",
      stroke: "#000000",
      strokeThickness: 2,
    });
    this.delayLabel.setOrigin(0.5, 0.5);
    this.delayLabel.setScrollFactor(0);
    this.delayLabel.setDepth(101);
    
    this.delayValue = this.scene.add.text(x + spacing * 2.5, startY + 25, "30%", {
      fontSize: "12px",
      color: "#ffffff",
      fontFamily: "Nabla, system-ui",
      stroke: "#000000",
      strokeThickness: 2,
    });
    this.delayValue.setOrigin(0.5, 0.5);
    this.delayValue.setScrollFactor(0);
    this.delayValue.setDepth(101);
    
    // REVERB CONTROL
    this.reverbLabel = this.scene.add.text(x + spacing * 3.5, startY, "REVERB", {
      fontSize: "14px",
      color: "#9b59b6",
      fontFamily: "Nabla, system-ui",
      stroke: "#000000",
      strokeThickness: 2,
    });
    this.reverbLabel.setOrigin(0.5, 0.5);
    this.reverbLabel.setScrollFactor(0);
    this.reverbLabel.setDepth(101);
    
    this.reverbValue = this.scene.add.text(x + spacing * 3.5, startY + 25, "30%", {
      fontSize: "12px",
      color: "#ffffff",
      fontFamily: "Nabla, system-ui",
      stroke: "#000000",
      strokeThickness: 2,
    });
    this.reverbValue.setOrigin(0.5, 0.5);
    this.reverbValue.setScrollFactor(0);
    this.reverbValue.setDepth(101);
    
    // WAVEFORM CONTROL
    this.waveformLabel = this.scene.add.text(x + spacing * 4.5, startY, "WAVE", {
      fontSize: "14px",
      color: "#f39c12",
      fontFamily: "Nabla, system-ui",
      stroke: "#000000",
      strokeThickness: 2,
    });
    this.waveformLabel.setOrigin(0.5, 0.5);
    this.waveformLabel.setScrollFactor(0);
    this.waveformLabel.setDepth(101);
    
    this.waveformValue = this.scene.add.text(x + spacing * 4.5, startY + 25, "SAW", {
      fontSize: "12px",
      color: "#ffffff",
      fontFamily: "Nabla, system-ui",
      stroke: "#000000",
      strokeThickness: 2,
    });
    this.waveformValue.setOrigin(0.5, 0.5);
    this.waveformValue.setScrollFactor(0);
    this.waveformValue.setDepth(101);
  }
  
  update(): void {
    // GET CURRENT AUDIO PARAMETERS
    const lfoRate = this.audioManager.getLFORate();
    const chorusDepth = this.audioManager.getChorusDepth();
    const delayVolume = this.audioManager.getDelayVolume();
    const reverbAmount = this.audioManager.getReverbAmount();
    const waveform = this.audioManager.getCurrentWaveform();
    
    // UPDATE VALUES
    this.lfoValue.setText(`${lfoRate.toFixed(1)}Hz`);
    this.chorusValue.setText(`${(chorusDepth * 100).toFixed(0)}%`);
    this.delayValue.setText(`${(delayVolume * 100).toFixed(0)}%`);
    this.reverbValue.setText(`${(reverbAmount * 100).toFixed(0)}%`);
    this.waveformValue.setText(waveform.toUpperCase());
  }
  
  updateLayout(): void {
    const { width, height } = this.scene.scale;
    
    // USE FULL SCREEN WIDTH WITH MARGINS
    const panelWidth = width - 24; // 12px margin on each side
    let panelHeight = 80;
    let fontSize = 14;
    let valueFontSize = 12;
    let startY = 85;
    
    // RESPONSIVE SCALING BASED ON SCREEN WIDTH
    if (width < 480) {
      // VERY SMALL MOBILE
      panelHeight = 60;
      fontSize = 10;
      valueFontSize = 8;
      startY = 70;
    } else if (width < 768) {
      // MOBILE
      panelHeight = 70;
      fontSize = 12;
      valueFontSize = 10;
      startY = 75;
    } else if (width < 1024) {
      // TABLET
      panelHeight = 80;
      fontSize = 14;
      valueFontSize = 12;
      startY = 85;
    } else {
      // DESKTOP
      panelHeight = 90;
      fontSize = 16;
      valueFontSize = 14;
      startY = 95;
    }
    
    // UPDATE CONFIG
    this.config = {
      x: 12,
      y: 50,
      width: panelWidth,
      height: panelHeight
    };
    
    // UPDATE PANEL BACKGROUND
    if (this.panelBackground) {
      this.panelBackground.clear();
      this.panelBackground.fillStyle(0x2c3e50, 0.9);
      this.panelBackground.fillRoundedRect(12, 50, panelWidth, panelHeight, 8);
      this.panelBackground.lineStyle(2, 0x7f8c8d, 1);
      this.panelBackground.strokeRoundedRect(12, 50, panelWidth, panelHeight, 8);
    }
    
    // UPDATE TITLE
    if (this.titleText) {
      this.titleText.setPosition(12 + panelWidth / 2, 65);
      this.titleText.setFontSize(`${fontSize + 2}px`);
    }
    
    // UPDATE CONTROL POSITIONS AND FONT SIZES
    const spacing = panelWidth / 5;
    
    if (this.lfoLabel) {
      this.lfoLabel.setPosition(12 + spacing * 0.5, startY);
      this.lfoLabel.setFontSize(`${fontSize}px`);
    }
    if (this.lfoValue) {
      this.lfoValue.setPosition(12 + spacing * 0.5, startY + 25);
      this.lfoValue.setFontSize(`${valueFontSize}px`);
    }
    
    if (this.chorusLabel) {
      this.chorusLabel.setPosition(12 + spacing * 1.5, startY);
      this.chorusLabel.setFontSize(`${fontSize}px`);
    }
    if (this.chorusValue) {
      this.chorusValue.setPosition(12 + spacing * 1.5, startY + 25);
      this.chorusValue.setFontSize(`${valueFontSize}px`);
    }
    
    if (this.delayLabel) {
      this.delayLabel.setPosition(12 + spacing * 2.5, startY);
      this.delayLabel.setFontSize(`${fontSize}px`);
    }
    if (this.delayValue) {
      this.delayValue.setPosition(12 + spacing * 2.5, startY + 25);
      this.delayValue.setFontSize(`${valueFontSize}px`);
    }
    
    if (this.reverbLabel) {
      this.reverbLabel.setPosition(12 + spacing * 3.5, startY);
      this.reverbLabel.setFontSize(`${fontSize}px`);
    }
    if (this.reverbValue) {
      this.reverbValue.setPosition(12 + spacing * 3.5, startY + 25);
      this.reverbValue.setFontSize(`${valueFontSize}px`);
    }
    
    if (this.waveformLabel) {
      this.waveformLabel.setPosition(12 + spacing * 4.5, startY);
      this.waveformLabel.setFontSize(`${fontSize}px`);
    }
    if (this.waveformValue) {
      this.waveformValue.setPosition(12 + spacing * 4.5, startY + 25);
      this.waveformValue.setFontSize(`${valueFontSize}px`);
    }
  }
  
  destroy(): void {
    // CLEAN UP ALL COMPONENTS
    this.panelBackground?.destroy();
    this.titleText?.destroy();
    this.lfoLabel?.destroy();
    this.lfoValue?.destroy();
    this.chorusLabel?.destroy();
    this.chorusValue?.destroy();
    this.delayLabel?.destroy();
    this.delayValue?.destroy();
    this.reverbLabel?.destroy();
    this.reverbValue?.destroy();
    this.waveformLabel?.destroy();
    this.waveformValue?.destroy();
  }
}