import { JSX, useMemo } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import React from 'react';
import { useNeumorphicContext } from '../../providers/NeumorphicProvider';
import { FormShape, NeumorphicElementProps, NeumorphicOptions } from '../../types';
import {
  angleGradient,
  colorLuminance,
  getContrast,
  getIfGradient,
  getIntFormValue,
  isSVGElement,
} from '../../utils';
import styles from './NeumorphicElementRenderer.module.scss';

const defaultConfig: Omit<Required<NeumorphicOptions>, 'color'> = {
  formShape: FormShape.Convex,
  intensity: 0.15,
  lightSource: 1,
  distance: 5,
  blur: 15,
  concavity: 0.5,
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
  color: string,
  difference: number,
  concavity: number
): NeumorphicStyles => ({
  darkColor: colorLuminance(color, -difference),
  mainColor: color,
  lightColor: colorLuminance(color, difference),
  darkGradientColor: colorLuminance(color, 0.14 * concavity),
  lightGradientColor: colorLuminance(color, -0.2 * concavity),
});

export type NeumorphicElementRendererProps<Tag extends keyof JSX.IntrinsicElements> = {
  tag: Tag;
} & NeumorphicElementProps<Tag>;

export function NeumorphicElementRenderer<Tag extends keyof JSX.IntrinsicElements>({
  tag,
  ...props
}: NeumorphicElementRendererProps<Tag>) {
  const {
    formShape,
    color,
    intensity,
    lightSource,
    distance,
    concavity,
    blur,
    style,
    className,
    children,
    ...rest
  } = props;

  // 1. Tomamos el contexto
  const { contextConfig, setContextConfig } = useNeumorphicContext();

  /**
   * 2. Construimos nuestro objeto "propsConfig" usando:
   *    1) props directas (formShape, color, intensity, etc.)
   *    2) si no hay prop usar defaultConfig
   */
  const finalConfig: NeumorphicOptions = useMemo(
    () => ({
      formShape: formShape ?? defaultConfig.formShape,
      color: color,
      intensity: intensity ?? defaultConfig.intensity,
      lightSource: lightSource ?? defaultConfig.lightSource,
      distance: distance ?? defaultConfig.distance,
      concavity: concavity ?? defaultConfig.concavity,
      blur: blur ?? defaultConfig.blur,
    }),
    [formShape, color, intensity, lightSource, distance, concavity, blur]
  );

  useDeepCompareEffect(() => {
    setContextConfig(finalConfig);
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
      if (contextConfig.color == undefined) {
        throw new Error('Color prop is required');
      }
    }

    const colors = generateNeumorphicColors(
      contextConfig.color,
      contextConfig.intensity!,
      contextConfig.concavity!
    );

    let { darkColor, lightColor } = colors;
    const { mainColor, darkGradientColor, lightGradientColor } = colors;

    // Forma y gradientes
    const shapeId = getIntFormValue(contextConfig.formShape);
    const isGradient = getIfGradient(shapeId);

    if (shapeId === 4) {
      // Forzar transparente
      darkColor = '#00000000';
      lightColor = '#00000000';
    }

    const firstGradientColor = (() => {
      if (!isGradient || shapeId === 1) return mainColor;
      if (shapeId === 3) return darkGradientColor;
      return lightGradientColor;
    })();

    const secondGradientColor = (() => {
      if (!isGradient || shapeId === 1) return mainColor;
      if (shapeId === 2) return darkGradientColor;
      return lightGradientColor;
    })();

    // Posición de luz
    const { positionX, positionY, angle } = angleGradient(
      contextConfig.lightSource ?? defaultConfig.lightSource,
      contextConfig.distance!
    );

    // Variables CSS
    const cssVars: React.CSSProperties = {
      '--positionX': `${positionX}px`,
      '--positionXOpposite': `${-positionX}px`,
      '--positionY': `${positionY}px`,
      '--positionYOpposite': `${-positionY}px`,
      '--angle': `${angle}deg`,
      '--blur': `${contextConfig.blur}px`,
      '--textColor': getContrast(mainColor),
      '--textColorOpposite': mainColor,
      '--mainColor': mainColor,
      '--darkColor': darkColor,
      '--lightColor': lightColor,
      '--firstGradientColor': firstGradientColor,
      '--secondGradientColor': secondGradientColor,
    };

    // Clase dinamica (shapeId=0 => pressed)
    const dynamicClasses =
      shapeId === 0 ? `${styles.softShadow} ${styles.pressed}` : styles.softShadow;

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
        {...rest}
      />
    );
  }

  const TagElement = tag;
  // 7. Render final
  return (
    <TagElement {...rest} className={mergedClass} style={mergedStyle}>
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
        <stop offset="0%" stopColor={contextConfig.color}></stop>
        <stop offset="100%" stopColor={contextConfig.color}></stop>
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
