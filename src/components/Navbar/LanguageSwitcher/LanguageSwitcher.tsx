import { useState } from 'react';

import { NeumorphicElement } from '@/components/NeumorphicElement';
import { FormShape } from '@/components/NeumorphicElement/types';
import { useNeonColorsContext } from '@/providers/NeonColorsProvider';
import { LanguageButton } from '../LanguageButton';
import style from './languageSwitcher.module.scss';

export const LanguageSwitcher = () => {
  const { neonColors } = useNeonColorsContext();

  const [activeButtonId, setActiveButtonId] = useState('EsButton');

  const buttonList = [
    { id: 'EsButton', text: 'Español' },
    { id: 'EngButton', text: 'English' },
  ];

  const handleButtonClick = (id: string) => {
    setActiveButtonId(id);
  };

  return (
    <NeumorphicElement.div
      className={style.LanguageSwitcher}
      neumorphicOptions={{
        formShape: FormShape.Level,
        size: 55,
        intensity: 0.19,
        lightSource: 1,
        distance: 6,
        blur: 11,
      }}
    >
      <div className={style.LanguageSwitcher_buttons}>
        {buttonList.map(({ id, text }) => {
          const isActive = id === activeButtonId;
          return (
            <LanguageButton
              key={id}
              id={id}
              text={text}
              clickHandler={handleButtonClick}
              className={style.LanguageSwitcher_button}
              textClassName={style.LanguageSwitcher_buttonText}
              neumorphicOptions={{
                formShape: isActive ? FormShape.Pressed : FormShape.Flat,
                size: 100,
                intensity: isActive ? 0.15 : 0.13,
                lightSource: 1,
              }}
              colors={
                isActive
                  ? [neonColors.firstGradientColor, neonColors.secondGradientColor]
                  : ['#ffffff', '#ffffff']
              }
            />
          );
        })}
      </div>
    </NeumorphicElement.div>
  );
};
