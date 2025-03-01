import Concave from '@/svg/concave.svg';
import Convex from '@/svg/convex.svg';
import Flat from '@/svg/flat.svg';
import LevelConcave from '@/svg/levelConcave.svg';
import LevelConvex from '@/svg/levelConvex.svg';
import LevelFlat from '@/svg/levelFlat.svg';
import PressedConcave from '@/svg/pressedConcave.svg';
import PressedConvex from '@/svg/pressedConvex.svg';
import PressedFlat from '@/svg/pressedFlat.svg';

import { ReactNode, memo } from 'react';
import { FormShape } from '../../../types';
import style from './ShapeSwitcher.module.scss';

export interface ShapeSwitcherProps {
  formShape?: FormShape;
  setFormShape?: (name: FormShape) => void;
}

interface ShapeButtonProps {
  formShape?: FormShape;
  name: FormShape;
  title: string;
  image: ReactNode;
  setFormShape?: (name: FormShape) => void;
}

// Memoized button component to prevent unnecessary re-renders
const ShapeButton = memo(({ formShape, setFormShape, name, title, image }: ShapeButtonProps) => (
  <button
    className={`${style.ShapeSwitcher__button} ${formShape === name ? style.ShapeSwitcher__button_active : ''}`}
    onClick={() => setFormShape?.(name)}
    name={name}
    title={title}
  >
    {image}
  </button>
));

ShapeButton.displayName = 'ShapeButton';

// Define shapes array outside component to prevent recreation on each render
const shapes = [
  {
    name: FormShape.LevelConvex,
    title: 'Level Convex',
    image: (className: string) => {
      const SvgComponent = LevelConvex as React.ComponentType<React.SVGProps<SVGSVGElement>>;
      return <SvgComponent className={className} />;
    },
  },
  {
    name: FormShape.LevelFlat,
    title: 'Level Flat',
    image: (className: string) => {
      const SvgComponent = LevelFlat as React.ComponentType<React.SVGProps<SVGSVGElement>>;
      return <SvgComponent className={className} />;
    },
  },
  {
    name: FormShape.LevelConcave,
    title: 'Level Concave',
    image: (className: string) => {
      const SvgComponent = LevelConcave as React.ComponentType<React.SVGProps<SVGSVGElement>>;
      return <SvgComponent className={className} />;
    },
  },
  {
    name: FormShape.Convex,
    title: 'Convex',
    image: (className: string) => {
      const SvgComponent = Convex as React.ComponentType<React.SVGProps<SVGSVGElement>>;
      return <SvgComponent className={className} />;
    },
  },
  {
    name: FormShape.Flat,
    title: 'Flat',
    image: (className: string) => {
      const SvgComponent = Flat as React.ComponentType<React.SVGProps<SVGSVGElement>>;
      return <SvgComponent className={className} />;
    },
  },
  {
    name: FormShape.Concave,
    title: 'Concave',
    image: (className: string) => {
      const SvgComponent = Concave as React.ComponentType<React.SVGProps<SVGSVGElement>>;
      return <SvgComponent className={className} />;
    },
  },
  {
    name: FormShape.PressedConvex,
    title: 'Pressed Convex',
    image: (className: string) => {
      const SvgComponent = PressedConvex as React.ComponentType<React.SVGProps<SVGSVGElement>>;
      return <SvgComponent className={className} />;
    },
  },
  {
    name: FormShape.PressedFlat,
    title: 'Pressed Flat',
    image: (className: string) => {
      const SvgComponent = PressedFlat as React.ComponentType<React.SVGProps<SVGSVGElement>>;
      return <SvgComponent className={className} />;
    },
  },
  {
    name: FormShape.PressedConcave,
    title: 'Pressed Concave',
    image: (className: string) => {
      const SvgComponent = PressedConcave as React.ComponentType<React.SVGProps<SVGSVGElement>>;
      return <SvgComponent className={className} />;
    },
  },
];

export const ShapeSwitcher = memo(({ formShape, setFormShape }: ShapeSwitcherProps) => {
  return (
    <>
      <div className={`${style.ShapeSwitcher__row} ${style.ShapeSwitcher__label}`}>
        <label>Form: </label>
      </div>
      <div className={style.ShapeSwitcher}>
        {shapes.map((btnShape) => (
          <ShapeButton
            key={btnShape.name}
            formShape={formShape}
            setFormShape={setFormShape}
            name={btnShape.name}
            title={btnShape.title}
            image={btnShape.image(style.ShapeSwitcher__icon)}
          />
        ))}
      </div>
    </>
  );
});

ShapeSwitcher.displayName = 'ShapeSwitcher';
