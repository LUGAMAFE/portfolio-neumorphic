'use client';

import { colorLuminance } from '@/components/NeumorphicElement/utils';
import { createContext, PropsWithChildren, useContext, useState } from 'react';

/**
 * Mapa con múltiples temas: { "dark": "#333", "light": "#f5f5f5", ... }
 * - La clave es el nombre del tema (string).
 * - El valor es el color principal.
 */
export type NeumorphicThemeMap = Record<string, string>;

/**
 * Estructura con los colores resultantes (claro, oscuro, gradientes).
 */
interface NeumorphicStyles {
  darkColor: string;
  mainColor: string;
  lightColor: string;
  darkGradientColor: string;
  lightGradientColor: string;
}

/**
 * Interfaz para lo que se expone en el contexto.
 */
interface NeumorphicStylesContextValue {
  styles: NeumorphicStyles;
  currentTheme: string;
  handleChangeTheme: (themeName: string) => void;
  colorDifference: number;
}

/**
 * Creación del contexto.
 */
export const NeumorphicStylesContext = createContext<NeumorphicStylesContextValue | undefined>(
  undefined
);

/**
 * Genera los colores neumórficos a partir de un color base y una diferencia.
 */
const generateNeumorphicColors = (color: string, difference: number): NeumorphicStyles => ({
  darkColor: colorLuminance(color, -difference),
  mainColor: color,
  lightColor: colorLuminance(color, difference),
  darkGradientColor: colorLuminance(color, 0.07),
  lightGradientColor: colorLuminance(color, -0.1),
});

interface NeumorphicStylesProviderProps {
  /**
   * Mapa con varios temas. Ejemplo:
   * {
   *   dark: '#333333',
   *   light: '#f5f5f5',
   *   solarized: '#002b36'
   * }
   */
  themes: NeumorphicThemeMap;

  /**
   * Tema inicial que se aplicará al montar el provider.
   * Debe ser una de las claves definidas en 'themes'.
   */
  defaultTheme: string;

  /**
   * Diferencia de luminancia (por defecto 0.15).
   * Afecta a qué tan claros u oscuros son darkColor y lightColor.
   */
  colorDifference?: number;
}

/**
 * Provider para manejar múltiples temas neumórficos sin leer nada del CSS.
 */
export function NeumorphicStylesProvider({
  children,
  themes,
  defaultTheme,
  colorDifference = 0.15,
}: PropsWithChildren<NeumorphicStylesProviderProps>) {
  // Almacenamos el nombre del tema actual (ej: "dark", "light", etc.).
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  // Inicializamos los estilos basado en el tema por defecto.
  const [styles, setStyles] = useState<NeumorphicStyles>(() => {
    return generateNeumorphicColors(themes[defaultTheme], colorDifference);
  });

  /**
   * Cambia al tema indicado por 'themeName' (debe existir en 'themes').
   */
  const handleChangeTheme = (themeName: string) => {
    if (!themes[themeName]) {
      console.warn(`El tema "${themeName}" no está definido en "themes". Se mantiene el actual.`);
      return;
    }
    setCurrentTheme(themeName);
    document.documentElement.style.setProperty('--main-color', themes[themeName]);
    setStyles(generateNeumorphicColors(themes[themeName], colorDifference));
  };

  return (
    <NeumorphicStylesContext.Provider
      value={{
        styles,
        currentTheme,
        handleChangeTheme,
        colorDifference,
      }}
    >
      {children}
    </NeumorphicStylesContext.Provider>
  );
}

/**
 * Hook para consumir el contexto.
 */
export function useNeumorphicStylesContext(): NeumorphicStylesContextValue {
  const context = useContext(NeumorphicStylesContext);
  if (!context) {
    throw new Error('useNeumorphicStylesContext debe usarse dentro de NeumorphicStylesProvider');
  }
  return context;
}
