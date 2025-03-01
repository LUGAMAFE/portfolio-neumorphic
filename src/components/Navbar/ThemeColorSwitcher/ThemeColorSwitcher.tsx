import { NeonElement } from '@/components/NeonElement';
import { ThemePreset } from '@/providers/AppProviders';
import { ChangeEvent, memo, useEffect } from 'react';
import { usePrefersTheme } from 'react-haiku';
import { useNeumorphicStylesContext } from '../../../providers/NeumorphicStylesProvider';
import style from './themeColorSwitcher.module.scss';

export const ThemeColorSwitcher = memo(() => {
  const theme = usePrefersTheme(ThemePreset.DARK);
  const { handleChangeTheme, currentTheme } = useNeumorphicStylesContext();

  const handleThemeColorSwitcher = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked === true) {
      handleChangeTheme(ThemePreset.LIGHT);
    } else {
      handleChangeTheme(ThemePreset.DARK);
    }
  };

  useEffect(() => {
    handleChangeTheme(theme as ThemePreset);
  }, [theme]);

  const colors =
    currentTheme.name === ThemePreset.DARK ? ['#ffffff', '#ffffff'] : ['#a3a3a3', '#4d4d4d'];

  return (
    <div className={style.ThemeColorSwitcher}>
      <NeonElement.span
        className={style.ThemeColorSwitcher_text}
        color1={colors[0]}
        color2={colors[1]}
        blur={4}
      >
        {currentTheme.name === ThemePreset.DARK ? 'Encender Luces' : 'Apagar Luces'}
      </NeonElement.span>
      <label className={style.ThemeColorSwitcher_toggle}>
        <input
          onChange={handleThemeColorSwitcher}
          className={style.ThemeColorSwitcher_toggleCheckbox}
          type="checkbox"
          checked={currentTheme.name === ThemePreset.LIGHT}
        ></input>
        <div className={style.ThemeColorSwitcher_toggleSwitch}></div>
      </label>
    </div>
  );
});

ThemeColorSwitcher.displayName = 'ThemeColorSwitcher';
