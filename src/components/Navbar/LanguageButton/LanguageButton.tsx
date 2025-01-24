import { NeumorphicElement } from '@/components/NeumorphicElement';
import { NeumorphicElementProps } from '@/components/NeumorphicElement/types';

export interface LanguageButtonProps extends NeumorphicElementProps<'button'> {
  text: string;
  id: string;
  clickHandler: (id: string) => void;
  textClassName: string;
}

export const LanguageButton = ({
  id,
  text,
  neumorphicOptions,
  className,
  style,
  textClassName,
  clickHandler,
}: LanguageButtonProps) => {
  <NeumorphicElement
    key={id}
    element={'button'}
    onClick={() => clickHandler(id)}
    neumorphicOptions={neumorphicOptions}
    className={className}
  >
    <p className={textClassName} style={style}>
      {text}
    </p>
  </NeumorphicElement>;
};
