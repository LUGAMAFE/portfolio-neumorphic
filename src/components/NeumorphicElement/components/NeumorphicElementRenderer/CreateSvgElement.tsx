import React, { forwardRef, JSX, memo, useMemo } from 'react';
import CreateDefs from './CreateDefs';
import { NeumorphicElementRendererProps } from './NeumorphicElementRenderer';
import SvgGroupElementWithDefs from './SvgGroupElementWithDefs';

export type SvgWithDefsProps<Tag extends keyof JSX.IntrinsicElements> = {
  style2: React.CSSProperties;
  ref?: React.Ref<SVGElement>;
} & NeumorphicElementRendererProps<Tag>;

/**
 * Component that renders SVG elements with definitions (defs) for gradient and filter.
 */
const CreateSvgElement = memo(
  forwardRef(
    <Tag extends keyof JSX.IntrinsicElements>(
      { tag, style2, style, children, ...rest }: SvgWithDefsProps<Tag>,
      ref: React.Ref<SVGElement>
    ) => {
      const id = React.useId();
      const svgAttrsNames = useMemo(
        () => ({
          gradientName: `neumorphicLinearGradient-${id}`,
          filterName: `neumorphicFilter-${id}`,
        }),
        [id]
      );

      const mergedStyle = useMemo(() => ({ ...style2, ...style }), [style2, style]);

      // Importante: Asegurarnos que TagElement es el tipo correcto
      const TagElement = tag as keyof JSX.IntrinsicElements;

      // If the tag is 'g' or 'svg', render directly with defs
      if (tag === 'g' || tag === 'svg') {
        return (
          <TagElement
            {...rest}
            style={mergedStyle}
            ref={ref}
            filter={`url(#${svgAttrsNames.filterName})`}
            fill={`url(#${svgAttrsNames.gradientName})`}
          >
            {children}
            <CreateDefs svgAttrsNames={svgAttrsNames} />
          </TagElement>
        );
      }

      // For other SVG tags, use a group that includes a <path> with defs
      return (
        <SvgGroupElementWithDefs
          tag={tag}
          style2={style2}
          style={style}
          svgAttrsNames={svgAttrsNames}
          ref={ref}
          {...rest}
        >
          {children}
        </SvgGroupElementWithDefs>
      );
    }
  )
);

CreateSvgElement.displayName = 'CreateSvgElement';

export default CreateSvgElement;
