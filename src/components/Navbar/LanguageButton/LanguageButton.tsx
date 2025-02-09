import { NeonElement } from '@/components/NeonElement';
import { NeumorphicElement } from '@/components/NeumorphicElement';
import { NeumorphicElementProps } from '@/components/NeumorphicElement/types';

export interface LanguageButtonProps extends NeumorphicElementProps<'button'> {
  text: string;
  id: string;
  clickHandler: (id: string) => void;
  textClassName?: string;
  colors: string[];
}

export const LanguageButton = ({
  id,
  text,
  neumorphicOptions,
  className,
  style,
  textClassName,
  colors,
  clickHandler,
}: LanguageButtonProps) => {
  return (
    <NeumorphicElement.button
      key={id}
      onClick={() => clickHandler(id)}
      neumorphicOptions={neumorphicOptions}
      className={className}
    >
      <NeonElement.span
        className={textClassName}
        style={style}
        color1={colors[0]}
        color2={colors[1]}
        blur={4}
      >
        {text}
      </NeonElement.span>
    </NeumorphicElement.button>
  );
};
