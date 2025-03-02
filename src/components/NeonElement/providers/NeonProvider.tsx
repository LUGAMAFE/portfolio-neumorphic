import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
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
NeonContext.displayName = 'NeonContext';
export const NeonProvider = memo(({ children }: PropsWithChildren) => {
  const [contextConfig, setContextConfig] = useState<NeonOptions>({});

  const updateContextConfigProp = useCallback(
    <K extends keyof NeonOptions>(property: K, value: NeonOptions[K]) => {
      setContextConfig((prevContextConfig: NeonOptions) => ({
        ...prevContextConfig,
        [property]: value,
      }));
    },
    [setContextConfig]
  );

  const contextValue = useMemo(
    () => ({
      contextConfig,
      setContextConfig,
      updateContextConfigProp,
    }),
    [contextConfig, setContextConfig, updateContextConfigProp]
  );

  return <NeonContext.Provider value={contextValue}>{children}</NeonContext.Provider>;
});

NeonProvider.displayName = 'NeonProvider';

export const useNeonContext = () => {
  const Neon = useContext(NeonContext);

  if (!Neon) {
    throw new Error('useNeonContext is used outside of NeonProvider');
  }

  return Neon;
};
