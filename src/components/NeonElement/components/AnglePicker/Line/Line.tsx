interface LineProps {
  x: number;
  y: number;
  color?: string;
  width?: number;
  angle?: number;
  disabled?: boolean;
}
export const Line = ({ angle, disabled }: LineProps) => {
  const defaultCssVariables = {
    '--width': `5px`,
    '--height': `5px`,
    width: `5px`,
    height: `17px`,
    backgroundColor: 'currentColor',
    position: `absolute`,
    left: `calc(50% - var(--width) / 2)`,
    top: `calc(50% - var(--width) / 2)`,
    borderRadius: `5px`,
    transform: `rotate(${angle ? angle - 90 : angle}deg)`,
    transformOrigin: `center calc(var(--width) / 2)`,
    zIndex: `1`,
    opacity: disabled ? 0.5 : 1,
  };

  return <div style={{ ...defaultCssVariables }}></div>;
};
