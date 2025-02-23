import React, { forwardRef, JSX } from 'react';
import { useNeumorphicContext } from '../../providers/NeumorphicProvider';
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
const CreateSvgElement = forwardRef(
  <Tag extends keyof JSX.IntrinsicElements>(
    { tag, style2, style, children, ...rest }: SvgWithDefsProps<Tag>,
    ref: React.Ref<SVGElement>
  ) => {
    const id = React.useId();
    const { contextConfig } = useNeumorphicContext();
    const svgAttrsNames = {
      gradientName: `neumorphicLinearGradient-${id}`,
      filterName: `neumorphicFilter-${id}`,
    };

    // Importante: Asegurarnos que TagElement es el tipo correcto
    const TagElement = tag as keyof JSX.IntrinsicElements;

    if (!contextConfig.formShape) {
      return null;
    }

    // If the tag is 'g' or 'svg', render directly with defs
    if (tag === 'g' || tag === 'svg') {
      return (
        <TagElement
          {...rest}
          style={{ ...style2, ...style }}
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
);

CreateSvgElement.displayName = 'CreateSvgElement';

export default CreateSvgElement;
