import { JSX, useMemo } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { useNeumorphicStylesContext } from '@/providers/NeumorphicStylesProvider';
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
  size: 55,
  intensity: 0.14,
  lightSource: 1,
  distance: 5,
  blur: 15,
};

export type NeumorphicElementRendererProps<Tag extends keyof JSX.IntrinsicElements> = {
  tag: Tag;
} & NeumorphicElementProps<Tag>;

export function NeumorphicElementRenderer<Tag extends keyof JSX.IntrinsicElements>({
  tag,
  ...props
}: NeumorphicElementRendererProps<Tag>) {
  const {
    neumorphicOptions = {},
    formShape,
    color,
    size,
    intensity,
    lightSource,
    distance,
    blur,
    style,
    className,
    children,
    ...rest
  } = props;

  // 1. Tomamos el contexto
  const { contextConfig, setContextConfig } = useNeumorphicContext();
  // 2. Tomamos los colores del tema neumórfico
  const {
    colorDifference,
    styles: {
      darkColor: darkColorContext,
      mainColor: mainColorContext,
      lightColor: lightColorContext,
      darkGradientColor: darkGradientColorContext,
      lightGradientColor: lightGradientColorContext,
    },
  } = useNeumorphicStylesContext();

  /**
   * 3. Construimos nuestro objeto "propsConfig" usando:
   *    1) props directas (formShape, color, size, etc.)
   *    2) si no hay prop directa, usar la key correspondiente de neumorphicOptions
   *    3) si no hay ni en prop ni en neumorphicOptions, usar defaultConfig
   */
  const finalConfig: NeumorphicOptions = useMemo(
    () => ({
      formShape: formShape ?? neumorphicOptions.formShape ?? defaultConfig.formShape,
      color: color ?? neumorphicOptions.color ?? mainColorContext,
      size: size ?? neumorphicOptions.size ?? defaultConfig.size,
      intensity: intensity ?? neumorphicOptions.intensity ?? defaultConfig.intensity,
      lightSource: lightSource ?? neumorphicOptions.lightSource ?? defaultConfig.lightSource,
      distance: distance ?? neumorphicOptions.distance ?? defaultConfig.distance,
      blur: blur ?? neumorphicOptions.blur ?? defaultConfig.blur,
    }),
    [
      formShape,
      color,
      size,
      intensity,
      lightSource,
      distance,
      blur,
      neumorphicOptions,
      mainColorContext,
    ]
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
    // Si el contexto aún no tiene algo usable, devolvemos base
    if (!mainColorContext || contextConfig.formShape == null) {
      return {
        cssVars: {},
        dynamicClasses: styles.softShadow,
      };
    }

    const colorToUse = contextConfig.color ?? mainColorContext;

    // Determinamos si la intensidad coincide con la del tema
    // y no pasaron color en props => reasumimos lo del contexto
    const usingSameIntensity =
      contextConfig.intensity === colorDifference && !color && !neumorphicOptions.color;

    // Calculamos colores
    let darkColor: string;
    let lightColor: string;
    let darkGradientColor: string;
    let lightGradientColor: string;

    if (usingSameIntensity) {
      darkColor = darkColorContext;
      lightColor = lightColorContext;
      darkGradientColor = darkGradientColorContext;
      lightGradientColor = lightGradientColorContext;
    } else {
      darkColor = colorLuminance(colorToUse, -contextConfig.intensity!);
      lightColor = colorLuminance(colorToUse, contextConfig.intensity!);
      darkGradientColor = colorLuminance(colorToUse, -0.1);
      lightGradientColor = colorLuminance(colorToUse, 0.07);
    }

    // Forma y gradientes
    const shapeId = getIntFormValue(contextConfig.formShape);
    const isGradient = getIfGradient(shapeId);

    if (shapeId === 4) {
      // Forzar transparente
      darkColor = '#00000000';
      lightColor = '#00000000';
    }

    const firstGradientColor =
      isGradient && shapeId !== 1
        ? shapeId === 3
          ? lightGradientColor
          : darkGradientColor
        : colorToUse;
    const secondGradientColor =
      isGradient && shapeId !== 1
        ? shapeId === 2
          ? lightGradientColor
          : darkGradientColor
        : colorToUse;

    // Distancia, blur
    const finalDistance = contextConfig.distance ?? defaultConfig.distance;
    const finalBlur = contextConfig.blur ?? defaultConfig.blur;

    // Posición de luz
    const { positionX, positionY, angle } = angleGradient(
      contextConfig.lightSource ?? defaultConfig.lightSource,
      finalDistance
    );

    // Variables CSS
    const cssVars: React.CSSProperties = {
      '--positionX': `${positionX}px`,
      '--positionXOpposite': `${-positionX}px`,
      '--positionY': `${positionY}px`,
      '--positionYOpposite': `${-positionY}px`,
      '--angle': `${angle}deg`,
      '--blur': `${finalBlur}px`,
      '--textColor': getContrast(colorToUse),
      '--textColorOpposite': colorToUse,
      '--mainColor': colorToUse,
      '--darkColor': darkColor,
      '--lightColor': lightColor,
      '--firstGradientColor': firstGradientColor,
      '--secondGradientColor': secondGradientColor,
    };

    // Clase dinamica (shapeId=0 => pressed)
    const dynamicClasses =
      shapeId === 0 ? `${styles.softShadow} ${styles.pressed}` : styles.softShadow;

    return { cssVars, dynamicClasses };
  }, [
    contextConfig,
    mainColorContext,
    darkColorContext,
    lightColorContext,
    darkGradientColorContext,
    lightGradientColorContext,
    colorDifference,
    color,
    neumorphicOptions.color,
  ]);

  // 6. Mergemos clase y estilo
  const mergedClass = `neuElement ${finalStyle.dynamicClasses} ${className || ''}`;
  const mergedStyle: React.CSSProperties = { ...finalStyle.cssVars, ...style };

  // Si el elemento a renderizar es SVG, se utiliza un componente especializado.
  if (isSVGElement(tag)) {
    return (
      //@ts-expect-error types are not complete
      <CreateSvgElement tag={tag} style2={finalStyle.cssVars} {...props} />
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
