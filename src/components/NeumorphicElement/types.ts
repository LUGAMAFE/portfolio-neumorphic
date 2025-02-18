import { MakeRequired } from '@/utils/type-utils';
import { ComponentPropsWithoutRef, JSX } from 'react';

export enum FormShape {
  LevelConvex = 'levelConvex',
  LevelFlat = 'levelFlat',
  LevelConcave = 'levelConcave',
  Convex = 'convex',
  Flat = 'flat',
  Concave = 'concave',
  PressedConvex = 'pressedConvex',
  PressedFlat = 'pressedFlat',
  PressedConcave = 'pressedConcave',
}

export interface NeumorphicOptions {
  formShape?: FormShape;
  surfaceColor?: string;
  lightSource?: number;
  softness?: number;
  concavity?: number;
  depth?: number;
  intensity?: number;
}

export type NeumorphicProps = Omit<MakeRequired<NeumorphicOptions, 'surfaceColor'>, 'formShape'> & {
  allowClicks?: boolean;
};

export type NeumorphicConfigs = {
  tag: keyof JSX.IntrinsicElements;
} & NeumorphicProps;

export type NeumorphicElementProps<Tag extends keyof JSX.IntrinsicElements> =
  ComponentPropsWithoutRef<Tag> & NeumorphicProps;
