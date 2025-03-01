import {
  PropsWithChildren,
  RefObject,
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { NeumorphicOptions } from '../types';
import {
  angleGradient,
  generateNeumorphicColors,
  getFormShape,
  getStylesForFormShape,
} from '../utils';

interface NeumorphicState {
  contextConfig: NeumorphicOptions;
  setContextConfig: (
    configOrFn: NeumorphicOptions | ((prev: NeumorphicOptions) => NeumorphicOptions)
  ) => void;
  updateContextConfigProp: <K extends keyof NeumorphicOptions>(
    property: K,
    value: NeumorphicOptions[K]
  ) => void;
  dimensions: { width: number; height: number };
  setDimensions: (width: number, height: number) => void;
  measureDimensions: RefObject<{
    measure: () => void;
  } | null>;
  computedStyles: {
    colors: ReturnType<typeof generateNeumorphicColors>;
    gradientStyles: ReturnType<typeof getStylesForFormShape>;
    lightPosition: ReturnType<typeof angleGradient>;
    svgLightPosition: ReturnType<typeof angleGradient>;
    stdDeviation: number;
  } | null;
}

const NeumorphicContext = createContext<NeumorphicState | undefined>(undefined);

export const NeumorphicProvider = memo(({ children }: PropsWithChildren) => {
  const [contextConfig, setContext] = useState<NeumorphicOptions>({});
  const [dimensions, setDimensionsState] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const measureDimensions = useRef<{ measure: () => void }>(null);

  const computedStyles = useMemo(() => {
    if (!contextConfig.formShape || !contextConfig.surfaceColor) {
      return null;
    }

    const colors = generateNeumorphicColors(
      contextConfig.surfaceColor,
      contextConfig.depth!,
      contextConfig.concavity!,
      contextConfig.intensity!
    );

    const gradientStyles = getStylesForFormShape(contextConfig.formShape, colors);

    const stdDeviation = (contextConfig.softness ?? 15) / 2;
    const lightPosition = angleGradient(contextConfig.lightSource ?? 1, stdDeviation);
    const svgLightPosition = angleGradient(
      contextConfig.lightSource ?? 1,
      contextConfig.softness ?? 15,
      true
    );

    return {
      colors,
      gradientStyles,
      lightPosition,
      svgLightPosition,
      stdDeviation,
    };
  }, [
    contextConfig.formShape,
    contextConfig.surfaceColor,
    contextConfig.depth,
    contextConfig.concavity,
    contextConfig.intensity,
    contextConfig.softness,
    contextConfig.lightSource,
  ]);

  const setContextConfig = useCallback(
    (configOrFn: NeumorphicOptions | ((prev: NeumorphicOptions) => NeumorphicOptions)) => {
      setContext((prevConfig) => {
        const newConfig = typeof configOrFn === 'function' ? configOrFn(prevConfig) : configOrFn;
        const formShape = getFormShape(newConfig.depth!, newConfig.concavity!);
        return { ...prevConfig, ...newConfig, formShape };
      });
    },
    []
  );

  const updateContextConfigProp = useCallback(
    <K extends keyof NeumorphicOptions>(property: K, value: NeumorphicOptions[K]) => {
      setContext((prevConfig) => {
        const newConfig = { ...prevConfig, [property]: value };

        if (property === 'depth' || property === 'concavity') {
          const depth = property === 'depth' ? (value as number) : (prevConfig.depth ?? 0);
          const concavity =
            property === 'concavity' ? (value as number) : (prevConfig.concavity ?? 0);
          return { ...newConfig, formShape: getFormShape(depth, concavity) };
        }

        return newConfig;
      });
    },
    []
  );

  const setDimensions = useCallback((width: number, height: number) => {
    setDimensionsState({ width, height });
  }, []);

  return (
    <NeumorphicContext.Provider
      value={{
        contextConfig,
        setContextConfig,
        updateContextConfigProp,
        dimensions,
        setDimensions,
        measureDimensions,
        computedStyles,
      }}
    >
      {children}
    </NeumorphicContext.Provider>
  );
});

NeumorphicProvider.displayName = 'NeumorphicProvider';

export const useNeumorphicContext = () => {
  const Neumorphic = useContext(NeumorphicContext);

  if (!Neumorphic) {
    throw new Error('useNeumorphicContext is used outside of NeumorphicProvider');
  }

  return Neumorphic;
};
