export type Styles = {
  grid: string;
  grid__col: string;
  grid__row: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
