import { useState } from 'react';
import { RealNeumorphicElement } from './components/RealNeumorphicElement';
import { NeumorphicProvider } from './providers/NeumorphicProvider';
import { TooltipWrapper } from './TooltipWrapper';
import { NeumorphicElementProps } from './types';

export const NeumorphicElement = <T extends React.ElementType>(
  props: NeumorphicElementProps<T>
) => {
  const [open, setOpen] = useState(false);
  const { onClick } = props;
  const onClickEvent: React.MouseEventHandler<HTMLDivElement> = (event) => {
    setOpen((prev) => !prev);
    if (onClick) onClick(event);
  };
  return (
    <NeumorphicProvider>
      <TooltipWrapper open={open} setOpen={setOpen}>
        <RealNeumorphicElement {...props} onClick={onClickEvent} />
      </TooltipWrapper>
    </NeumorphicProvider>
  );
};
