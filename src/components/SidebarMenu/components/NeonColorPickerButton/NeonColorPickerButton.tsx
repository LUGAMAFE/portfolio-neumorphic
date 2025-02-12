import { NeumorphicElement } from '@/components/NeumorphicElement';
import { NeumorphicElementProps } from '@/components/NeumorphicElement/types';

export type NeonColorPickerButtonProps = NeumorphicElementProps<'button'> & {
  id: string;
  text: string;
  handleButtonClick: (id: number) => void;
  textClassName: string;
  value: number;
};

export const NeonColorPickerButton = ({
  id,
  className,
  style,
  text,
  handleButtonClick,
  textClassName,
  value,
  ...rest
}: NeonColorPickerButtonProps) => {
  return (
    <>
      <NeumorphicElement.button
        key={id}
        onClick={() => handleButtonClick(value)}
        className={className}
        {...rest}
      ></NeumorphicElement.button>
      <p className={textClassName} style={style}>
        {text}
      </p>
    </>
  );
};
