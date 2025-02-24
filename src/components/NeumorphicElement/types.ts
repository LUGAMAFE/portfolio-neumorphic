import { MakeRequired } from '@/utils/type-utils';
import { ComponentProps, JSX } from 'react';

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
  surfaceColor: string;
  depth?: number;
  concavity?: number;
  softness?: number;
  intensity?: number;
  lightSource?: number;
};

export type NeumorphicElementProps<Tag extends keyof JSX.IntrinsicElements> = ComponentProps<Tag> &
  NeumorphicProps;
