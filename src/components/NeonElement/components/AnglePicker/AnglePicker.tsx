import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Border } from './Border';
import { Circle } from './Circle';
import { Line } from './Line';
import { getCenter, getStartPoint, radianToAngle } from './service';

export interface Point {
  x: number;
  y: number;
}

const BORDER_WIDTH: number = 1;
const WIDTH: number = 30;
const CIRCLE_WIDTH: number = 6;

export interface PickerProps {
  id?: string;
  borderColor?: string;
  pointerColor?: string;
  pointerWidth?: number;
  width?: number;
  value?: number;
  borderStyle?: string;
  borderWidth?: number;
  angle?: number;
  onChange?: (newValue?: number) => void;
  onAfterChange?: (interactiveValue: number) => void;
  preventDefault?: boolean;
  disabled?: boolean;
}

export const AnglePicker = (props: PickerProps) => {
  const {
    pointerColor = '#000',
    pointerWidth = CIRCLE_WIDTH,
    width = WIDTH,
    borderWidth = BORDER_WIDTH,
    onChange,
    onAfterChange,
    preventDefault = false,
    disabled = false,
    value,
    borderColor,
    borderStyle,
    id,
  } = props;

  const [angle, setAngle] = useState(value ?? 0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const onChangeRef = useRef(onChange);
  const onAfterChangeRef = useRef(onAfterChange);
  const preventDefaultRef = useRef(preventDefault);
  const disabledRef = useRef(disabled);

  useEffect(() => {
    onChangeRef.current = onChange;
    onAfterChangeRef.current = onAfterChange;
    preventDefaultRef.current = preventDefault;
    disabledRef.current = disabled;
  }, [onChange, onAfterChange, preventDefault, disabled]);

  useEffect(() => {
    if (typeof value === 'number' && value !== angle) {
      setAngle(value);
    }
  }, [value]);

  const center = useMemo(() => getCenter(width, borderWidth), [width, borderWidth]);

  const startPoint = useMemo(
    () => getStartPoint(width, pointerWidth, borderWidth),
    [width, pointerWidth, borderWidth]
  );

  const getRotatedPosition = useCallback(
    (angle: number) => {
      const theta = (angle / 180) * Math.PI;
      const x =
        (startPoint.x - center.x) * Math.cos(theta) -
        (startPoint.y - center.y) * Math.sin(theta) +
        center.x;
      const y =
        (startPoint.x - center.x) * Math.sin(theta) +
        (startPoint.y - center.y) * Math.cos(theta) +
        center.y;
      return { x, y };
    },
    [center, startPoint]
  );

  const getNewAngleByEvent = useCallback(
    (e: MouseEvent) => {
      const wrapperEl = wrapperRef.current;
      if (e && wrapperEl) {
        const rect = wrapperEl.getBoundingClientRect();
        const centerP = {
          x: rect.left + center.x,
          y: rect.top + center.y,
        };
        const nx = e.clientX - centerP.x;
        const ny = e.clientY - centerP.y;
        const radian = Math.atan2(ny, nx);
        return radianToAngle(radian);
      }
      return null;
    },
    [center]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabledRef.current) return;
      e.preventDefault();

      const angle = getNewAngleByEvent(e.nativeEvent);
      if (typeof angle !== 'number') return;

      setAngle(angle);
      onChangeRef.current?.(angle);

      const onMouseMove = (e: MouseEvent) => {
        if (disabledRef.current) return;
        if (preventDefaultRef.current) e.preventDefault();

        const newAngle = getNewAngleByEvent(e);
        if (typeof newAngle !== 'number') return;

        setAngle(newAngle);
        onChangeRef.current?.(newAngle);
      };

      const onMouseUp = (e: MouseEvent) => {
        if (preventDefaultRef.current) e.preventDefault();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        const finalAngle = getNewAngleByEvent(e);
        if (typeof finalAngle !== 'number') return;

        onAfterChangeRef.current?.(finalAngle) ?? onChangeRef.current?.(finalAngle);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [getNewAngleByEvent]
  );

  const rotatedPosition = getRotatedPosition(angle);

  return (
    <Border
      ref={wrapperRef}
      onMouseDown={handleMouseDown}
      width={width}
      borderColor={borderColor}
      borderStyle={borderStyle}
      borderWidth={borderWidth}
      id={id}
    >
      <Circle
        x={rotatedPosition.x}
        y={rotatedPosition.y}
        color={pointerColor}
        width={pointerWidth}
        disabled={disabled}
      />
      <Line
        x={rotatedPosition.x}
        y={rotatedPosition.y}
        color={pointerColor}
        width={pointerWidth}
        angle={angle}
        disabled={disabled}
      />
    </Border>
  );
};
