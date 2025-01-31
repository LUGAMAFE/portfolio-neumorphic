import { ThemePreset } from '@/providers/AppProviders';
import { useNeonColorsContext } from '@/providers/NeonColorsProvider';
import { useNeumorphicStylesContext } from '@/providers/NeumorphicStylesProvider';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { NeumorphicElement } from '../NeumorphicElement';
import { FormShape, NeumorphicElementProps } from '../NeumorphicElement/types';
import { LanguageSwitcher } from './LanguageSwitcher';
import style from './navbar.module.scss';
import { ThemeColorSwitcher } from './ThemeColorSwitcher';

interface NavbarProps {
  setIsSidebarMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export const Navbar = ({ setIsSidebarMenuOpen }: NavbarProps) => {
  const { currentTheme } = useNeumorphicStylesContext();
  const { currentNeonColor } = useNeonColorsContext();

  const initialButtonConfigs: NeumorphicElementProps<'button'>[] = [
    {
      id: 'externalButton',
      className: style.Navbar__button,
      neumorphicOptions: {
        form: FormShape.Flat,
        size: 43,
        intensity: 0.45,
        lightSource: 1,
        distance: 4,
        blur: 9,
      },
    },
  ];

  const [buttonConfig, setButtonConfig] = useState(initialButtonConfigs[0] || null);

  const handleButtonClick = (id: string | number) => {
    setIsSidebarMenuOpen((prevIsSidebarMenuOpen) => !prevIsSidebarMenuOpen);
    setButtonConfig((prevButtonConfig) =>
      prevButtonConfig.id === id
        ? {
            ...prevButtonConfig,
            neumorphicOptions: {
              ...prevButtonConfig.neumorphicOptions,
              form: prevButtonConfig.neumorphicOptions
                ? prevButtonConfig.neumorphicOptions.form === FormShape.Concave
                  ? FormShape.Pressed
                  : FormShape.Concave
                : FormShape.Concave,
            },
          }
        : prevButtonConfig
    );
  };

  const neumorphicOptionsContainer =
    currentTheme === ThemePreset.LIGHT
      ? {
          form: FormShape.Level,
          color: '#ebebeb',
          size: 10,
          intensity: 0.01,
          lightSource: 3,
          distance: 2,
          blur: 1,
        }
      : {
          form: FormShape.Pressed,
          size: 196,
          intensity: 0.42,
          lightSource: 3,
          distance: 20,
          blur: 40,
        };

  return (
    <NeumorphicElement
      className={style.Navbar}
      data-testid="navbar"
      neumorphicOptions={neumorphicOptionsContainer}
    >
      <div className={style.Navbar__logo}>
        <p>{'<LUGAMAFE/>'}</p>
      </div>
      <ThemeColorSwitcher />
      <LanguageSwitcher />
      <div className={style.Navbar__menuToggle}>
        <NeumorphicElement
          key={buttonConfig.id}
          element={'button'}
          onClick={() => handleButtonClick(buttonConfig.id ? buttonConfig.id : '')}
          neumorphicOptions={buttonConfig.neumorphicOptions}
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
        </NeumorphicElement>
      </div>
      <div
        className={style.Navbar__bottomNeon}
        style={{
          backgroundImage: currentNeonColor,
        }}
      ></div>
    </NeumorphicElement>
  );
};
