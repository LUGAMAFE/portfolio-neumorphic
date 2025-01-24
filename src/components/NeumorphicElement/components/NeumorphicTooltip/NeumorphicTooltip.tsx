import { useNeumorphicStylesContext } from '@/providers/NeumorphicStylesProvider';
import { FloatingArrow, useDismiss, useInteractions } from '@floating-ui/react';
import {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { calculateDisplayStyle, getContrast } from '../../utils';

import { useFloatingTooltip } from '../../hooks/useFloating';
import { useNeumorphicContext } from '../../providers/NeumorphicProvider';
import Configuration from './Configuration/Configuration';

const ARROW_HEIGHT = 10;
const ARROW_WIDTH = 16;

interface NeuToolTipProps {
  refElement: HTMLElement | null;
  setRefProps: Dispatch<SetStateAction<object>>;
  onClick?: MouseEventHandler<Element>;
}
const eventClose = new CustomEvent('closeNeu', {
  bubbles: true,
});

export const NeumorphicTooltip = ({ refElement, setRefProps, onClick }: NeuToolTipProps) => {
  const {
    ctrlButton,
    styles: { mainColor },
  } = useNeumorphicStylesContext();
  const {
    contextConfig: { color },
  } = useNeumorphicContext();
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { x, y, strategy, refs, context } = useFloatingTooltip({
    isOpen,
    setIsOpen,
    arrowRef,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([useDismiss(context)]);

  const closeTooltip = useCallback((e: MouseEvent) => {
    if (e.target !== e.currentTarget) {
      setIsOpen(false);
    }
  }, []);

  const display = useMemo(() => calculateDisplayStyle(refElement), [refElement]);

  useEffect(() => {
    if (refElement === null) return;
    refElement.addEventListener('click', closeTooltip);
    return () => refElement.removeEventListener('click', closeTooltip);
  }, [refElement, closeTooltip]);

  useEffect(() => {
    setRefProps({
      ...getReferenceProps({
        onClick(e) {
          const closest = (e.target as Element).closest('.neuElement');
          if (closest == e.currentTarget) {
            setIsOpen((prev) => {
              if (!ctrlButton) {
                return !prev;
              }
              if (e.ctrlKey) {
                return !prev;
              }
              return false;
            });
            e.currentTarget.dispatchEvent(eventClose);
          }
          if (onClick) onClick(e);
        },
      }),
    });
  }, [getReferenceProps, setRefProps]);

  useLayoutEffect(() => {
    refs.setReference(refElement);
  }, [refs, refElement]);

  return (
    <>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            width: 'max-content',
            ...display,
          }}
          {...getFloatingProps({
            onClick(e) {
              e.stopPropagation();
            },
          })}
        >
          <FloatingArrow
            ref={arrowRef}
            context={context}
            width={ARROW_WIDTH}
            height={ARROW_HEIGHT}
            fill={getContrast(color || mainColor)}
            tipRadius={2}
          />
          <Configuration />
        </div>
      )}
    </>
  );
};
