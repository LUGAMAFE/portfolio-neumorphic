import { ThemePreset } from '@/providers/AppProviders';
import { useNeonColorsContext } from '@/providers/NeonColorsProvider';
import { useNeumorphicStylesContext } from '@/providers/NeumorphicStylesProvider';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { NeonElement } from '../NeonElement';
import { NeumorphicElement } from '../NeumorphicElement';
import { FormShape } from '../NeumorphicElement/types';
import { LanguageSwitcher } from './LanguageSwitcher';
import style from './navbar.module.scss';
import { ThemeColorSwitcher } from './ThemeColorSwitcher';

interface NavbarProps {
  setIsSidebarMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export const Navbar = ({ setIsSidebarMenuOpen }: NavbarProps) => {
  const { currentTheme } = useNeumorphicStylesContext();
  const { neonColors } = useNeonColorsContext();

  const [buttonConfig, setButtonConfig] = useState({
    id: 'externalButton',
    className: style.Navbar__button,
    formShape: FormShape.Concave,
    intensity: 0.45,
    lightSource: 1,
    distance: 4,
    blur: 9,
  });

  const handleButtonClick = (id: string | number) => {
    setIsSidebarMenuOpen((prevIsSidebarMenuOpen) => !prevIsSidebarMenuOpen);
    setButtonConfig((prevButtonConfig) =>
      prevButtonConfig.id === id
        ? {
            ...prevButtonConfig,
            formShape:
              prevButtonConfig.formShape === FormShape.Concave
                ? FormShape.Pressed
                : FormShape.Concave,
          }
        : prevButtonConfig
    );
  };

  const neumorphicOptionsContainer =
    currentTheme.name === ThemePreset.LIGHT
      ? {
          formShape: FormShape.Level,
          color: '#ebebeb',
          intensity: 0.01,
          lightSource: 3,
          distance: 2,
          blur: 1,
        }
      : {
          formShape: FormShape.Pressed,
          intensity: 0.42,
          lightSource: 3,
          distance: 20,
          blur: 40,
        };
  const colors =
    currentTheme.name === ThemePreset.DARK
      ? ['#ffffff', '#ffffff']
      : [neonColors.firstGradientColor, neonColors.secondGradientColor];
  return (
    <NeumorphicElement.div
      className={style.Navbar}
      data-testid="navbar"
      {...neumorphicOptionsContainer}
      color={currentTheme.color}
    >
      <div className={style.Navbar__logo}>
        <NeonElement.p color1={colors[0]} color2={colors[1]} blur={4}>
          {'<LUGAMAFE />'}
        </NeonElement.p>
      </div>

      <ThemeColorSwitcher />
      <LanguageSwitcher />
      <div className={style.Navbar__menuToggle}>
        <NeumorphicElement.button
          key={buttonConfig.id}
          onClick={() => handleButtonClick(buttonConfig.id)}
          {...buttonConfig}
          color={currentTheme.color}
          className={buttonConfig.className}
          id="externalButton"
        >
          <Image
            src="/images/bx-menu.svg"
            width={500}
            height={500}
            alt="hamburger"
            className={style.Navbar__hamburger}
          />
        </NeumorphicElement.button>
      </div>
      <NeonElement.div
        className={style.Navbar__bottomNeon}
        showFlare
        color1={neonColors.firstGradientColor}
        color2={neonColors.secondGradientColor}
        intensity={0.5}
        speed={4}
      ></NeonElement.div>
    </NeumorphicElement.div>
  );
};
