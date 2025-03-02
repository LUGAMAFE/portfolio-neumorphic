'use client';

import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

interface NeonColors {
  firstGradientColor: string;
  secondGradientColor: string;
  gradientColorBoxShadow: string;
}

interface NeonColorsContextValue {
  currentNeonColor: string; // el valor actual de la var --main-color-neon o tu gradient
  neonColors: NeonColors;
  handleChangeColorNeon: (option: number) => void;
}

export const NeonColorsContext = createContext<NeonColorsContextValue | undefined>(undefined);

NeonColorsContext.displayName = 'NeonColorsContext';

export const NeonColorsProvider = ({ children }: PropsWithChildren) => {
  // Guarda el valor inicial de la variable CSS --main-color-neon
  const [currentNeonColor, setCurrentNeonColor] = useState('');
  // Guarda los valores para SVG
  const [neonColors, setNeonColors] = useState<NeonColors>({
    firstGradientColor: '#FF6161',
    secondGradientColor: '#FF66DD',
    gradientColorBoxShadow: '#ffb9bf',
  });

  // Cuando el provider monta, obtener el valor de --main-color-neon y almacenarlo en estado.
  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const mainColorNeon = rootStyles.getPropertyValue('--main-color-neon').trim();
    if (!mainColorNeon) {
      throw new Error('No se encontró la variable CSS --main-color-neon');
    }
    setCurrentNeonColor(mainColorNeon);
  }, []);

  // Cambia la variable CSS --main-color-neon y los colores del SVG
  const handleChangeColorNeon = (option: number) => {
    let newNeonColorValue = '';
    let newSVGColors: NeonColors = {
      firstGradientColor: '',
      secondGradientColor: '',
      gradientColorBoxShadow: '',
    };

    switch (option) {
      case 1:
        newNeonColorValue = 'linear-gradient(90deg, #ff6161 0%, #f6d 100%)';
        newSVGColors = {
          firstGradientColor: '#FF6161',
          secondGradientColor: '#FF66DD',
          gradientColorBoxShadow: '#ffb9bf',
        };
        break;
      case 2:
        newNeonColorValue = 'linear-gradient(90deg, #009EFD 0%, #2AF598 100%)';
        newSVGColors = {
          firstGradientColor: '#009EFD',
          secondGradientColor: '#2AF598',
          gradientColorBoxShadow: '#509eff',
        };
        break;
      case 3:
        newNeonColorValue = 'linear-gradient(90deg, #FF1741 0%, #FF6174 100%)';
        newSVGColors = {
          firstGradientColor: '#FF1741',
          secondGradientColor: '#FF6174',
          gradientColorBoxShadow: '#FF355F',
        };
        break;
      default:
        break;
    }

    if (newNeonColorValue) {
      // Actualiza la variable CSS en :root
      document.documentElement.style.setProperty('--main-color-neon', newNeonColorValue);
      // Actualiza el estado
      setCurrentNeonColor(newNeonColorValue);
      setNeonColors(newSVGColors);
    }
  };

  return (
    <NeonColorsContext.Provider
      value={{
        currentNeonColor,
        neonColors,
        handleChangeColorNeon,
      }}
    >
      {children}
    </NeonColorsContext.Provider>
  );
};

export const useNeonColorsContext = () => {
  const context = useContext(NeonColorsContext);
  if (!context) {
    throw new Error('useNeonColorsContext debe usarse dentro de NeonColorsProvider');
  }
  return context;
};
