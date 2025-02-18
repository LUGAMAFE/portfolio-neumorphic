import { NeonElement } from '@/components/NeonElement';
import { useNeonColorsContext } from '@/providers/NeonColorsProvider';
import style from '../styles/Point.module.scss';

interface SectionPointProps {
  classPointer: string;
  index: number;
}

export const SectionPoint = ({ classPointer, index }: SectionPointProps) => {
  const { neonColors } = useNeonColorsContext();
  return (
    <button className={style.Point} name={`${classPointer}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
      >
        <NeonElement.g
          color1={neonColors.firstGradientColor}
          color2={neonColors.secondGradientColor}
          direction={0}
          blur={5}
          intensity={0.1}
          speed={5}
        >
          <circle cx="18" cy="18" r="10" />
        </NeonElement.g>
        <g filter="url(#filter0_d_42_14)">
          <circle id={`svgWhite${index}`} cx="18" cy="18" r="0" fill="white" />
        </g>
        <g filter="url(#filter0_d_42_14)">
          <circle id={`svgWhiteClick${index}`} cx="18" cy="18" r="0" fill="white" />
        </g>
      </svg>
    </button>
  );
};
