import Concave from '@/svg/concave.svg';
import Convex from '@/svg/convex.svg';
import Flat from '@/svg/flat.svg';
import LevelConcave from '@/svg/levelConcave.svg';
import LevelConvex from '@/svg/levelConvex.svg';
import LevelFlat from '@/svg/levelFlat.svg';
import PressedConcave from '@/svg/pressedConcave.svg';
import PressedConvex from '@/svg/pressedConvex.svg';
import PressedFlat from '@/svg/pressedFlat.svg';

import { ReactNode } from 'react';
import { FormShape } from '../../../types';
import style from './ShapeSwitcher.module.scss';

export interface ShapeSwitcherProps {
  formShape?: FormShape;
  setFormShape?: (name: FormShape) => void;
}

export interface ShapeButtonProps {
  formShape?: FormShape;
  name: FormShape;
  title: string;
  image: ReactNode;
  setFormShape?: (name: FormShape) => void;
}

const ShapeButton = ({ formShape, setFormShape, name, title, image }: ShapeButtonProps) => (
  <button
    className={`${style.ShapeSwitcher__button} ${formShape === name && style.ShapeSwitcher__button_active}`}
    onClick={() => setFormShape?.(name)}
    name={name}
    title={title}
  >
    {image}
  </button>
);

export const ShapeSwitcher = ({ formShape, setFormShape }: ShapeSwitcherProps) => {
  const shapes = [
    {
      name: FormShape.LevelConvex,
      title: 'Level Convex',
      image: <LevelConvex className={style.ShapeSwitcher__icon} />,
    },
    {
      name: FormShape.LevelFlat,
      title: 'Level Flat',
      image: <LevelFlat className={style.ShapeSwitcher__icon} />,
    },
    {
      name: FormShape.LevelConcave,
      title: 'Level Concave',
      image: <LevelConcave className={style.ShapeSwitcher__icon} />,
    },
    {
      name: FormShape.Convex,
      title: 'Convex',
      image: <Convex className={style.ShapeSwitcher__icon} />,
    },
    {
      name: FormShape.Flat,
      title: 'Flat',
      image: <Flat className={style.ShapeSwitcher__icon} />,
    },
    {
      name: FormShape.Concave,
      title: 'Concave',
      image: <Concave className={style.ShapeSwitcher__icon} />,
    },
    {
      name: FormShape.PressedConvex,
      title: 'Pressed Convex',
      image: <PressedConvex className={style.ShapeSwitcher__icon} />,
    },
    {
      name: FormShape.PressedFlat,
      title: 'Pressed Flat',
      image: <PressedFlat className={style.ShapeSwitcher__icon} />,
    },
    {
      name: FormShape.PressedConcave,
      title: 'Pressed Concave',
      image: <PressedConcave className={style.ShapeSwitcher__icon} />,
    },
  ];

  return (
    <>
      <div className={`${style.ShapeSwitcher__row} ${style.ShapeSwitcher__label}`}>
        <label className={style.ShapeSwitcher__label}>Form: </label>
      </div>
      <div className={style.ShapeSwitcher}>
        {shapes.map((btnShape) => (
          <ShapeButton
            key={btnShape.name}
            formShape={formShape}
            setFormShape={setFormShape}
            name={btnShape.name as FormShape}
            title={btnShape.title}
            image={btnShape.image}
          />
        ))}
      </div>
    </>
  );
};
