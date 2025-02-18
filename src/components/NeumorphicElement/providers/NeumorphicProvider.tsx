import {
  PropsWithChildren,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { NeumorphicOptions } from '../types';
import { getFormShape } from '../utils';

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
}

const NeumorphicContext = createContext<NeumorphicState | undefined>(undefined);

export const NeumorphicProvider = ({ children }: PropsWithChildren) => {
  const [contextConfig, setContext] = useState<NeumorphicOptions>({});
  const [dimensions, setDimensionsState] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const measureDimensions = useRef<{ measure: () => void }>(null);

  const setContextConfig = useCallback(
    (configOrFn: NeumorphicOptions | ((prev: NeumorphicOptions) => NeumorphicOptions)) => {
      setContext((prevContextConfig: NeumorphicOptions) => {
        const newConfig =
          typeof configOrFn === 'function' ? configOrFn(prevContextConfig) : configOrFn;

        const formShape = getFormShape(newConfig.depth!, newConfig.concavity!);
        return {
          ...prevContextConfig,
          ...newConfig,
          formShape,
        };
      });
    },
    []
  );

  const updateContextConfigProp = useCallback(
    <K extends keyof NeumorphicOptions>(property: K, value: NeumorphicOptions[K]) => {
      setContext((prevContextConfig: NeumorphicOptions) => {
        const newConfig = {
          ...prevContextConfig,
          [property]: value,
        };

        if (property === 'depth' || property === 'concavity') {
          const depth = property === 'depth' ? (value as number) : (prevContextConfig.depth ?? 0);
          const concavity =
            property === 'concavity' ? (value as number) : (prevContextConfig.concavity ?? 0);

          return {
            ...newConfig,
            formShape: getFormShape(depth, concavity),
          };
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
      }}
    >
      {children}
    </NeumorphicContext.Provider>
  );
};

export const useNeumorphicContext = () => {
  const Neumorphic = useContext(NeumorphicContext);

  if (!Neumorphic) {
    throw new Error('useNeumorphicContext is used outside of NeumorphicProvider');
  }

  return Neumorphic;
};
