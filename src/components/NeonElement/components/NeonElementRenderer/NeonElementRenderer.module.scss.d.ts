export type Styles = {
  'flare-move': string;
  flicker: string;
  'move-gradient': string;
  'move-gradient1': string;
  'move-gradient2': string;
  neon: string;
  neon_conic: string;
  neon_flare: string;
  'neon-spin': string;
  stop1: string;
  stop2: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
