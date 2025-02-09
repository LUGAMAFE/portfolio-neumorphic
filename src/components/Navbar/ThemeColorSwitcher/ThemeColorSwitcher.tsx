import { NeonElement } from '@/components/NeonElement';
import { ThemePreset } from '@/providers/AppProviders';
import { ChangeEvent } from 'react';
import { useNeumorphicStylesContext } from '../../../providers/NeumorphicStylesProvider';
import style from './themeColorSwitcher.module.scss';

export const ThemeColorSwitcher = () => {
  const { handleChangeTheme, currentTheme } = useNeumorphicStylesContext();

  const handleThemeColorSwitcher = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked === true) {
      handleChangeTheme(ThemePreset.LIGHT);
    } else {
      handleChangeTheme(ThemePreset.DARK);
    }
  };

  const colors =
    currentTheme === ThemePreset.DARK ? ['#ffffff', '#ffffff'] : ['#a3a3a3', '#4d4d4d'];

  return (
    <div className={style.ThemeColorSwitcher}>
      <NeonElement.span
        className={style.ThemeColorSwitcher_text}
        color1={colors[0]}
        color2={colors[1]}
        blur={4}
      >
        {currentTheme === ThemePreset.DARK ? 'Encender Luces' : 'Apagar Luces'}
      </NeonElement.span>
      <label className={style.ThemeColorSwitcher_toggle}>
        <input
          onChange={handleThemeColorSwitcher}
          className={style.ThemeColorSwitcher_toggleCheckbox}
          type="checkbox"
        ></input>
        <div className={style.ThemeColorSwitcher_toggleSwitch}></div>
      </label>
    </div>
  );
};
