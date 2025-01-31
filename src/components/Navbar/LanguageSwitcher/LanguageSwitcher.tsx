import { useEffect, useState } from 'react';

import { NeumorphicElement } from '@/components/NeumorphicElement';
import { FormShape } from '@/components/NeumorphicElement/types';
import { useNeonColorsContext } from '@/providers/NeonColorsProvider';
import { LanguageButtonProps } from '../LanguageButton';
import style from './languageSwitcher.module.scss';

export const LanguageSwitcher = () => {
  const { currentNeonColor, neonSVGColors } = useNeonColorsContext();

  const initialButtonConfigs: Omit<LanguageButtonProps, 'clickHandler'>[] = [
    {
      id: 'EsButton',
      text: 'Español',
      className: style.LanguageSwitcher_esButton,
      textClassName: style.LanguageSwitcher_esButtonText,
      neumorphicOptions: {
        form: FormShape.Flat,
        size: 100,
        intensity: 0.15,
        lightSource: 1,
      },
    },
    {
      id: 'EngButton',
      text: 'English',
      className: style.LanguageSwitcher_enButton,
      textClassName: style.LanguageSwitcher_enButtonText,
      neumorphicOptions: {
        form: FormShape.Pressed,
        size: 100,
        intensity: 0.13,
        lightSource: 1,
      },
    },
  ];

  const [buttonConfigs, setButtonConfigs] = useState(initialButtonConfigs);

  useEffect(() => {
    setButtonConfigs((currentConfigs) =>
      currentConfigs.map((config) => {
        if (config.id === 'EsButton') {
          return {
            ...config,
            style: {
              ...config.style,
              backgroundImage: currentNeonColor,
              textShadow: `0px 0px 18px ${neonSVGColors.gradientColorBoxShadow}`,
            },
          };
        } else {
          return config;
        }
      })
    );
  }, [neonSVGColors.gradientColorBoxShadow, currentNeonColor]);

  const handleButtonClick = (id: string | number) => {
    setButtonConfigs((prev) =>
      prev.map((button) =>
        button.id === id
          ? {
              ...button,
              neumorphicOptions: {
                ...button.neumorphicOptions,
                form: button.neumorphicOptions
                  ? button.neumorphicOptions.form === FormShape.Flat
                    ? FormShape.Pressed
                    : FormShape.Flat
                  : FormShape.Flat,
              },
            }
          : button
      )
    );
  };
  return (
    <NeumorphicElement
      className={style.LanguageSwitcher}
      neumorphicOptions={{
        form: FormShape.Level,
        size: 55,
        intensity: 0.19,
        lightSource: 1,
        distance: 6,
        blur: 11,
      }}
    >
      <div className={style.LanguageSwitcher_buttons}>
        {buttonConfigs.map((button) => (
          <NeumorphicElement
            key={button.id}
            element={'button'}
            onClick={() => handleButtonClick(button.id ? button.id : '')}
            neumorphicOptions={button.neumorphicOptions}
            className={button.className}
          >
            <p className={button.textClassName} style={button.style}>
              {button.text}
            </p>
          </NeumorphicElement>
        ))}
      </div>
    </NeumorphicElement>
  );
};
