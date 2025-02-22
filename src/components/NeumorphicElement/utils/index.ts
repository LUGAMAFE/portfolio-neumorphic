import { FormShape } from '../types';
export * from './tags';

/**
 * Calculates the gradient angle and position based on the light source and distance.
 */
export function angleGradient(
  lightSource: number,
  distance: number,
  isSvg: boolean = false
): { positionX: number; positionY: number; angle: number } {
  const positions: { [key: number]: { positionX: number; positionY: number; angle: number } } = {
    1: { positionX: distance, positionY: distance, angle: isSvg ? 45 : 145 },
    2: { positionX: -distance, positionY: distance, angle: isSvg ? 145 : 225 },
    3: { positionX: -distance, positionY: -distance, angle: isSvg ? 225 : 315 },
    4: { positionX: distance, positionY: -distance, angle: isSvg ? 315 : 45 },
  };
  return positions[lightSource];
}

/**
 * Determines the form shape based on depth and concavity.
 */
export function getFormShape(depth: number, concavity: number): FormShape {
  // Determine the base state (Level, Flat, or Pressed) based on depth
  let baseShape: 'LevelFlat' | 'PressedFlat' | 'Flat';
  if (depth > 0.05) {
    baseShape = 'LevelFlat';
  } else if (depth < -0.05) {
    baseShape = 'PressedFlat';
  } else {
    baseShape = 'Flat';
  }

  // Determine concavity (Convex, Flat, or Concave)
  if (concavity > 0.05) {
    // For special states Level and Pressed
    if (baseShape === 'LevelFlat') {
      return FormShape.LevelConvex;
    } else if (baseShape === 'PressedFlat') {
      return FormShape.PressedConvex;
    }
    return FormShape.Convex;
  } else if (concavity < -0.05) {
    // For special states Level and Pressed
    if (baseShape === 'LevelFlat') {
      return FormShape.LevelConcave;
    } else if (baseShape === 'PressedFlat') {
      return FormShape.PressedConcave;
    }
    return FormShape.Concave;
  }

  // If no significant concavity, return the base state
  switch (baseShape) {
    case 'LevelFlat':
      return FormShape.LevelFlat;
    case 'PressedFlat':
      return FormShape.PressedFlat;
    default:
      return FormShape.Flat;
  }
}

/**
 * Retrieves the form value based on the form shape.
 */
export function getIntFormValue(form: FormShape): number {
  const values: { [key: string]: { value: number } } = {
    svgInnerShadow: { value: 5 },
    flat: { value: 4 },
    concave: { value: 2 },
    convex: { value: 3 },
    level: { value: 1 },
    pressed: { value: 0 },
  };
  return values[form].value;
}

/**
 * Adjusts the luminance of a hex color.
 */
export function colorLuminance(hex: string, lum: number): string {
  // Validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // Convert to decimal and change luminosity
  let rgb = '#',
    c,
    i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ('00' + c).slice(-2);
  }

  return rgb;
}

/**
 * Determines the appropriate text color based on background color contrast.
 */
export function getContrast(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16),
    yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#2e3133' : '#F6F5F7';
}

/**
 * Determines if the shape ID corresponds to a gradient.
 */
export const getIfGradient = (shapeId: number): boolean => {
  return shapeId === 2 || shapeId === 3;
};

/**
 * Validates if a string is a valid hex color.
 */
export const isValidColor = (hex: string): boolean => /^#[0-9A-F]{6}$/i.test(hex);

/**
 * Converts a string to camelCase.
 */
export const camelize = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

/**
 * Deletes properties with falsy values from an object.
 */
export const deleteFalsyProperties = <T>(obj: T): T => {
  for (const prop in obj) {
    if (!obj[prop]) {
      delete obj[prop];
    }
  }
  return obj;
};

/**
 * Calculates display style based on the reference element's position property.
 */
export const calculateDisplayStyle = (refElement: HTMLElement | null) => {
  if (refElement === null) return;
  const computedStyle = window.getComputedStyle(refElement);
  const position = computedStyle.getPropertyValue('position');
  return position === 'fixed' ? { zIndex: 10000 } : {};
};

/**
 * Generates neumorphic colors based on the surface color and other parameters.
 */
export function generateNeumorphicColors(
  surfaceColor: string,
  difference: number,
  concavity: number,
  intensity: number
): NeumorphicStyles {
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
}

export interface NeumorphicStyles {
  darkColor: string;
  mainColor: string;
  lightColor: string;
  darkGradientColor: string;
  lightGradientColor: string;
}
