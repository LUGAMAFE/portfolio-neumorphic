export type Styles = {
  pressed: string;
  softShadow: string;
  svgInnerShadow: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
