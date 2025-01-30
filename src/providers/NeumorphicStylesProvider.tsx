'use client';

import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { colorLuminance } from '../components/NeumorphicElement/utils';

export enum ThemePreset {
  Dark = 'dark',
  Light = 'light',
}

interface NeumorphicStylesState {
  styles: {
    darkColor: string;
    mainColor: string;
    lightColor: string;
    darkGradientColor: string;
    lightGradientColor: string;
  };
  initialMainColorNeon: string;
  initialColorNeonSVG: {
    firstGradientColor: string;
    secondGradientColor: string;
    gradientColorBoxShadow: string;
  };
  colorDifference: number;
  handleChangeTheme: (theme: ThemePreset) => void;
  handleChangeColorNeon: (option: number) => void;
  editorMode: boolean;
  setEditorMode: Dispatch<SetStateAction<boolean>>;
  currentTheme: ThemePreset;
  ctrlButton: boolean;
  setCtrlButton: Dispatch<SetStateAction<boolean>>;
}

export const NeumorphicStylesContext = createContext<NeumorphicStylesState | undefined>(undefined);

const obtainMainClass = (cssVariableName: string) => {
  const rootStyles = getComputedStyle(document.documentElement);
  return rootStyles.getPropertyValue(cssVariableName);
};

const updateColors = (color: string, colorDifference: number) => {
  const darkColor = colorLuminance(color, colorDifference * -1);
  const lightColor = colorLuminance(color, colorDifference);
  const darkGradientColor = colorLuminance(color, 0.07);
  const lightGradientColor = colorLuminance(color, -0.1);

  return {
    darkColor,
    mainColor: color,
    lightColor,
    darkGradientColor,
    lightGradientColor,
  };
};

interface NeumorphicStylesProviderProps {
  colorDifference?: number;
}
export const NeumorphicStylesProvider = ({
  children,
  colorDifference = 0.15,
}: PropsWithChildren<NeumorphicStylesProviderProps>) => {
  const [styles, setStyles] = useState({
    darkColor: '',
    mainColor: '',
    lightColor: '',
    darkGradientColor: '',
    lightGradientColor: '',
  });
  const [initialMainColor, setInitialMainColor] = useState('');
  const [initialMainColorNeon, setInitialMainColorNeon] = useState('');
  const [initialColorNeonSVG, setInitialColorNeonSVG] = useState({
    firstGradientColor: '#FF6161',
    secondGradientColor: '#FF66DD',
    gradientColorBoxShadow: '#ffb9bf',
  });
  const [editorMode, setEditorMode] = useState(false);
  const [ctrlButton, setCtrlButton] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(ThemePreset.Dark);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setEditorMode(true);
  //   }, 10000);
  // }, []);

  useEffect(() => {
    const mainColor = obtainMainClass('--main-color').trim();
    if (!mainColor) throw new Error('No --main-color found in the root element');
    setInitialMainColor(mainColor);
    setStyles(updateColors(mainColor, colorDifference));
    const mainColorNeon = obtainMainClass('--main-color-neon').trim();
    if (!mainColorNeon) throw new Error('No --main-color-neon found in the root element');
    setInitialMainColorNeon(mainColorNeon);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeTheme = (theme: ThemePreset) => {
    setCurrentTheme(theme);
    const newMainColor = theme == ThemePreset.Light ? '#e0e0e0' : initialMainColor;
    document.documentElement.style.setProperty('--main-color', newMainColor);
    setStyles(updateColors(newMainColor, colorDifference));
  };

  const handleChangeColorNeon = (option: number) => {
    let newMainColor = '';
    switch (option) {
      case 1:
        newMainColor = 'linear-gradient(90deg, #ff6161 0%, #f6d 100%)';
        setInitialColorNeonSVG({
          firstGradientColor: '#FF6161',
          secondGradientColor: '#FF66DD',
          gradientColorBoxShadow: '#ffb9bf',
        });
        break;
      case 2:
        newMainColor = 'linear-gradient(90deg, #009EFD 0%, #2AF598 100%)'; // Corregido el color
        setInitialColorNeonSVG({
          firstGradientColor: '#009EFD',
          secondGradientColor: '#2AF598',
          gradientColorBoxShadow: '#509eff',
        });
        break;
      case 3:
        newMainColor = 'linear-gradient(90deg, #FF1741 0%, #FF6174 100%)';
        setInitialColorNeonSVG({
          firstGradientColor: '#FF1741',
          secondGradientColor: '#FF6174',
          gradientColorBoxShadow: ' #FF355F',
        });
        break;
      default:
        break;
    }

    if (newMainColor) {
      setInitialMainColorNeon(newMainColor);
    }
  };

  return (
    <NeumorphicStylesContext.Provider
      value={{
        styles,
        initialMainColorNeon,
        initialColorNeonSVG,
        colorDifference,
        handleChangeTheme,
        handleChangeColorNeon,
        editorMode,
        setEditorMode,
        ctrlButton,
        setCtrlButton,
        currentTheme,
      }}
    >
      {children}
    </NeumorphicStylesContext.Provider>
  );
};

export const useNeumorphicStylesContext = () => {
  const NeumorphicStyles = useContext(NeumorphicStylesContext);

  if (!NeumorphicStyles) {
    throw new Error('useNeumorphicStylesContext is used outside of NeumorphicStylesProvider');
  }

  return NeumorphicStyles;
};
