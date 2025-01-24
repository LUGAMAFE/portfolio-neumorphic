import { useEffect, useState } from 'react';

const CIRCLE_WIDTH: number = 6;
interface CircelProps {
  x: number;
  y: number;
  color?: string;
  width?: number;
}

export const Circle = (props: CircelProps) => {
  const { x, y, color, width } = props;
  const [circleWrapperCssVariables, setCircleWrapperCssVariables] = useState({});
  const [IconCircleCssVariables, setIconCircleCssVariables] = useState({});
  useEffect(() => {
    setCircleWrapperCssVariables({
      width: `0px`,
      height: `0px`,
      position: `absolute`,
      left: `${x}px`,
      top: `${y}px`,
      zIndex: `-1`,
    });
  }, [x, y]);
  useEffect(() => {
    setIconCircleCssVariables({
      WebkitBorderRadius: '50 %',
      width: `${width || CIRCLE_WIDTH}px`,
      height: `${width || CIRCLE_WIDTH}px`,
      background: `${color || 'rgba(255,0,0,0.4)'}`,
      borderRadius: '50%',
      transform: `translate(-50%, -50%)`,
    });
  }, []);
  return (
    <div style={{ ...circleWrapperCssVariables }}>
      <div style={{ ...IconCircleCssVariables }}></div>
    </div>
  );
};
