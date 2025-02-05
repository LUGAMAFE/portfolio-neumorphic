import { ComponentPropsWithoutRef, JSX } from 'react';

export enum GradientType {
  LINEAR = 'linear',
  CONIC = 'conic',
}

export interface NeonOptions {
  color1?: string;
  color2?: string;
  showFlare?: boolean;
  intensity?: number;
  direction?: number;
  blur?: number;
  speed?: number;
  tag?: keyof JSX.IntrinsicElements;
  gradientType?: GradientType;
}

export type NeonProps = NeonOptions;

export type NeonElementProps<Tag extends keyof JSX.IntrinsicElements> =
  ComponentPropsWithoutRef<Tag> & NeonProps;
