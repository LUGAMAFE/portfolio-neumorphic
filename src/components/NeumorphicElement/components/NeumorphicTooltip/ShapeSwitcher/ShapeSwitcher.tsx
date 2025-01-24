import Concave from '@/svg/concave.svg';
import Convex from '@/svg/convex.svg';
import Flat from '@/svg/flat.svg';
import Level from '@/svg/level.svg';
import Pressed from '@/svg/pressed.svg';
import { ReactNode } from 'react';
import { FormShape } from '../../../types';
import style from './ShapeSwitcher.module.scss';

export interface ShapeSwitcherProps {
  shape?: FormShape;
  setShape: (name: FormShape) => void;
}

export interface ShapeButtonProps {
  shape?: FormShape;
  name: FormShape;
  title: string;
  image: ReactNode;
  setShape: (name: FormShape) => void;
}

const ShapeButton = ({ shape, setShape, name, title, image }: ShapeButtonProps) => (
  <button
    className={`${style.ShapeSwitcher__button} ${shape === name && style.ShapeSwitcher__button_active}`}
    onClick={() => setShape(name)}
    name={name}
    title={title}
  >
    {image}
  </button>
);

export const ShapeSwitcher = ({ shape, setShape }: ShapeSwitcherProps) => {
  const shapes = [
    {
      name: 'concave',
      title: 'Concave',
      image: <Concave className={style.ShapeSwitcher__icon} />,
    },
    { name: 'convex', title: 'Convex', image: <Convex className={style.ShapeSwitcher__icon} /> },
    { name: 'level', title: 'Level', image: <Level className={style.ShapeSwitcher__icon} /> },
    { name: 'pressed', title: 'Pressed', image: <Pressed className={style.ShapeSwitcher__icon} /> },
    { name: 'flat', title: 'Flat', image: <Flat className={style.ShapeSwitcher__icon} /> },
  ];

  return (
    <>
      <div className={`${style.ShapeSwitcher__row} ${style.ShapeSwitcher__label}`}>
        <label className={style.ShapeSwitcher__label}>Form: </label>
      </div>
      <div className={style.ShapeSwitcher__row}>
        <div className={style.ShapeSwitcher}>
          {shapes.map((btnShape) => (
            <ShapeButton
              key={btnShape.name}
              shape={shape}
              setShape={setShape}
              name={btnShape.name as FormShape}
              title={btnShape.title}
              image={btnShape.image}
            />
          ))}
        </div>
      </div>
    </>
  );
};
