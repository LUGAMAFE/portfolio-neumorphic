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
        <g filter="url(#filter0_d_42_14)">
          <circle cx="18" cy="18" r="10" fill={`url(#paint0_linear_42_14)`} />
        </g>
        <g filter="url(#filter0_d_42_14)">
          <circle id={`svgWhite${index}`} cx="18" cy="18" r="0" fill="white" />
        </g>
        <g filter="url(#filter0_d_42_14)">
          <circle id={`svgWhiteClick${index}`} cx="18" cy="18" r="0" fill="white" />
        </g>
        <g filter="url(#filter0_d_42_14)">
          <circle id={`svgPink${index}`} cx="18" cy="18" r="0" fill={`url(#paint0_linear_42_14)`} />
        </g>
        <defs>
          <filter
            id="filter0_d_42_14"
            x="0"
            y="0"
            width="36"
            height="36"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="100" result="hardAlpha" />
            <feOffset />
            <feGaussianBlur stdDeviation="4" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 0.726042 0 0 0 0 0.748726 0 0 0 0.61 0"
            />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_42_14" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_42_14"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_42_14"
            x1="18"
            y1="8"
            x2="18"
            y2="28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={`${neonColors.firstGradientColor}`} />
            <stop offset="1" stopColor={`${neonColors.secondGradientColor}`} />
          </linearGradient>
        </defs>
      </svg>
    </button>
  );
};
