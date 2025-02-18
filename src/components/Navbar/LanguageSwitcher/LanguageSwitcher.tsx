import { useState } from 'react';

import { NeumorphicElement } from '@/components/NeumorphicElement';
import { useNeonColorsContext } from '@/providers/NeonColorsProvider';
import { useNeumorphicStylesContext } from '@/providers/NeumorphicStylesProvider';
import { LanguageButton } from '../LanguageButton';
import style from './languageSwitcher.module.scss';

export const LanguageSwitcher = () => {
  const { neonColors } = useNeonColorsContext();
  const { currentTheme } = useNeumorphicStylesContext();

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
      concavity={0}
      depth={0.8}
      lightSource={1}
      softness={5}
      surfaceColor={currentTheme.color}
      intensity={currentTheme.intensity}
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
              colors={
                isActive
                  ? [neonColors.firstGradientColor, neonColors.secondGradientColor]
                  : ['#ffffff', '#ffffff']
              }
              concavity={isActive ? -0.9 : 0}
              depth={isActive ? -0.4 : 0}
              lightSource={1}
              surfaceColor={currentTheme.color}
              intensity={currentTheme.intensity}
            />
          );
        })}
      </div>
    </NeumorphicElement.div>
  );
};
