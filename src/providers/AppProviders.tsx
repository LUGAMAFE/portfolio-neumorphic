import React from 'react';
import { NeonColorsProvider } from './NeonColorsProvider';
import { NeumorphicStylesProvider } from './NeumorphicStylesProvider';
import { UIStateProvider } from './UIStateProvider';

export enum ThemePreset {
  DARK = 'dark',
  LIGHT = 'light',
  SOLARIZED = 'solarized',
  DRACULA = 'dracula',
}

export const ThemesPresets: Record<ThemePreset, string> = {
  [ThemePreset.DARK]: '#26292e',
  [ThemePreset.LIGHT]: '#ecedee',
  [ThemePreset.SOLARIZED]: '#002b36',
  [ThemePreset.DRACULA]: '#282a36',
};

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <NeumorphicStylesProvider defaultTheme={ThemePreset.DARK} themes={ThemesPresets}>
      <NeonColorsProvider>
        <UIStateProvider>{children}</UIStateProvider>
      </NeonColorsProvider>
    </NeumorphicStylesProvider>
  );
}
