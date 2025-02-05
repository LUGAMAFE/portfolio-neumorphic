import { createIntrinsicElements } from '@/utils/createIntrinsicElements';
import { JSX, useState } from 'react';

import {
  NeumorphicElementRenderer,
  NeumorphicElementRendererProps,
} from './components/NeumorphicElementRenderer';
import { TooltipWrapper } from './components/TooltipWrapper';
import { NeumorphicProvider } from './providers/NeumorphicProvider';
import { NeumorphicProps } from './types';

const NeuElements = createIntrinsicElements<NeumorphicProps>((tag, props) => (
  <NeumorphicElementWrapper<keyof JSX.IntrinsicElements> tag={tag} {...props} />
));

function NeumorphicElementWrapper<Tag extends keyof JSX.IntrinsicElements>(
  props: NeumorphicElementRendererProps<Tag>
) {
  const { allowClicks = true } = props;
  const [open, setOpen] = useState(false);

  return (
    <NeumorphicProvider>
      <TooltipWrapper open={open} setOpen={setOpen} allowClicks={allowClicks}>
        <NeumorphicElementRenderer {...props} />
      </TooltipWrapper>
    </NeumorphicProvider>
  );
}

export const NeumorphicElement = NeuElements;
