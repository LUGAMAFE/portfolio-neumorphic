export enum FormShape {
  Concave = 'concave',
  Convex = 'convex',
  Level = 'level',
  Pressed = 'pressed',
  Flat = 'flat',
}

export interface NeumorphicOptions {
  form?: FormShape;
  color?: string;
  size?: number;
  intensity?: number;
  lightSource?: number;
  distance?: number;
  blur?: number;
}

export type NeumorphicElementProps<T extends React.ElementType> = {
  element?: T;
} & React.ComponentPropsWithoutRef<T> & {
    neumorphicOptions?: NeumorphicOptions;
    form?: FormShape;
    color?: string;
    size?: number;
    intensity?: number;
    lightSource?: number;
    distance?: number;
    blur?: number;
    'data-testid'?: string | number;
  };

export interface InputNeumorphicProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string; // Placeholder para campos de texto
  text?: string; // Etiqueta adicional o mensaje contextual
}
