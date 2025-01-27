import { createContext, PropsWithChildren, ReactNode, useContext, useState } from 'react';

export interface TooltipData {
  refElement: HTMLElement | null;
  content: ReactNode;
  props?: TooltipCustomProps;
}

export interface TooltipCustomProps {
  style?: React.CSSProperties;
}

interface TooltipState {
  tooltipData: TooltipData | null;
  openTooltip: (data: TooltipData) => void;
  closeTooltip: () => void;
}

const TooltipContext = createContext<TooltipState | undefined>(undefined);

export const TooltipProvider = ({ children }: PropsWithChildren) => {
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  const openTooltip = (data: TooltipData) => setTooltipData(data);
  const closeTooltip = () => setTooltipData(null);

  return (
    <TooltipContext.Provider value={{ tooltipData, openTooltip, closeTooltip }}>
      {children}
    </TooltipContext.Provider>
  );
};

export const useTooltip = () => {
  const Tooltip = useContext(TooltipContext);

  if (!Tooltip) {
    throw new Error('useTooltip is used outside of TooltipProvider');
  }

  return Tooltip;
};
