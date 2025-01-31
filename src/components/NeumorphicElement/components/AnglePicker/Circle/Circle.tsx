const CIRCLE_WIDTH: number = 6;
interface CircelProps {
  x: number;
  y: number;
  color?: string;
  width?: number;
  disabled?: boolean;
}

export const Circle = ({ x, y, color, width, disabled }: CircelProps) => {
  const circleWrapperCssVariables = {
    width: `0px`,
    height: `0px`,
    position: `absolute`,
    left: `${x}px`,
    top: `${y}px`,
    zIndex: `-1`,
  };
  const IconCircleCssVariables = {
    WebkitBorderRadius: '50 %',
    width: `${width || CIRCLE_WIDTH}px`,
    height: `${width || CIRCLE_WIDTH}px`,
    background: 'currentColor',
    borderRadius: '50%',
    transform: `translate(-50%, -50%)`,
    opacity: disabled ? 0 : 1,
  };
  return (
    <div style={{ ...circleWrapperCssVariables }}>
      <div style={{ ...IconCircleCssVariables }}></div>
    </div>
  );
};
