import { NeumorphicOptions } from '../../../../types';

const Y = 50;
const Y_OFFSET = 60;
const CONCAVITY_OFFSET = 80;

type NeumorphicPathProps = Pick<NeumorphicOptions, 'intensity' | 'blur' | 'concavity'> & {
  className?: string;
};

const getPathD = ({ intensity, blur, concavity }: NeumorphicPathProps): string => {
  const intensityValue = Y - (intensity ?? 0) * Y + Y_OFFSET;
  const concavityValue = (concavity ?? 0) * CONCAVITY_OFFSET - intensityValue;
  const blurValue = ((blur ?? 0) * 60) / 100;
  const startY = Y + Y_OFFSET;

  return `m0 ${startY}L${60 - blurValue} ${startY}Q60 ${startY} 60 ${intensityValue} 185 ${-concavityValue} 310 ${intensityValue} 310 ${startY} ${310 + blurValue} ${startY}L370 ${startY}`;
};

export const NeumorphicPath = ({ intensity, blur, concavity, className }: NeumorphicPathProps) => {
  const d = getPathD({ intensity, blur, concavity });

  return (
    <svg height={100} viewBox="0 0 370 220" className={className}>
      <path d={d} />
    </svg>
  );
};
