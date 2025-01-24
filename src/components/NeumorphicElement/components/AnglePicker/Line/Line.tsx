import { useEffect, useState } from 'react';
interface LineProps {
  x: number;
  y: number;
  color?: string;
  width?: number;
  angle?: number;
}
export const Line = (props: LineProps) => {
  const { angle } = props;
  const [defaultCssVariables, setDefaultCssVariables] = useState({});
  useEffect(() => {
    setDefaultCssVariables({
      '--width': `5px`,
      '--height': `5px`,
      width: `5px`,
      height: `17px`,
      backgroundColor: `black`,
      position: `absolute`,
      left: `calc(50% - var(--width) / 2)`,
      top: `calc(50% - var(--width) / 2)`,
      borderRadius: `5px`,
      transform: `rotate(${angle ? angle - 90 : angle}deg)`,
      transformOrigin: `center calc(var(--width) / 2)`,
      zIndex: `1`,
    });
  }, [angle]);

  return <div style={{ ...defaultCssVariables }}></div>;
};
