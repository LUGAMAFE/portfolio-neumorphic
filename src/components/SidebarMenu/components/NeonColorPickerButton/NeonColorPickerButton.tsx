import { NeonElement } from '@/components/NeonElement';
import { NeumorphicElement } from '@/components/NeumorphicElement';
import { NeumorphicElementProps } from '@/components/NeumorphicElement/types';
import { useNeonColorsContext } from '@/providers/NeonColorsProvider';

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
  const { neonColors } = useNeonColorsContext();
  return (
    <>
      <NeumorphicElement.button
        key={id}
        onClick={() => handleButtonClick(value)}
        className={className}
        {...rest}
      ></NeumorphicElement.button>
      <NeonElement.p
        className={textClassName}
        style={style}
        color1={neonColors.firstGradientColor}
        color2={neonColors.secondGradientColor}
      >
        {text}
      </NeonElement.p>
    </>
  );
};
