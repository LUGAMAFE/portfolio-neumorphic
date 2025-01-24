import { RealNeumorphicElement } from './components/RealNeumorphicElement';
import { NeumorphicProvider } from './providers/NeumorphicProvider';
import { NeumorphicElementProps } from './types';

export const NeumorphicElement = <T extends React.ElementType>(
  props: NeumorphicElementProps<T>
) => {
  return (
    <NeumorphicProvider>
      <RealNeumorphicElement {...props} />
    </NeumorphicProvider>
  );
};
