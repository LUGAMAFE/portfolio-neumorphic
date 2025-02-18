import React from 'react';
import { NeonColorsProvider } from './NeonColorsProvider';
import { NeumorphicStylesProvider, NeumorphicThemeSettings } from './NeumorphicStylesProvider';
import { UIStateProvider } from './UIStateProvider';

export enum ThemePreset {
  DARK = 'dark',
  LIGHT = 'light',
  SOLARIZED = 'solarized',
  DRACULA = 'dracula',
}

export const ThemesPresets: Record<ThemePreset, NeumorphicThemeSettings> = {
  [ThemePreset.DARK]: { color: '#26292e', intensity: 0.28 },
  [ThemePreset.LIGHT]: { color: '#ecedee', intensity: 0.15 },
  [ThemePreset.SOLARIZED]: { color: '#002b36', intensity: 0.25 },
  [ThemePreset.DRACULA]: { color: '#282a36', intensity: 0.22 },
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
