import { useNeumorphicStylesContext } from '@/providers/NeumorphicStylesProvider';
import { arrow, flip, offset, shift } from '@floating-ui/react';
import { PropsWithChildren, useRef } from 'react';
import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from '../Tooltip/Tooltip';
import Configuration from './components/NeumorphicTooltip/Configuration/Configuration';
import { useNeumorphicContext } from './providers/NeumorphicProvider';
import { getContrast } from './utils';

const ARROW_HEIGHT = 10;
const ARROW_WIDTH = 16;

export interface TooltipWrapperProps extends PropsWithChildren {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export const TooltipWrapper = ({ children, open, setOpen }: TooltipWrapperProps) => {
  const arrowRef = useRef(null);
  const {
    contextConfig: { color },
  } = useNeumorphicContext();

  const {
    styles: { mainColor },
  } = useNeumorphicStylesContext();

  const middleWares = [
    arrow({
      element: arrowRef,
    }),
    offset(ARROW_HEIGHT),
    flip(),
    shift(),
  ];
  return (
    <Tooltip open={open} onOpenChange={setOpen} middlewares={middleWares} nested>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent style={{ zIndex: 1000 }}>
        <Configuration />
        <TooltipArrow
          ref={arrowRef}
          width={ARROW_WIDTH}
          height={ARROW_HEIGHT}
          tipRadius={2}
          fill={getContrast(color || mainColor)}
        />
      </TooltipContent>
    </Tooltip>
  );
};
