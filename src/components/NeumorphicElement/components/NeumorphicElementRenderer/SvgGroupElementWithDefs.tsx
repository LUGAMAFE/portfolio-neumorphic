import { forwardRef, JSX, memo, useMemo } from 'react';
import CreateDefs from './CreateDefs';
import { SvgWithDefsProps } from './CreateSvgElement';

type SvgGroupElementWithDefsProps<Tag extends keyof JSX.IntrinsicElements> = {
  svgAttrsNames: {
    gradientName: string;
    filterName: string;
  };
} & SvgWithDefsProps<Tag>;

/**
 * SVG group that includes <defs> and a <path> with applied filter and gradient.
 */
const SvgGroupElementWithDefs = memo(
  forwardRef(
    <Tag extends keyof JSX.IntrinsicElements>(
      { svgAttrsNames, style2, tag: TagElement, ...rest }: SvgGroupElementWithDefsProps<Tag>,
      ref: React.Ref<SVGElement>
    ) => {
      const memoizedSvgAttrsNames = useMemo(() => svgAttrsNames, [svgAttrsNames]);
      const memoizedStyle2 = useMemo(() => style2, [style2]);
      const memoizedFill = useMemo(
        () => `url(#${memoizedSvgAttrsNames.gradientName})`,
        [memoizedSvgAttrsNames.gradientName]
      );
      const memoizedFilter = useMemo(
        () => `url(#${memoizedSvgAttrsNames.filterName})`,
        [memoizedSvgAttrsNames.filterName]
      );

      return (
        <g style={memoizedStyle2}>
          <CreateDefs svgAttrsNames={svgAttrsNames} />
          <TagElement {...rest} ref={ref} fill={memoizedFill} filter={memoizedFilter} />
        </g>
      );
    }
  )
);

SvgGroupElementWithDefs.displayName = 'SvgGroupElementWithDefs';

export default SvgGroupElementWithDefs;
