import { ThemePreset } from '@/providers/AppProviders';
import { ChangeEvent } from 'react';
import { useNeumorphicStylesContext } from '../../../providers/NeumorphicStylesProvider';
import style from './themeColorSwitcher.module.scss';

export const ThemeColorSwitcher = () => {
  const { handleChangeTheme } = useNeumorphicStylesContext();

  const handleThemeColorSwitcher = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked === true) {
      handleChangeTheme(ThemePreset.LIGHT);
    } else {
      handleChangeTheme(ThemePreset.DARK);
    }
  };

  return (
    <div className={style.ThemeColorSwitcher}>
      <p className={style.ThemeColorSwitcher_text}>{'Encender Luces'}</p>
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
