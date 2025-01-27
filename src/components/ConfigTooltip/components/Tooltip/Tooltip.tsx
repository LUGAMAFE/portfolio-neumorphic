import { FloatingArrow } from '@floating-ui/react';
import { useEffect } from 'react';
import { useFloatingTooltip } from '../../hooks/useFloatingTooltip';
import { useTooltip } from '../../providers/TooltipProvider';

interface TooltipProps {
  arrowHeight: number;
  arrowWidth: number;
  arrowFill: string;
}
export const Tooltip = ({ arrowHeight, arrowWidth, arrowFill }: TooltipProps) => {
  const { tooltipData, closeTooltip } = useTooltip();
  const refElement = tooltipData?.refElement || null;
  const { x, y, strategy, refs, arrowRef, context } = useFloatingTooltip(refElement, arrowHeight);

  // Cierra el tooltip al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        refs.floating.current &&
        !refs.floating.current.contains(event.target as Node) &&
        refElement !== event.target
      ) {
        closeTooltip();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [refs.floating, refElement, closeTooltip]);

  if (!tooltipData || !refElement) return null;

  const { content, props } = tooltipData;

  return (
    <div
      ref={refs.setFloating}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
        width: 'max-content',
        ...props?.style,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <FloatingArrow
        ref={arrowRef}
        context={context}
        height={arrowHeight}
        width={arrowWidth}
        fill={arrowFill}
      />
      {content}
    </div>
  );
};
