import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react';

const ARROW_HEIGHT = 10;
const GAP = 0;

export interface useFloatingTooltipProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  arrowRef: React.RefObject<null>;
}

export const useFloatingTooltip = ({ isOpen, setIsOpen, arrowRef }: useFloatingTooltipProps) => {
  const { x, y, strategy, refs, context } = useFloating({
    whileElementsMounted: autoUpdate,
    placement: 'bottom',
    middleware: [
      arrow({
        element: arrowRef,
      }),
      offset(ARROW_HEIGHT + GAP),
      flip(),
      shift(),
    ],
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  return { x, y, strategy, refs, context };
};
