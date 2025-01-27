import React, { ReactNode, useRef } from 'react';
import { TooltipCustomProps, useTooltip } from '../../providers/TooltipProvider';

interface TooltipEnabledProps {
  content: ReactNode;
  children: (props: {
    ref: React.Ref<HTMLElement>;
    onClick: React.MouseEventHandler<HTMLElement>;
  }) => ReactNode;
  tooltipCustomProps?: TooltipCustomProps;
}

export const TooltipEnabled = ({ children, content, tooltipCustomProps }: TooltipEnabledProps) => {
  const { openTooltip } = useTooltip();
  const refElement = useRef<HTMLElement | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.ctrlKey) {
      openTooltip({
        refElement: refElement.current,
        content,
        props: tooltipCustomProps,
      });
    }
  };

  return (
    <>
      {children({
        ref: refElement,
        onClick: handleClick,
      })}
    </>
  );
};
