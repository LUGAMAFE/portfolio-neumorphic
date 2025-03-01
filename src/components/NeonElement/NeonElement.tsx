import { createIntrinsicElements } from '@/utils/createIntrinsicElements';
import { JSX, useMemo, useState } from 'react';
import { NeonElementRenderer, NeonElementRendererProps } from './components/NeonElementRenderer';
import { TooltipWrapper } from './components/TooltipWrapper';
import { NeonProvider } from './providers/NeonProvider';
import { NeonProps } from './types';

const NeuElements = createIntrinsicElements<NeonProps>((tag, props) => (
  <NeonElementWrapper<keyof JSX.IntrinsicElements> tag={tag} {...props} />
));

function NeonElementWrapper<Tag extends keyof JSX.IntrinsicElements>(
  props: NeonElementRendererProps<Tag>
) {
  const [open, setOpen] = useState(false);

  const memoizedRenderer = useMemo(() => <NeonElementRenderer {...props} />, [props]);

  const memoizedTooltip = useMemo(
    () => (
      <TooltipWrapper open={open} setOpen={setOpen}>
        {memoizedRenderer}
      </TooltipWrapper>
    ),
    [open, setOpen, memoizedRenderer]
  );

  return <NeonProvider>{memoizedTooltip}</NeonProvider>;
}

export const NeonElement = NeuElements;
