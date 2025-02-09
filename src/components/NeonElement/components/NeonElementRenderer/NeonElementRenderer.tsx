import chroma from 'chroma-js';
import React, { JSX, useMemo } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useNeonContext } from '../../providers/NeonProvider';
import { GradientType, NeonElementProps, NeonProps } from '../../types';

import { isSVGElement, isTextElement } from '../../utils';
import styles from './NeonElementRenderer.module.scss';

const defaultConfig: Omit<Required<NeonProps>, 'tag'> = {
  color1: '#ffffff',
  color2: '#000000',
  intensity: 1,
  blur: 6,
  direction: 90,
  showFlare: false,
  speed: 3,
  gradientType: GradientType.LINEAR,
};

export type NeonElementRendererProps<Tag extends keyof JSX.IntrinsicElements> = {
  tag: Tag;
} & NeonElementProps<Tag>;

export function NeonElementRenderer<Tag extends keyof JSX.IntrinsicElements>({
  tag,
  ...props
}: NeonElementRendererProps<Tag>) {
  const {
    color1,
    color2,
    intensity,
    blur,
    direction,
    showFlare,
    speed,
    gradientType,
    style,
    className,
    children,
    ...rest
  } = props;
  // 1. Tomamos el contexto
  const { contextConfig, setContextConfig } = useNeonContext();

  /**
   * 3. Construimos nuestro objeto "propsConfig" usando:
   *    1) props directas (color, color2, etc.)
   *    3) si no hay ni en prop ni en neonOptions, usar defaultConfig
   */
  const finalConfig = useMemo(
    () => ({
      color1: color1 ?? defaultConfig.color1,
      color2: color2 ?? defaultConfig.color2,
      intensity: intensity ?? defaultConfig.intensity,
      blur: blur ?? defaultConfig.blur,
      direction: direction ?? defaultConfig.direction,
      showFlare: showFlare ?? defaultConfig.showFlare,
      speed: speed ?? defaultConfig.speed,
      gradientType: gradientType ?? defaultConfig.gradientType,
      tag,
    }),
    [color1, color2, intensity, blur, direction, showFlare, speed, gradientType, tag]
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
    if (contextConfig.color1 == null) {
      return {
        cssVars: {},
        dynamicClasses: '',
      };
    }

    // Se calcula un valor aleatorio para la velocidad del "flare"
    const flareSpeed =
      Math.floor(Math.random() * 2 * (contextConfig.speed ?? 0)) + (contextConfig.speed ?? 0);

    // Variables CSS
    const cssVars = {
      '--neon-angle': `${contextConfig.direction}deg`,
      '--neon-blur': `${contextConfig.blur}px`,
      '--neon-blur-deviation': contextConfig.blur,
      '--neon-first-color': contextConfig.color1,
      '--neon-second-color': contextConfig.color2,
      '--neon-intensity': contextConfig.intensity,
      '--neon-speed': `${contextConfig.speed}s`,
      '--neon-flare-speed': `${flareSpeed}s`,
    };

    let dynamicClasses = styles.neon;

    if (isTextElement(tag)) {
      dynamicClasses = `${styles.neon_text}`;
    }

    if (contextConfig.showFlare) {
      dynamicClasses = `${dynamicClasses} ${styles.neon_flare}`;
    }

    if (contextConfig.gradientType === GradientType.CONIC) {
      dynamicClasses = `${dynamicClasses} ${styles.neon_conic}`;
    }

    return { cssVars, dynamicClasses };
  }, [
    contextConfig.color1,
    contextConfig.speed,
    contextConfig.direction,
    contextConfig.blur,
    contextConfig.color2,
    contextConfig.intensity,
    contextConfig.showFlare,
    contextConfig.gradientType,
    tag,
  ]);

  // 6. Mergemos clase y estilo
  const mergedClass = `neonElement ${finalStyle.dynamicClasses} ${className}`;
  const mergedStyle: React.CSSProperties = { ...finalStyle.cssVars, ...style };

  // Si el elemento a renderizar es SVG, se utiliza un componente especializado.
  if (isSVGElement(tag)) {
    return (
      //@ts-expect-error types are not complete
      <CreateSvgElement tag={tag} style2={finalStyle.cssVars} {...props} />
    );
  }

  if (isTextElement(tag)) {
    return (
      //@ts-expect-error types are not complete
      <CreateTextElement tag={tag} {...props} className={mergedClass} style={mergedStyle} />
    );
  }

  const TagElement = tag;
  // 7. Render final: en vez de <Element ...> => React.createElement(tag, ...)
  return <TagElement {...rest} className={mergedClass} style={mergedStyle} />;
}

/* ================== COMPONENTES AUXILIARES PARA SVG ================== */

type SvgWithDefsProps<Tag extends keyof JSX.IntrinsicElements> = {
  style2: React.CSSProperties;
} & NeonElementRendererProps<Tag>;

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
    gradientName: `linearGradient-${id}`,
    filterName: `neonGlow-${id}`,
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
  const { contextConfig } = useNeonContext();

  // Se calcula un color intermedio mezclando los dos colores base
  const mixColor = useMemo(() => {
    const mix = chroma.mix(
      contextConfig.color1 ?? defaultConfig.color1,
      contextConfig.color2 ?? defaultConfig.color2,
      0.5
    );
    return mix.hex();
  }, [contextConfig.color1, contextConfig.color2]);

  const randSpeed =
    Math.floor(Math.random() * 4 * (contextConfig.speed ?? 0)) + (contextConfig.speed ?? 0);

  return (
    <defs>
      <linearGradient
        id={svgAttrsNames.gradientName}
        x1="0"
        y1="0"
        x2="1"
        y2="0"
        gradientTransform={`rotate(${contextConfig.direction ?? 0} 0.5 0.5)`}
      >
        <stop offset="0%" stopColor={contextConfig.color1}>
          <animate
            attributeName="stop-color"
            repeatCount="indefinite"
            values={`${contextConfig.color1}; ${contextConfig.color1}; ${contextConfig.color1}; ${mixColor}; ${contextConfig.color1}`}
            dur={`${randSpeed}s`}
          />
          <animate
            attributeName="stop-opacity"
            values="1;0.8;0.95;0.75;0.9;1"
            keyTimes="0;0.2;0.4;0.6;0.8;1"
            dur="6s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="100%" stopColor={contextConfig.color2}>
          <animate
            attributeName="stop-color"
            repeatCount="indefinite"
            values={`${contextConfig.color2}; ${mixColor}; ${contextConfig.color2}; ${contextConfig.color2}; ${contextConfig.color2}`}
            dur={`${randSpeed}s`}
          />
          <animate
            attributeName="stop-opacity"
            values="1;0.8;0.95;0.75;0.9;1"
            keyTimes="0;0.2;0.4;0.6;0.8;1"
            dur="6s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>
      <CreateGaussianBlur filterName={svgAttrsNames.filterName} />
    </defs>
  );
};

const CreateGaussianBlur = ({ filterName }: { filterName: string }) => {
  const { contextConfig } = useNeonContext();
  return (
    <filter id={filterName} x="-50%" y="-200%" width="200%" height="500%">
      <feGaussianBlur
        in="SourceGraphic"
        stdDeviation={`${contextConfig.blur ?? 0}`}
        result="blur"
      />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
};

/* ================== COMPONENTES AUXILIARES PARA TEXTO ================== */

type TextWithDefsProps<Tag extends keyof JSX.IntrinsicElements> = {
  style2: React.CSSProperties;
} & NeonElementRendererProps<Tag>;

/**
 * Componente que renderiza elementos Text con definiciones (defs) para filtro.
 */
const CreateTextElement = <Tag extends keyof JSX.IntrinsicElements>({
  tag,
  style,
  children,
  ...rest
}: TextWithDefsProps<Tag>) => {
  const id = React.useId();
  const filterName = `blurGlow-${id}`;
  const stylesFinal = {
    ...style,
    ...{
      filter: `url(#${filterName})`,
    },
  };

  const TagElement = tag;

  return (
    //@ts-expect-error types are not complete
    <TagElement {...rest} style={stylesFinal}>
      {children}
      <svg width="0" height="0">
        <CreateGaussianBlur filterName={filterName} />
      </svg>
    </TagElement>
  );
};
