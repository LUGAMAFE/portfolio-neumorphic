import { JSX, useMemo } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { useNeumorphicStylesContext } from '@/providers/NeumorphicStylesProvider';
import React from 'react';
import { useNeumorphicContext } from '../../providers/NeumorphicProvider';
import {
  FormShape,
  NeumorphicConfigs,
  NeumorphicElementProps,
  NeumorphicOptions,
} from '../../types';
import {
  angleGradient,
  colorLuminance,
  getContrast,
  getIfGradient,
  getIntFormValue,
} from '../../utils';
import styles from './NeumorphicElementRenderer.module.scss';

const defaultConfig: Omit<NeumorphicConfigs, 'tag'> = {
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

  // 7. Render final: en vez de <Element ...> => React.createElement(tag, ...)
  return React.createElement(tag, {
    ...rest,
    className: mergedClass,
    style: mergedStyle,
  });
}
