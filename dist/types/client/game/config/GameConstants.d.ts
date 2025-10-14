export type GameKey = "S" | "D" | "F" | "G" | "H" | "J" | "K";
export declare const GAME_CONSTANTS: {
  readonly CHARACTER: {
    readonly SPEED: 100;
    readonly WIDTH: 30;
    readonly HEIGHT: 40;
    readonly COLOR: 3447003;
    readonly VISUAL_FEEDBACK_COLOR: 15965202;
    readonly VISUAL_FEEDBACK_DURATION: 200;
  };
  readonly PLATFORMS: {
    readonly WIDTH: 120;
    readonly HEIGHT: 20;
    readonly EXTENSION_DISTANCE: 150;
    readonly AHEAD_OFFSET: 20;
    readonly CENTER_OFFSET: 80;
    readonly CLEANUP_DISTANCE: 400;
  };
  readonly AUDIO: {
    readonly NOTE_DURATION: 0.5;
    readonly ATTACK_TIME: 0.01;
    readonly VOLUME: 0.3;
  };
  readonly GAME: {
    readonly OVER_FALL_DISTANCE: 300;
    readonly SCORE_PER_PLATFORM: 10;
    readonly GROUND_OFFSET: 60;
    readonly CHARACTER_HEIGHT_LERP_SPEED: 0.08;
    readonly FALL_VELOCITY: 300;
  };
  readonly LEVEL_HEIGHTS: Record<GameKey, number>;
  readonly LEVEL_COLORS: Record<GameKey, number>;
  readonly VALID_KEYS: readonly GameKey[];
};
