import { ChangeEvent } from 'react';
import {
  ThemePreset,
  useNeumorphicStylesContext,
} from '../../../providers/NeumorphicStylesProvider';
import style from './themeColorSwitcher.module.scss';

export const ThemeColorSwitcher = () => {
  const { handleChangeTheme } = useNeumorphicStylesContext();

  const handleThemeColorSwitcher = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked === true) {
      handleChangeTheme(ThemePreset.Light);
    } else {
      handleChangeTheme(ThemePreset.Dark);
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
