import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    // REMOVED: Background image and progress bars that were persisting behind the game
    // The game now loads cleanly without old UI elements
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");

    this.load.image("logo", "logo.png");
    this.load.image("player", "player.png");
    
    // Preload the Nabla font to ensure it's available
    this.load.setPath("assets/fonts");
    this.load.font("nabla", "nabla.ttf");

    // Assets loaded - spark texture removed to fix freezing issue
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start("MainMenu");
  }
}
