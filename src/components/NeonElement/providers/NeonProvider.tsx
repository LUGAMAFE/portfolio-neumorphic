import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { NeonOptions } from '../types';

interface NeonState {
  contextConfig: NeonOptions;
  setContextConfig: Dispatch<SetStateAction<NeonOptions>>;
  updateContextConfigProp: <K extends keyof NeonOptions>(
    property: K,
    value: NeonOptions[K]
  ) => void;
}

const NeonContext = createContext<NeonState | undefined>(undefined);

export const NeonProvider = ({ children }: PropsWithChildren) => {
  const [contextConfig, setContextConfig] = useState<NeonOptions>({});

  const updateContextConfigProp = useCallback(
    <K extends keyof NeonOptions>(property: K, value: NeonOptions[K]) => {
      setContextConfig((prevContextConfig: NeonOptions) => ({
        ...prevContextConfig,
        [property]: value,
      }));
    },
    []
  );

  return (
    <NeonContext.Provider
      value={{
        contextConfig,
        setContextConfig,
        updateContextConfigProp,
      }}
    >
      {children}
    </NeonContext.Provider>
  );
};

export const useNeonContext = () => {
  const Neon = useContext(NeonContext);

  if (!Neon) {
    throw new Error('useNeonContext is used outside of NeonProvider');
  }

  return Neon;
};
