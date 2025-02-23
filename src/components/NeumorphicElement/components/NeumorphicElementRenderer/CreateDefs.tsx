import { memo, useMemo } from 'react';
import { useNeumorphicContext } from '../../providers/NeumorphicProvider';
import { hexToColorMatrix } from '../../utils';

type CreateDefsProps = {
  svgAttrsNames: {
    gradientName: string;
    filterName: string;
  };
};
/**
 * Component that defines the linear gradient and the filter (glow) for SVG elements.
 */
const CreateDefs = ({ svgAttrsNames }: CreateDefsProps) => {
  const { computedStyles } = useNeumorphicContext();

  if (!computedStyles) return null;

  const { colors, gradientStyles, svgLightPosition, stdDeviation } = computedStyles;
  const { firstGradientColor, secondGradientColor, isPressed } = gradientStyles;
  const { positionX, positionY, angle } = svgLightPosition;

  return (
    <defs>
      <linearGradient
        id={svgAttrsNames.gradientName}
        x1="0"
        y1="0"
        x2="1"
        y2="0"
        gradientTransform={`rotate(${angle} 0.5 0.5)`}
      >
        <stop offset="0%" stopColor={firstGradientColor}></stop>
        <stop offset="100%" stopColor={secondGradientColor}></stop>
      </linearGradient>
      <CreateNeumorphicFilter
        filterName={svgAttrsNames.filterName}
        colors={colors}
        positionX={positionX}
        positionY={positionY}
        stdDeviation={stdDeviation}
        isPressed={isPressed}
      />
    </defs>
  );
};

type CreateNeumorphicFilterProps = {
  filterName: string;
  colors: { lightColor: string; darkColor: string };
  positionX: number;
  positionY: number;
  stdDeviation: number;
  isPressed: boolean;
};

const CreateNeumorphicFilter = memo(
  ({
    filterName,
    colors,
    positionX,
    positionY,
    stdDeviation,
    isPressed,
  }: CreateNeumorphicFilterProps) => {
    const rgbLight = useMemo(() => hexToColorMatrix(colors.lightColor), [colors.lightColor]);
    const rgbDark = useMemo(() => hexToColorMatrix(colors.darkColor), [colors.darkColor]);

    return (
      <filter
        id={filterName}
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        {isPressed ? (
          // Efecto de sombra interior para estado presionado
          <>
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />

            {/* Primera sombra interior */}
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx={-positionX} dy={-positionY} />
            <feGaussianBlur stdDeviation={stdDeviation} />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values={`0 0 0 0 ${rgbLight.r} 0 0 0 0 ${rgbLight.g} 0 0 0 0 ${rgbLight.b} 0 0 0 1 0`}
            />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />

            {/* Segunda sombra interior */}
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx={positionX} dy={positionY} />
            <feGaussianBlur stdDeviation={stdDeviation} />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values={`0 0 0 0 ${rgbDark.r} 0 0 0 0 ${rgbDark.g} 0 0 0 0 ${rgbDark.b} 0 0 0 1 0`}
            />
            <feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow" />
          </>
        ) : (
          // Efecto de sombra exterior regular
          <>
            <feFlood floodOpacity="0" result="BackgroundImageFix" />

            {/* Primera sombra exterior */}
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx={-positionX} dy={-positionY} />
            <feGaussianBlur stdDeviation={stdDeviation} />
            <feColorMatrix
              type="matrix"
              values={`0 0 0 0 ${rgbLight.r} 0 0 0 0 ${rgbLight.g} 0 0 0 0 ${rgbLight.b} 0 0 0 1 0`}
            />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />

            {/* Segunda sombra exterior */}
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx={positionX} dy={positionY} />
            <feGaussianBlur stdDeviation={stdDeviation} />
            <feColorMatrix
              type="matrix"
              values={`0 0 0 0 ${rgbDark.r} 0 0 0 0 ${rgbDark.g} 0 0 0 0 ${rgbDark.b} 0 0 0 1 0`}
            />
            <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />

            {/* Combinar con el gráfico original */}
            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
          </>
        )}
      </filter>
    );
  }
);

CreateDefs.displayName = 'CreateDefs';
CreateNeumorphicFilter.displayName = 'CreateNeumorphicFilter';

export default CreateDefs;
