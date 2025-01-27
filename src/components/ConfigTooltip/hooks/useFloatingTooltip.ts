import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react';
import { useLayoutEffect, useRef } from 'react';

export const useFloatingTooltip = (refElement: HTMLElement | null, arrowHeight: number) => {
  const arrowRef = useRef(null);
  const { x, y, strategy, refs, context } = useFloating({
    middleware: [
      offset(arrowHeight),
      flip(),
      shift(),
      arrow({ element: arrowRef, padding: arrowHeight }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useLayoutEffect(() => {
    if (refElement) refs.setReference(refElement);
  }, [refElement, refs]);

  return { x, y, strategy, refs, context, arrowRef };
};
