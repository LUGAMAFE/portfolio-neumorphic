import { FormShape } from '../types';

export function angleGradient(
  shapeId: number,
  distance: number
): { positionX: number; positionY: number; angle: number } {
  const positions: { [key: number]: { positionX: number; positionY: number; angle: number } } = {
    1: { positionX: distance, positionY: distance, angle: 145 },
    2: { positionX: distance * -1, positionY: distance, angle: 225 },
    3: { positionX: distance * -1, positionY: distance * -1, angle: 315 },
    4: { positionX: distance, positionY: distance * -1, angle: 45 },
  };
  return positions[shapeId];
}

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

export function colorLuminance(hex: string, lum: number): string {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
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

export function getContrast(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16),
    yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#2e3133' : '#F6F5F7';
}

export const handleDistance = (value: number): { blur: number; distance: number } => {
  const distance = value;
  const blur = value * 2;
  return { blur, distance };
};

export const handleSize = (value: number): { size: number; blur: number; distance: number } => {
  const size = value;
  const distance = Math.round(value * 0.1);
  const blur = Math.round(value * 0.2);
  return { size, blur, distance };
};

export const getIfGradient = (shapeId: number): boolean => {
  if (shapeId === 2 || shapeId === 3) {
    return true;
  } else {
    return false;
  }
};

export const isValidColor = (hex: string): boolean => /^#[0-9A-F]{6}$/i.test(hex);

export const camelize = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

export const deleteFalsyProperties = <T>(obj: T): T => {
  for (const prop in obj) {
    if (!obj[prop]) {
      delete obj[prop];
    }
  }
  return obj;
};

export const calculateDisplayStyle = (refElement: HTMLElement | null) => {
  if (refElement === null) return;
  const computedStyle = window.getComputedStyle(refElement);
  const position = computedStyle.getPropertyValue('position');
  return position === 'fixed' ? { zIndex: 10000 } : {};
};
