import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { NeumorphicOptions } from '../types';

interface NeumorphicState {
  contextConfig: NeumorphicOptions;
  setContextConfig: Dispatch<SetStateAction<NeumorphicOptions>>;
  updateContextConfigProp: <K extends keyof NeumorphicOptions>(
    property: K,
    value: NeumorphicOptions[K]
  ) => void;
}

const NeumorphicContext = createContext<NeumorphicState | undefined>(undefined);

export const NeumorphicProvider = ({ children }: PropsWithChildren) => {
  const [contextConfig, setContextConfig] = useState<NeumorphicOptions>({});

  const updateContextConfigProp = useCallback(
    <K extends keyof NeumorphicOptions>(property: K, value: NeumorphicOptions[K]) => {
      setContextConfig((prevContextConfig: NeumorphicOptions) => ({
        ...prevContextConfig,
        [property]: value,
      }));
    },
    []
  );

  return (
    <NeumorphicContext.Provider
      value={{
        contextConfig,
        setContextConfig,
        updateContextConfigProp,
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
