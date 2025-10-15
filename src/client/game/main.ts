import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { MuseRunnerGame } from "./scenes/MuseRunnerGame";
import { MainMenu } from "./scenes/MainMenu";
import * as Phaser from "phaser";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/Preloader";

//  Muse Runner - Rhythm Platformer Game Configuration
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  parent: "game-container",
  backgroundColor: "#2c3e50",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 }, // NO GRAVITY - character rides platforms directly
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1024,
    height: 768,
  },
  scene: [Boot, Preloader, MainMenu, MuseRunnerGame, GameOver],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
