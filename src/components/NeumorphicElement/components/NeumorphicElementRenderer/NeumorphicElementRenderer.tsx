import { JSX, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { useMergeRefs } from '@floating-ui/react';
import React from 'react';
import { useNeumorphicContext } from '../../providers/NeumorphicProvider';
import { FormShape, NeumorphicElementProps, NeumorphicOptions } from '../../types';
import { angleGradient, colorLuminance, getContrast, isSVGElement } from '../../utils';
import styles from './NeumorphicElementRenderer.module.scss';

const defaultConfig: Omit<Required<NeumorphicOptions>, 'surfaceColor' | 'formShape'> = {
  depth: 0.15,
  lightSource: 1,
  softness: 15,
  concavity: 0.5,
  intensity: 0.2,
};

interface NeumorphicStyles {
  darkColor: string;
  mainColor: string;
  lightColor: string;
  darkGradientColor: string;
  lightGradientColor: string;
}

/**
 * Genera los colores neumórficos a partir de un color base y una diferencia.
 */
const generateNeumorphicColors = (
  surfaceColor: string,
  difference: number,
  concavity: number,
  intensity: number
): NeumorphicStyles => {
  const absDifference = Math.abs(difference) * intensity;
  const factor = concavity > 0 ? 1 : -1;

  const baseColors = {
    darkColor: colorLuminance(surfaceColor, -absDifference),
    mainColor: surfaceColor,
    lightColor: colorLuminance(surfaceColor, absDifference),
  };

  const gradientColors = {
    darkGradientColor: colorLuminance(surfaceColor, factor * intensity * concavity),
    lightGradientColor: colorLuminance(surfaceColor, -factor * intensity * concavity),
  };

  return {
    ...baseColors,
    ...gradientColors,
  };
};

export type NeumorphicElementRendererProps<Tag extends keyof JSX.IntrinsicElements> = {
  tag: Tag;
} & NeumorphicElementProps<Tag>;

export function NeumorphicElementRenderer<Tag extends keyof JSX.IntrinsicElements>({
  tag,
  ...props
}: NeumorphicElementRendererProps<Tag>) {
  const {
    surfaceColor,
    depth,
    lightSource,
    concavity,
    softness,
    intensity,
    style,
    className,
    children,
    ...rest
  } = props;

  // 1. Tomamos el contexto
  const { contextConfig, setContextConfig } = useNeumorphicContext();

  const elementRef = useRef<HTMLElement | null>(null);
  const { setDimensions, measureDimensions } = useNeumorphicContext();

  // Merge refs para mantener la compatibilidad con Floating UI
  const mergedRef = useMergeRefs([
    elementRef,
    // @ts-expect-error - props.ref existe pero TypeScript no lo reconoce
    props.ref,
  ]);

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
   * 2. Construimos nuestro objeto "propsConfig" usando:
   *    1) props directas (surfaceColor, depth, concavity etc.)
   *    2) si no hay prop usar defaultConfig
   */
  const finalConfig: NeumorphicOptions = useMemo(
    () => ({
      surfaceColor: surfaceColor,
      depth: depth ?? defaultConfig.depth,
      lightSource: lightSource ?? defaultConfig.lightSource,
      concavity: concavity ?? defaultConfig.concavity,
      softness: softness ?? defaultConfig.softness,
      intensity: intensity ?? defaultConfig.intensity,
    }),
    [surfaceColor, depth, lightSource, concavity, softness, intensity]
  );

  useDeepCompareEffect(() => {
    setContextConfig({ ...finalConfig });
  }, [finalConfig]);

  /**
   * 5. A la hora de renderizar, ***SIEMPRE*** usamos `contextConfig`.
   *    Así podemos reflejar modificaciones hechas por el tooltip
   *    (o por cualquier otro) en el contexto.
   */
  const finalStyle = useMemo(() => {
    if (contextConfig.formShape == null) {
      return {
        cssVars: {},
        dynamicClasses: styles.softShadow,
      };
    } else {
      if (contextConfig.surfaceColor == undefined) {
        throw new Error('surfaceColor prop is required');
      }
    }

    const colors = generateNeumorphicColors(
      contextConfig.surfaceColor,
      contextConfig.depth!,
      contextConfig.concavity!,
      contextConfig.intensity!
    );

    let { darkColor, lightColor } = colors;
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

    if (formShape === FormShape.Flat) {
      darkColor = '#00000000';
      lightColor = '#00000000';
    }

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

    // Posición de luz
    const { positionX, positionY, angle } = angleGradient(
      contextConfig.lightSource!,
      contextConfig.softness! / 2
    );

    // Variables CSS
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

  // 6. Mergemos clase y estilo
  const mergedClass = `neuElement ${finalStyle.dynamicClasses} ${className || ''}`;
  const mergedStyle: React.CSSProperties = { ...finalStyle.cssVars, ...style };

  // Si el elemento a renderizar es SVG, se utiliza un componente especializado.
  if (isSVGElement(tag)) {
    return (
      //@ts-expect-error types are not complete
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
  // 7. Render final
  return (
    <TagElement {...rest} className={mergedClass} style={mergedStyle} ref={mergedRef}>
      {children}
    </TagElement>
  );
}

/* ================== COMPONENTES AUXILIARES PARA SVG ================== */

type SvgWithDefsProps<Tag extends keyof JSX.IntrinsicElements> = {
  style2: React.CSSProperties;
} & NeumorphicElementRendererProps<Tag>;

/**
 * Componente que renderiza elementos SVG con definiciones (defs) para gradiente y filtro.
 */
const CreateSvgElement = <Tag extends keyof JSX.IntrinsicElements>({
  tag,
  style2,
  style,
  children,
  ...rest
}: SvgWithDefsProps<Tag>) => {
  const id = React.useId();
  const svgAttrsNames = {
    gradientName: `neumorphicLinearGradient-${id}`,
    filterName: `neumorphicFilter-${id}`,
  };

  const TagElement = tag;

  // Si el tag es 'g' se renderiza directamente con los defs
  if (tag === 'g' || tag === 'svg') {
    return (
      //@ts-expect-error types are not complete
      <TagElement
        {...rest}
        style={{ ...style2, ...style }}
        filter={`url(#${svgAttrsNames.filterName})`}
        fill={`url(#${svgAttrsNames.gradientName})`}
      >
        {children}
        <CreateDefs svgAttrsNames={svgAttrsNames} />
      </TagElement>
    );
  }

  // Para otros tags SVG se usa un grupo que incluye un <path> con defs
  return (
    <SvgGroupElementWithDefs
      tag={tag}
      style2={style2}
      style={style}
      svgAttrsNames={svgAttrsNames}
      {...rest}
    >
      {children}
    </SvgGroupElementWithDefs>
  );
};

type SvgGroupElementWithDefsProps<Tag extends keyof JSX.IntrinsicElements> = {
  svgAttrsNames: {
    gradientName: string;
    filterName: string;
  };
} & SvgWithDefsProps<Tag>;

/**
 * Grupo SVG que incluye el <defs> y un <path> con el filtro y gradiente aplicados.
 */
const SvgGroupElementWithDefs = <Tag extends keyof JSX.IntrinsicElements>({
  svgAttrsNames,
  style2,
  tag: TagElement,
  ...rest
}: SvgGroupElementWithDefsProps<Tag>) => {
  return (
    <g style={style2}>
      <CreateDefs svgAttrsNames={svgAttrsNames} />
      <TagElement
        {...rest}
        filter={`url(#${svgAttrsNames.filterName})`}
        fill={`url(#${svgAttrsNames.gradientName})`}
      />
    </g>
  );
};

type CreateDefsProps = {
  svgAttrsNames: {
    gradientName: string;
    filterName: string;
  };
};

/**
 * Componente que define el gradiente lineal y el filtro (glow) para los elementos SVG.
 */
const CreateDefs: React.FC<CreateDefsProps> = ({ svgAttrsNames }) => {
  const { contextConfig } = useNeumorphicContext();
  return (
    <defs>
      <linearGradient
        id={svgAttrsNames.gradientName}
        x1="0"
        y1="0"
        x2="1"
        y2="0"
        gradientTransform={`rotate(0} 0.5 0.5)`}
      >
        <stop offset="0%" stopColor={contextConfig.surfaceColor}></stop>
        <stop offset="100%" stopColor={contextConfig.surfaceColor}></stop>
      </linearGradient>
      <CreateGaussianBlur filterName={svgAttrsNames.filterName} />
    </defs>
  );
};

const CreateGaussianBlur = ({ filterName }: { filterName: string }) => {
  const { contextConfig } = useNeumorphicContext();
  return (
    <filter id={filterName} x="-50%" y="-200%" width="200%" height="500%">
      <feGaussianBlur in="SourceGraphic" stdDeviation={`0`} result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
};
