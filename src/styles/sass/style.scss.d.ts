export type Styles = {
  grid: string;
  grid__col: string;
  grid__row: string;
  title___level2: string;
  'title--level-1': string;
  'title--level-3': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
