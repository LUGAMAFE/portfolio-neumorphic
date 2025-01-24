import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Draggable from 'gsap-trial/Draggable';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

import { NeumorphicElement } from '@/components/NeumorphicElement';
import { FormShape } from '@/components/NeumorphicElement/types';
import { ThemePreset, useNeumorphicStylesContext } from '@/providers/NeumorphicStylesProvider';
import style from './ImageComparator.module.scss';

gsap.registerPlugin(ScrollTrigger, Draggable);
export const ImageComparator = () => {
  const { currentTheme } = useNeumorphicStylesContext();
  const myElement = useRef(null);

  useGSAP(
    () => {
      gsap.set(`.${style.ImageComparator__dragger}`, { x: 100 });
      gsap.set(`.${style.ImageComparator__clipped}`, { clipPath: `inset(0px 0px 0px 100px)` });

      Draggable.create(`.${style.ImageComparator__dragger}`, {
        type: 'x',
        bounds: `.${style.ImageComparator__circle}`,
        onDrag: function () {
          gsap.set(`.${style.ImageComparator__clipped}`, {
            clipPath: `inset(0px 0px 0px ${this.x}px)`,
          });
        },
      });
    },
    { scope: myElement }
  );

  return (
    <div ref={myElement} className={style.ImageComparator}>
      <NeumorphicElement
        className={style.ImageComparator__imageComparer}
        neumorphicOptions={{
          form: FormShape.Concave,
          size: currentTheme == ThemePreset.Light ? 378 : 165,
          intensity: currentTheme == ThemePreset.Light ? 0.28 : 0.9,
          lightSource: 1,
          distance: currentTheme == ThemePreset.Light ? 38 : 17,
          blur: currentTheme == ThemePreset.Light ? 16 : 33,
        }}
      >
        <div className={style.ImageComparator__circle}>
          <img
            className={`${style.ImageComparator__backImage} ${style.ImageComparator__galleryImage}`}
            src="images/luis.png"
            alt="programer luis image"
            draggable="false"
          />
          <img
            className={`${style.ImageComparator__backImage} ${style.ImageComparator__clipped} ${style.ImageComparator__galleryImage}`}
            src="images/luis100realnofake.png"
            alt="programer luis image"
            draggable="false"
          />
          <div className={style.ImageComparator__dragger}></div>
        </div>
      </NeumorphicElement>
    </div>
  );
};
