'use client';

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface UIStateContextValue {
  editorMode: boolean;
  setEditorMode: Dispatch<SetStateAction<boolean>>;
  ctrlButton: boolean;
  setCtrlButton: Dispatch<SetStateAction<boolean>>;
}

export const UIStateContext = createContext<UIStateContextValue | undefined>(undefined);

export const UIStateProvider = ({ children }: PropsWithChildren) => {
  const [editorMode, setEditorMode] = useState(false);
  const [ctrlButton, setCtrlButton] = useState(true);

  return (
    <UIStateContext.Provider value={{ editorMode, setEditorMode, ctrlButton, setCtrlButton }}>
      {children}
    </UIStateContext.Provider>
  );
};

export const useUIStateContext = () => {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error('useUIStateContext debe usarse dentro de UIStateProvider');
  }
  return context;
};
