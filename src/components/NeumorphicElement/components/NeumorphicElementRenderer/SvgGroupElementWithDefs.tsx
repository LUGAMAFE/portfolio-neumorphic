import { forwardRef, JSX } from 'react';
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
const SvgGroupElementWithDefs = forwardRef(
  <Tag extends keyof JSX.IntrinsicElements>(
    { svgAttrsNames, style2, tag: TagElement, ...rest }: SvgGroupElementWithDefsProps<Tag>,
    ref: React.Ref<SVGElement>
  ) => {
    return (
      <g style={style2}>
        <CreateDefs svgAttrsNames={svgAttrsNames} />
        <TagElement
          {...rest}
          ref={ref}
          fill={`url(#${svgAttrsNames.gradientName})`}
          filter={`url(#${svgAttrsNames.filterName})`}
        />
      </g>
    );
  }
);

SvgGroupElementWithDefs.displayName = 'SvgGroupElementWithDefs';

export default SvgGroupElementWithDefs;
