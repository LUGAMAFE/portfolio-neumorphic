import { MouseEvent } from 'react';
import style from './LightSourceSelector.module.scss';

interface LightSourceSelectorProps {
  lightSource: number;
  disabled?: boolean;
  onDirectionChanged: (name: number) => void;
}

export const LightSourceSelector = ({
  lightSource,
  onDirectionChanged,
  disabled,
}: LightSourceSelectorProps) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const direction = Number((event.target as HTMLButtonElement).name);
    onDirectionChanged(direction);
  };

  const directions = [1, 2, 4, 3];
  return (
    <div
      className={`${style.LightSourceSelector} ${disabled && style.LightSourceSelector_disabled}`}
    >
      {directions.map((direction) => (
        <button
          key={direction}
          className={`${style.LightSourceSelector__arrow} ${lightSource === direction && style.LightSourceSelector__arrow_active}`}
          onClick={handleClick}
          name={`${direction}`}
        ></button>
      ))}
    </div>
  );
};
