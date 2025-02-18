import { NeumorphicOptions } from '../../../../types';

const Y = 50;
const Y_OFFSET = 60;
const CONCAVITY_OFFSET = 80;

type NeumorphicPathProps = Pick<NeumorphicOptions, 'softness' | 'depth' | 'concavity'> & {
  className?: string;
};

const getPathD = ({ softness, depth, concavity }: NeumorphicPathProps): string => {
  const depthValue = Y - (depth ?? 0) * Y + Y_OFFSET;
  const concavityValue = (concavity ?? 0) * CONCAVITY_OFFSET - depthValue;
  const softnessValue = ((softness ?? 0) * 60) / 100;
  const startY = Y + Y_OFFSET;

  return `m0 ${startY}L${60 - softnessValue} ${startY}Q60 ${startY} 60 ${depthValue} 185 ${-concavityValue} 310 ${depthValue} 310 ${startY} ${310 + softnessValue} ${startY}L370 ${startY}`;
};

export const NeumorphicPath = ({ softness, depth, concavity, className }: NeumorphicPathProps) => {
  const d = getPathD({ softness, depth, concavity });

  return (
    <svg height={100} viewBox="0 0 370 220" className={className}>
      <path d={d} />
    </svg>
  );
};
