import { useNeumorphicStylesContext } from '@/providers/NeumorphicStylesProvider';
import { useUIStateContext } from '@/providers/UIStateProvider';
import { arrow, flip, offset, shift } from '@floating-ui/react';
import { PropsWithChildren, useRef } from 'react';
import {
  HandleTriggerClickParams,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from '../../../Tooltip/Tooltip';
import { useNeumorphicContext } from '../../providers/NeumorphicProvider';
import { getContrast } from '../../utils';
import Configuration from '../NeumorphicTooltip/Configuration/Configuration';

const ARROW_HEIGHT = 10;
const ARROW_WIDTH = 16;

export interface TooltipWrapperProps extends PropsWithChildren {
  open: boolean;
  setOpen: (open: boolean) => void;
  allowClicks: boolean;
}
export const TooltipWrapper = ({ children, open, setOpen, allowClicks }: TooltipWrapperProps) => {
  const arrowRef = useRef(null);
  const {
    contextConfig: { color },
  } = useNeumorphicContext();

  const {
    styles: { mainColor },
  } = useNeumorphicStylesContext();

  const { editorMode } = useUIStateContext();

  const middleWares = [
    offset(ARROW_HEIGHT),
    flip(),
    shift(),
    arrow({
      element: arrowRef,
      padding: 10,
    }),
  ];

  const handleTriggerClick = (
    ev: React.MouseEvent,
    { open, setOpen }: HandleTriggerClickParams
  ) => {
    if (editorMode) {
      return;
    }
    if (ev.ctrlKey) {
      setOpen(!open);
    }
  };

  return (
    <Tooltip
      open={open}
      onOpenChange={setOpen}
      middlewares={middleWares}
      nested
      nestedAllowClicks={allowClicks}
      triggerClickHandler={handleTriggerClick}
    >
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
