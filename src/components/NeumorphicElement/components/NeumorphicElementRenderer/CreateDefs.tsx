import { useNeumorphicContext } from '../../providers/NeumorphicProvider';
import { NeumorphicOptions } from '../../types';
import { angleGradient, generateNeumorphicColors, NeumorphicStyles } from '../../utils';

type CreateDefsProps = {
  svgAttrsNames: {
    gradientName: string;
    filterName: string;
  };
};

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
};

/**
 * Component that defines the linear gradient and the filter (glow) for SVG elements.
 */
const CreateDefs = ({ svgAttrsNames }: CreateDefsProps) => {
  const { contextConfig } = useNeumorphicContext();
  const { angle } = angleGradient(
    contextConfig.lightSource ?? 1,
    contextConfig.softness ?? 15,
    true
  );

  const colors = generateNeumorphicColors(
    contextConfig.surfaceColor ?? '#ffffff',
    contextConfig.depth ?? 0.15,
    contextConfig.concavity ?? 0.5,
    contextConfig.intensity ?? 0.2
  );

  const { firstGradientColor, secondGradientColor } = getGradientColors(contextConfig, colors);

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
      <CreateNeumorphicFilter filterName={svgAttrsNames.filterName} />
    </defs>
  );
};

type CreateNeumorphicFilterProps = {
  filterName: string;
};

const CreateNeumorphicFilter = ({ filterName }: CreateNeumorphicFilterProps) => {
  const { contextConfig } = useNeumorphicContext();

  const { positionX, positionY } = angleGradient(
    contextConfig.lightSource ?? 1,
    contextConfig.softness ?? 15
  );

  const colors = generateNeumorphicColors(
    contextConfig.surfaceColor ?? '#ffffff',
    contextConfig.depth ?? 0.15,
    contextConfig.concavity ?? 0.5,
    contextConfig.intensity ?? 0.2
  );

  const isPressed = contextConfig.formShape?.includes('pressed');
  console.log('colors.lightColor', colors.lightColor);
  console.log('colors.darkColor', colors.darkColor);
  const rgbLight = hexToRgb(colors.lightColor);
  const rgbDark = hexToRgb(colors.darkColor);

  return (
    <filter id={filterName} x="-50%" y="-50%" width="200%" height="200%">
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
          <feGaussianBlur stdDeviation={contextConfig.softness ?? 15} />
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
          <feGaussianBlur stdDeviation={contextConfig.softness ?? 15} />
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
          <feGaussianBlur stdDeviation={contextConfig.softness ?? 15} />
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
          <feGaussianBlur stdDeviation={contextConfig.softness ?? 15} />
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
};

// Helper function to determine gradient colors based on form shape
function getGradientColors(contextConfig: NeumorphicOptions, colors: NeumorphicStyles) {
  const { mainColor, darkGradientColor, lightGradientColor } = colors;
  const formShape = contextConfig.formShape;

  const isFlat = formShape?.includes('flat');
  const isConcave = formShape?.includes('concave');
  const isConvex = formShape?.includes('convex');

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

  return { firstGradientColor, secondGradientColor };
}

export default CreateDefs;
