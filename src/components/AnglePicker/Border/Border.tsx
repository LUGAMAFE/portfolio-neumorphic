import { MouseEventHandler, forwardRef, useEffect, useState } from 'react';

const WIDTH: number = 30;

interface BorderProps {
  width?: number;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: number;
  onMouseDown?: MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
}

export const Border = forwardRef<HTMLDivElement, BorderProps>((props, ref) => {
  const { borderColor, borderStyle, borderWidth, width, children, onMouseDown } = props;
  const [defaultCssVariables, setDefaultCssVariables] = useState({});

  useEffect(() => {
    setDefaultCssVariables({
      width: `${width || WIDTH}px`,
      height: `${width || WIDTH}px`,
      borderStyle: `${borderStyle}px`,
      position: 'relative',
      boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.16)',
      border: `${typeof borderWidth === 'number' ? borderWidth : 1}px solid ${borderColor || '#ccc'
        }`,
      borderRadius: '50%',
      boxSizing: 'border-box',
      zIndex: '1',
    });
  }, []);

  return (
    <div onMouseDown={onMouseDown} ref={ref} style={{ ...defaultCssVariables }}>
      {children}
    </div>
  );
});

Border.displayName = 'Border';
