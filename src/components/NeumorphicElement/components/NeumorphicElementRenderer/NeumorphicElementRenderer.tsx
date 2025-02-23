import { JSX, Ref, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { useMergeRefs } from '@floating-ui/react';
import { useNeumorphicContext } from '../../providers/NeumorphicProvider';
import { NeumorphicElementProps, NeumorphicOptions } from '../../types';
import { getContrast, isSVGElement } from '../../utils';
import CreateSvgElement from './CreateSvgElement';
import styles from './NeumorphicElementRenderer.module.scss';

const DEFAULT_CONFIG: Omit<Required<NeumorphicOptions>, 'surfaceColor' | 'formShape'> = {
  depth: 0.15,
  lightSource: 1,
  softness: 15,
  concavity: 0.5,
  intensity: 0.2,
};

export type NeumorphicElementRendererProps<Tag extends keyof JSX.IntrinsicElements> = {
  tag: Tag;
} & NeumorphicElementProps<Tag>;

export function NeumorphicElementRenderer<Tag extends keyof JSX.IntrinsicElements>({
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
  ref,
  ...rest
}: NeumorphicElementRendererProps<Tag>) {
  // 1. Get the context
  const { contextConfig, setContextConfig, setDimensions, measureDimensions, computedStyles } =
    useNeumorphicContext();
  const elementRef = useRef<SVGElement | HTMLElement | null>(null);
  // Merge refs to maintain compatibility with Floating UI
  const mergedRef = useMergeRefs([elementRef, ref as Ref<SVGElement | HTMLElement>]);

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
        cssVars: {},
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
    };

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
