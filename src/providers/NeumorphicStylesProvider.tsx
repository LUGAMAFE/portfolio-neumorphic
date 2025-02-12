'use client';

import { createContext, PropsWithChildren, useContext, useState } from 'react';

/**
 * Mapa con múltiples temas: { "dark": "#333", "light": "#f5f5f5", ... }
 * - La clave es el nombre del tema (string).
 * - El valor es el color principal.
 */
export type NeumorphicThemeMap = Record<string, string>;

export type NeumorphicTheme = {
  color: string;
  name: string;
};

/**
 * Interfaz para lo que se expone en el contexto.
 */
interface NeumorphicStylesContextValue {
  currentTheme: NeumorphicTheme;
  handleChangeTheme: (themeName: string) => void;
}

/**
 * Creación del contexto.
 */
export const NeumorphicStylesContext = createContext<NeumorphicStylesContextValue | undefined>(
  undefined
);

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
}

/**
 * Provider para manejar múltiples temas neumórficos sin leer nada del CSS.
 */
export function NeumorphicStylesProvider({
  children,
  themes,
  defaultTheme,
}: PropsWithChildren<NeumorphicStylesProviderProps>) {
  if (!themes) {
    throw new Error('themes es requerido en NeumorphicStylesProvider.');
  }
  // Verificamos que el tema por defecto exista en 'themes'.
  if (!themes[defaultTheme]) {
    throw new Error(`El tema por defecto "${defaultTheme}" no está definido en "themes".`);
  }
  // Almacenamos el nombre del tema actual (ej: "dark", "light", etc.).
  const [currentTheme, setCurrentTheme] = useState({
    color: themes[defaultTheme],
    name: defaultTheme,
  });

  /**
   * Cambia al tema indicado por 'themeName' (debe existir en 'themes').
   */
  const handleChangeTheme = (themeName: string) => {
    if (!themes[themeName]) {
      console.warn(`El tema "${themeName}" no está definido en "themes". Se mantiene el actual.`);
      return;
    }
    setCurrentTheme({
      color: themes[themeName],
      name: themeName,
    });
  };

  return (
    <NeumorphicStylesContext.Provider
      value={{
        currentTheme,
        handleChangeTheme,
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
