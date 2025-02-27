import {
  CSSProperties,
  ForwardedRef,
  JSX,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { useMergeRefs } from '@floating-ui/react';
import { DEFAULT_CONFIG } from '../../constants';
import { useNeumorphicValidation } from '../../hooks/useNeumorphicValidation';
import { useNeumorphicContext } from '../../providers/NeumorphicProvider';
import { NeumorphicElementProps } from '../../types';
import { getContrast, isSVGElement } from '../../utils';
import CreateSvgElement from './CreateSvgElement';
import styles from './NeumorphicElementRenderer.module.scss';

export type NeumorphicElementRendererProps<Tag extends keyof JSX.IntrinsicElements> = {
  tag: Tag;
} & NeumorphicElementProps<Tag>;

function NeumorphicElementRendererInner<Tag extends keyof JSX.IntrinsicElements>(
  {
    surfaceColor,
    depth = DEFAULT_CONFIG.depth,
    lightSource = DEFAULT_CONFIG.lightSource,
    concavity = DEFAULT_CONFIG.concavity,
    softness = DEFAULT_CONFIG.softness,
    intensity = DEFAULT_CONFIG.intensity,
    style,
    className,
    children,
    tag,
    ...rest
  }: NeumorphicElementRendererProps<Tag>,
  ref: ForwardedRef<HTMLElement | SVGElement>
) {
  // 1. Get the context
  const { contextConfig, setContextConfig, setDimensions, measureDimensions, computedStyles } =
    useNeumorphicContext();
  const elementRef = useRef<SVGElement | HTMLElement | null>(null);
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
    () => `neuElement ${finalStyle.dynamicClasses} ${className || ''}`,
    [finalStyle.dynamicClasses, className]
  );

  const mergedStyle = useMemo(
    () => ({ ...finalStyle.cssVars, ...style }),
    [finalStyle.cssVars, style]
  );

  validateProps();

  // If the element to render is SVG, use a specialized component.
  if (isSVGElement(tag)) {
    return (
      <CreateSvgElement tag={tag} className={className} style={style} ref={mergedRef} {...rest} />
    );
  }

  const TagElement = tag;
  // 7. Final Render
  return (
    <TagElement {...rest} className={mergedClass} style={mergedStyle} ref={mergedRef}>
      {children}
    </TagElement>
  );
}

// Usar forwardRef para envolver el componente
export const NeumorphicElementRenderer = forwardRef(NeumorphicElementRendererInner) as <
  Tag extends keyof JSX.IntrinsicElements,
>(
  props: NeumorphicElementRendererProps<Tag> & { ref?: ForwardedRef<HTMLElement | SVGElement> }
) => JSX.Element;
