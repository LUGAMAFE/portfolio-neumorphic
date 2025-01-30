import { useState } from 'react';
import { RealNeumorphicElement } from './components/RealNeumorphicElement';
import { TooltipWrapper } from './components/TooltipWrapper';
import { NeumorphicProvider } from './providers/NeumorphicProvider';
import { NeumorphicElementProps } from './types';

export const NeumorphicElement = <T extends React.ElementType>(
  props: NeumorphicElementProps<T>
) => {
  const { allowClicks = true } = props;
  const [open, setOpen] = useState(false);

  return (
    <NeumorphicProvider>
      <TooltipWrapper open={open} setOpen={setOpen} allowClicks={allowClicks}>
        <RealNeumorphicElement {...props} />
      </TooltipWrapper>
    </NeumorphicProvider>
  );
};
