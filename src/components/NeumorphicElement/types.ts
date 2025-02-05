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

export type NeumorphicProps = NeumorphicOptions & {
  neumorphicOptions?: NeumorphicOptions;
  allowClicks?: boolean;
};

export type NeumorphicElementProps<Tag extends keyof JSX.IntrinsicElements> =
  ComponentPropsWithoutRef<Tag> & NeumorphicProps;
