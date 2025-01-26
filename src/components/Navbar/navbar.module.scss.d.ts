export type Styles = {
  'flare-move': string;
  'move-gradient': string;
  Navbar: string;
  Navbar__bottomNeon: string;
  Navbar__button: string;
  Navbar__hamburger: string;
  Navbar__logo: string;
  Navbar__menuToggle: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
