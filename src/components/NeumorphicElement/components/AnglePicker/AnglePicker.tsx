import React, { Component, MouseEventHandler, createRef } from 'react';
import style from './AnglePicker.module.scss';
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

  angle: number;

  onChange?: (newValue?: number) => void;

  onAfterChange?: (interactiveValue: number) => void;

  preventDefault?: boolean;
}

interface PickerState {
  angle: number;
}

export class AnglePicker extends Component<PickerProps, PickerState> {
  constructor(props: PickerProps) {
    super(props);
    this.state = {
      angle: props.value || 0,
    };

    this.mousemove = this.mousemove.bind(this);
    this.mouseup = this.mouseup.bind(this);
    this.getStartPoint = this.getStartPoint.bind(this);
    this.getCenter = this.getCenter.bind(this);
    this.getRotatedPosition = this.getRotatedPosition.bind(this);
    this.getNewAngleByEvent = this.getNewAngleByEvent.bind(this);
  }

  wrapperRef = createRef<HTMLDivElement>();

  static getDerivedStateFromProps(props: PickerProps, state: PickerState) {
    if (typeof props.value === 'number' && state.angle !== props.value) {
      return {
        angle: props.value,
      };
    }
    return null;
  }

  getCenter(): Point {
    const { width = WIDTH, borderWidth = BORDER_WIDTH } = this.props;
    return getCenter(width, borderWidth);
  }

  getStartPoint() {
    const { width = WIDTH, pointerWidth = CIRCLE_WIDTH, borderWidth = BORDER_WIDTH } = this.props;
    return getStartPoint(width, pointerWidth, borderWidth);
  }

  getRotatedPosition(angle: number) {
    const center = this.getCenter();
    const startPoint = this.getStartPoint();
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
  }

  getNewAngleByEvent = (e: MouseEvent) => {
    const wrapperEl = this.wrapperRef && this.wrapperRef.current;
    if (e && wrapperEl) {
      const center = this.getCenter();
      const { clientX, clientY } = e;
      const rect = wrapperEl.getClientRects()[0];
      const { x, y } = rect;
      const centerP = { x: x + center.x, y: y + center.y };
      const nx = clientX - centerP.x;
      const ny = clientY - centerP.y;
      const radian = Math.atan2(ny, nx);
      return radianToAngle(radian);
    }
    return null;
  };

  mousedown: MouseEventHandler<HTMLDivElement> = (e: React.MouseEvent<HTMLDivElement>) => {
    const angle = this.getNewAngleByEvent(e.nativeEvent);
    if (typeof angle === 'number') {
      this.setState({ angle });
      if (this.props.onChange) {
        this.props.onChange(angle);
      }
      this.addMouseListeners();
    }
  };

  addMouseListeners() {
    document.addEventListener('mousemove', this.mousemove);
    document.addEventListener('mouseup', this.mouseup);
  }

  removeMouseListeners() {
    document.removeEventListener('mousemove', this.mousemove);
    document.removeEventListener('mouseup', this.mouseup);
  }

  mousemove(e: MouseEvent) {
    if (this.props.preventDefault) {
      e.preventDefault();
    }
    const angle = this.getNewAngleByEvent(e);
    if (typeof angle === 'number') {
      this.setState({ angle });
      if (this.props.onChange) {
        this.props.onChange(angle);
      }
    }
  }

  mouseup(e: MouseEvent) {
    if (this.props.preventDefault) {
      e.preventDefault();
    }
    this.removeMouseListeners();
    const angle = this.getNewAngleByEvent(e);
    if (typeof angle === 'number') {
      this.setState({ angle });
      if (this.props.onAfterChange) {
        this.props.onAfterChange(angle);
      } else if (this.props.onChange) {
        this.props.onChange(angle);
      }
    }
  }

  render() {
    const { angle } = this.state;
    const { pointerColor, pointerWidth, width, borderColor, borderStyle, borderWidth } = this.props;
    const { getRotatedPosition, mousedown } = this;

    const rotatedPosition = getRotatedPosition(angle);

    return (
      <Border
        ref={this.wrapperRef}
        onMouseDown={mousedown}
        width={width}
        borderColor={borderColor}
        borderStyle={borderStyle}
        borderWidth={borderWidth}
      >
        <div className={style.Center}></div>
        <Circle
          x={rotatedPosition.x}
          y={rotatedPosition.y}
          color={pointerColor}
          width={pointerWidth}
        />
        <Line
          x={rotatedPosition.x}
          y={rotatedPosition.y}
          color={pointerColor}
          width={pointerWidth}
          angle={angle}
        />
      </Border>
    );
  }
}
