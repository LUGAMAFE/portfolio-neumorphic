import { MakeRequired } from '@/utils/type-utils';
import { ComponentPropsWithoutRef, JSX } from 'react';

export enum FormShape {
  Concave = 'concave',
  Convex = 'convex',
  Level = 'level',
  Pressed = 'pressed',
  Flat = 'flat',
}

export interface NeumorphicOptions {
  formShape?: FormShape;
  color?: string;
  size?: number;
  intensity?: number;
  lightSource?: number;
  distance?: number;
  blur?: number;
}

export type NeumorphicProps = MakeRequired<NeumorphicOptions, 'color'> & {
  allowClicks?: boolean;
};

export type NeumorphicConfigs = {
  tag: keyof JSX.IntrinsicElements;
} & NeumorphicProps;

export type NeumorphicElementProps<Tag extends keyof JSX.IntrinsicElements> =
  ComponentPropsWithoutRef<Tag> & NeumorphicProps;
