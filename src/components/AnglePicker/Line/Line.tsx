import React from 'react';
import { Format } from '../AnglePicker';

interface LineProps {
  x: number;
  y: number;
  color?: string;
  width?: number;
  angle?: number;
  disabled?: boolean;
  format: Format;
}

export const Line: React.FC<LineProps> = ({ angle = 0, disabled = false, format }) => {
  const defaultCssVariables: React.CSSProperties = {
    '--width': '5px',
    '--height': '5px',
    width: '5px',
    height: '17px',
    backgroundColor: 'currentColor',
    position: 'absolute',
    left: 'calc(50% - var(--width) / 2)',
    top: 'calc(50% - var(--width) / 2)',
    borderRadius: '5px',
    transform: `rotate(${angle - (format === Format.CSS ? 180 : 90)}deg)`,
    transformOrigin: 'center calc(var(--width) / 2)',
    zIndex: 1,
    opacity: disabled ? 0.5 : 1,
  };

  return <div style={defaultCssVariables}></div>;
};
