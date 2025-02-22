import { JSX, Ref, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { useMergeRefs } from '@floating-ui/react';
import React from 'react';
import { useNeumorphicContext } from '../../providers/NeumorphicProvider';
import { FormShape, NeumorphicElementProps, NeumorphicOptions } from '../../types';
import { angleGradient, generateNeumorphicColors, getContrast, isSVGElement } from '../../utils';
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
  depth,
  lightSource,
  concavity,
  softness,
  intensity,
  style,
  className,
  children,
  tag,
  ref,
  ...rest
}: NeumorphicElementRendererProps<Tag>) {
  // 1. Get the context
  const { contextConfig, setContextConfig, setDimensions, measureDimensions } =
    useNeumorphicContext();

  const elementRef = useRef<SVGElement | HTMLElement | null>(null);

  // Merge refs to maintain compatibility with Floating UI
  const mergedRef = useMergeRefs([elementRef, ref as Ref<SVGElement | HTMLElement>]);

  useEffect(() => {
    if (elementRef.current) {
      const { width, height } = elementRef.current.getBoundingClientRect();
      setDimensions(width, height);
    }
  }, []);

  useImperativeHandle(measureDimensions, () => ({
    measure: () => {
      if (elementRef.current) {
        const { width, height } = elementRef.current.getBoundingClientRect();
        setDimensions(width, height);
      }
    },
  }));

  /**
   * 2. Build the "propsConfig" object using:
   *    1) Direct props (surfaceColor, depth, concavity, etc.)
   *    2) Use DEFAULT_CONFIG if props are not provided
   */
  const finalConfig: NeumorphicOptions = useMemo(
    () => ({
      surfaceColor,
      depth: depth ?? DEFAULT_CONFIG.depth,
      lightSource: lightSource ?? DEFAULT_CONFIG.lightSource,
      concavity: concavity ?? DEFAULT_CONFIG.concavity,
      softness: softness ?? DEFAULT_CONFIG.softness,
      intensity: intensity ?? DEFAULT_CONFIG.intensity,
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
    if (contextConfig.formShape == null) {
      return {
        cssVars: {},
        dynamicClasses: styles.softShadow,
      };
    } else {
      if (contextConfig.surfaceColor === undefined) {
        throw new Error('surfaceColor prop is required');
      }
    }

    const colors = generateNeumorphicColors(
      contextConfig.surfaceColor,
      contextConfig.depth!,
      contextConfig.concavity!,
      contextConfig.intensity!
    );

    const { darkColor, lightColor } = colors;
    const { mainColor, darkGradientColor, lightGradientColor } = colors;

    const formShape = contextConfig.formShape;

    const isFlat =
      formShape === FormShape.Flat ||
      formShape === FormShape.PressedFlat ||
      formShape === FormShape.LevelFlat;
    const isConcave =
      formShape === FormShape.Concave ||
      formShape === FormShape.PressedConcave ||
      formShape === FormShape.LevelConcave;
    const isConvex =
      formShape === FormShape.Convex ||
      formShape === FormShape.PressedConvex ||
      formShape === FormShape.LevelConvex;
    const isPressed =
      formShape === FormShape.PressedFlat ||
      formShape === FormShape.PressedConcave ||
      formShape === FormShape.PressedConvex;

    const firstGradientColor = (() => {
      if (isFlat) return mainColor;
      if (isConvex) return darkGradientColor;
      return lightGradientColor;
    })();

    const secondGradientColor = (() => {
      if (isFlat) return mainColor;
      if (isConcave) return darkGradientColor;
      return lightGradientColor;
    })();

    // Light position
    const { positionX, positionY, angle } = angleGradient(
      contextConfig.lightSource!,
      contextConfig.softness! / 2
    );

    // CSS Variables
    const cssVars: React.CSSProperties = {
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

    const dynamicClasses = isPressed ? `${styles.softShadow} ${styles.pressed}` : styles.softShadow;

    return { cssVars, dynamicClasses };
  }, [contextConfig]);

  // Merge class and style
  const mergedClass = `neuElement ${finalStyle.dynamicClasses} ${className || ''}`;
  const mergedStyle: React.CSSProperties = { ...finalStyle.cssVars, ...style };

  // If the element to render is SVG, use a specialized component.
  if (isSVGElement(tag)) {
    return (
      <CreateSvgElement
        tag={tag}
        style2={finalStyle.cssVars}
        className={className}
        style={style}
        ref={mergedRef}
        {...rest}
      />
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
