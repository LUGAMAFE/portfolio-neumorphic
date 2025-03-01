import { useMergeRefs } from '@floating-ui/react';
import clsx from 'clsx';
import {
  CSSProperties,
  ForwardedRef,
  JSX,
  PropsWithChildren,
  cloneElement,
  forwardRef,
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import styles from '../components/NeumorphicElementRenderer/NeumorphicElementRenderer.module.scss';
import { TooltipWrapper } from '../components/TooltipWrapper';
import { DEFAULT_CONFIG } from '../constants';
import { useNeumorphicValidation } from '../hooks/useNeumorphicValidation';
import { NeumorphicProvider, useNeumorphicContext } from '../providers/NeumorphicProvider';
import { NeumorphicProps } from '../types';
import { getContrast } from '../utils';

const NeumorphicWrapperWithProvider = forwardRef(
  <T extends HTMLElement | SVGElement>(
    props: PropsWithChildren<NeumorphicProps>,
    ref: ForwardedRef<T>
  ) => {
    const { allowClicks = true, ...rest } = props;
    const [open, setOpen] = useState(false);

    return (
      <NeumorphicProvider>
        <TooltipWrapper open={open} setOpen={setOpen} allowClicks={allowClicks}>
          <NeumorphicLogic {...rest} ref={ref} />
        </TooltipWrapper>
      </NeumorphicProvider>
    );
  }
);

const NeumorphicLogic = memo(
  forwardRef(
    <T extends HTMLElement | SVGElement>(
      props: PropsWithChildren<NeumorphicProps>,
      ref: ForwardedRef<T>
    ) => {
      const {
        children,
        surfaceColor,
        depth = DEFAULT_CONFIG.depth,
        lightSource = DEFAULT_CONFIG.lightSource,
        concavity = DEFAULT_CONFIG.concavity,
        softness = DEFAULT_CONFIG.softness,
        intensity = DEFAULT_CONFIG.intensity,
        ...rest
      } = props;

      // 1. Get the context
      const { contextConfig, setContextConfig, setDimensions, measureDimensions, computedStyles } =
        useNeumorphicContext();
      const elementRef = useRef<HTMLElement | SVGElement | null>(null);

      // Merge refs to maintain compatibility with Floating UI
      const mergedRef = useMergeRefs([elementRef, ref ?? null]);

      // Usar el hook de validación
      const { validateProps } = useNeumorphicValidation({
        surfaceColor,
        depth,
        lightSource,
        concavity,
        softness,
        intensity,
      });

      // Memoizar la medición de dimensiones
      const measureElement = useCallback(() => {
        if (elementRef.current) {
          const { width, height } = elementRef.current.getBoundingClientRect();
          setDimensions(width, height);
        }
      }, [setDimensions]);

      useEffect(() => {
        measureElement();
      }, [measureElement]);

      useImperativeHandle(
        measureDimensions,
        () => ({
          measure: measureElement,
        }),
        [measureElement]
      );

      /**
       * 2. Build the "propsConfig" object using
       */
      const finalConfig = useMemo(
        () => ({
          surfaceColor,
          depth,
          lightSource,
          concavity,
          softness,
          intensity,
        }),
        [surfaceColor, depth, lightSource, concavity, softness, intensity]
      );

      useDeepCompareEffect(() => {
        setContextConfig({ ...finalConfig });
      }, [finalConfig]);

      /**
       * 5. When rendering, ***ALWAYS*** use `contextConfig`.
       *    This allows reflecting changes made by the tooltip
       *    (or any other) in the context.
       */
      const finalStyle = useMemo(() => {
        if (!computedStyles) {
          return {
            cssVars: {} as CSSProperties,
            dynamicClasses: styles.softShadow,
          };
        }

        const { colors, gradientStyles, lightPosition } = computedStyles;
        const { darkColor, lightColor, mainColor } = colors;
        const { firstGradientColor, secondGradientColor, isPressed } = gradientStyles;
        const { positionX, positionY, angle } = lightPosition;

        const cssVars = {
          '--positionX': `${positionX}px`,
          '--positionXOpposite': `${-positionX}px`,
          '--positionY': `${positionY}px`,
          '--positionYOpposite': `${-positionY}px`,
          '--angle': `${angle}deg`,
          '--blur': `${contextConfig.softness}px`,
          '--textColor': getContrast(mainColor),
          '--textColorOpposite': mainColor,
          '--mainColor': mainColor,
          '--darkColor': darkColor,
          '--lightColor': lightColor,
          '--firstGradientColor': firstGradientColor,
          '--secondGradientColor': secondGradientColor,
        } as CSSProperties;

        return {
          cssVars,
          dynamicClasses: isPressed ? `${styles.softShadow} ${styles.pressed}` : styles.softShadow,
        };
      }, [contextConfig, computedStyles]);

      // Merge class and style
      const mergedClass = useMemo(
        () => `neuElement ${finalStyle.dynamicClasses}`,
        [finalStyle.dynamicClasses]
      );

      const mergedStyle = useMemo(() => ({ ...finalStyle.cssVars }), [finalStyle.cssVars]);

      validateProps();

      // Verificar que children sea un elemento React válido
      if (!isValidElement(children)) {
        console.error('NeumorphicWrapper: children must be a valid React element');
        return null;
      }

      // Ahora TypeScript sabe que children es un ReactElement
      return cloneElement(children, {
        ...rest,
        ref: mergedRef,
        className: clsx(mergedClass, children.props?.className),
        style: { ...mergedStyle, ...children.props?.style },
      });
    }
  )
);

// Asignar displayNames para DevTools
NeumorphicWrapperWithProvider.displayName = 'NeumorphicWrapper';
NeumorphicLogic.displayName = 'NeumorphicLogic';

// Exportar el componente principal
export const NeumorphicWrapper = NeumorphicWrapperWithProvider as <
  T extends HTMLElement | SVGElement,
>(
  props: PropsWithChildren<NeumorphicProps> & { ref?: ForwardedRef<T> }
) => JSX.Element;
