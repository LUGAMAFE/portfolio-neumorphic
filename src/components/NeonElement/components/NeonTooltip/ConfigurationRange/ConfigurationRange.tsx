import { camelize } from '@/components/NeumorphicElement/utils';
import { ChangeEvent } from 'react';
import style from './ConfigurationRange.module.scss';
interface ConfigurationRangeProps {
  label: string;
  type: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const ConfigurationRange = ({
  label,
  type,
  value,
  min,
  max,
  step = 1,
  disabled,
  onChange,
}: ConfigurationRangeProps) => {
  return (
    <div className={style.ConfigurationRange__row}>
      <label className={style.ConfigurationRange__label} htmlFor={camelize(label)}>
        {label}:{' '}
      </label>
      <input
        type={type}
        name={camelize(label)}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        id={camelize(label)}
        disabled={disabled || !value}
        className={style.ConfigurationRange__input}
      />
    </div>
  );
};
