export type Styles = {
  LanguageSwitcher: string;
  LanguageSwitcher_buttons: string;
  LanguageSwitcher_enButton: string;
  LanguageSwitcher_enButtonText: string;
  LanguageSwitcher_esButton: string;
  LanguageSwitcher_esButtonText: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
