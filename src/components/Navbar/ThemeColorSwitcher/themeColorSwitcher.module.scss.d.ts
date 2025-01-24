export type Styles = {
  ThemeColorSwitcher: string;
  ThemeColorSwitcher_text: string;
  ThemeColorSwitcher_toggle: string;
  ThemeColorSwitcher_toggleCheckbox: string;
  ThemeColorSwitcher_toggleSwitch: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
