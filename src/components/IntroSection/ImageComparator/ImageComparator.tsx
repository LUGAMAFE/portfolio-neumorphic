import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Draggable from 'gsap-trial/Draggable';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMemo, useRef } from 'react';

import { NeonElement } from '@/components/NeonElement';
import { GradientType } from '@/components/NeonElement/types';
import { NeumorphicElement } from '@/components/NeumorphicElement';
import { ThemePreset } from '@/providers/AppProviders';
import { useNeonColorsContext } from '@/providers/NeonColorsProvider';
import { useNeumorphicStylesContext } from '@/providers/NeumorphicStylesProvider';
import chroma from 'chroma-js';
import style from './ImageComparator.module.scss';

gsap.registerPlugin(ScrollTrigger, Draggable);

// Utility function to synchronize image rotation with the parent circle
const syncImagesWithRotation = (selector: string) => {
  const rotation = gsap.getProperty(selector, 'rotation') as number;
  gsap.set(`.${style.ImageComparator__image}`, { rotate: -rotation });
  gsap.set(`.${style.ImageComparator__backgroundImage}`, { rotate: -rotation });
};

// Utility function to update the clipPath of the draggable element
const updateClipPath = (dragger: HTMLElement) => {
  const draggerPosition = gsap.getProperty(dragger, 'x') as number;
  gsap.set(`.${style.ImageComparator__clipWrapper}`, {
    clipPath: `inset(0px 0px 0px ${draggerPosition}px)`,
  });
};

// Utility function to scale the dragger element on press/release
const scaleDragger = (dragger: HTMLElement, scale: number) => {
  gsap.to(dragger, { scale, duration: 0.2 });
  gsap.to(`.${style.ImageComparator__draggerHandle}`, {
    scale: scale === 1.5 ? 1.2 : 1,
    duration: 0.2,
  });
};

// Utility function to add touch event handlers for the child dragger
const addTouchEvents = (dragger: HTMLElement, parentDragger: Draggable[]) => {
  dragger.addEventListener(
    'touchstart',
    (event) => {
      event.preventDefault();
      parentDragger.forEach((drag) => drag.disable());
    },
    { passive: true }
  );

  dragger.addEventListener(
    'touchend',
    () => {
      parentDragger.forEach((drag) => drag.enable());
    },
    { passive: true }
  );
};

export const ImageComparator = () => {
  const { currentTheme } = useNeumorphicStylesContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const { neonColors } = useNeonColorsContext();

  useGSAP(
    () => {
      // Element references
      const parentElement = document.querySelector(
        `.${style.ImageComparator__circle}`
      ) as HTMLElement;
      const draggerElement = document.querySelector(
        `.${style.ImageComparator__dragger}`
      ) as HTMLElement;

      if (!parentElement || !draggerElement) {
        console.error('Required elements not found.');
        return;
      }

      // Dynamic calculations for dragger positioning
      const maxParentWidth = parentElement.offsetWidth;
      const startPercentage = 0.4; // Start position as 40% of the parent width
      const movePercentage = 0.6; // Move distance as 60% of the parent width
      const DRAGGER_START_POSITION = maxParentWidth * startPercentage;
      const DRAGGER_MOVE_DISTANCE = maxParentWidth * movePercentage;

      // Initial setup
      gsap.set(draggerElement, { x: DRAGGER_START_POSITION });
      gsap.set(`.${style.ImageComparator__clipWrapper}`, {
        clipPath: `inset(0px 0px 0px ${DRAGGER_START_POSITION}px)`,
      });

      // Timeline animation
      const timeline = gsap.timeline({
        onComplete: () => {
          Draggable.create(draggerElement, {
            type: 'x',
            bounds: parentElement,
            activeCursor: 'col-resize',
            onPress: (event) => {
              event.preventDefault();
              event.stopPropagation();
              scaleDragger(draggerElement, 1.5);
            },
            onDrag: () => updateClipPath(draggerElement),
            onRelease: () => scaleDragger(draggerElement, 1),
          });

          // Draggable setup for parent circle
          const parentDragger = Draggable.create(`.${style.ImageComparator__circle}`, {
            type: 'rotation',
            inertia: true,
            onPress: () => {
              gsap.to(parentElement, { borderWidth: 14, duration: 0.2 });
            },
            onDrag: () => syncImagesWithRotation(`.${style.ImageComparator__circle}`),
            onRelease: () => {
              gsap.to(parentElement, { borderWidth: 6, duration: 0.2 });
            },
            liveSnap: { rotation: (value) => value },
          });

          // Just for mobile touch events
          addTouchEvents(draggerElement, parentDragger);
        },
      });

      timeline
        .to(
          `.${style.ImageComparator__circle}`,
          {
            onStart: () => {
              // Ensure this function returns void by not directly returning `gsap.to`.
              gsap.to(`.${style.ImageComparator__circle}`, { borderWidth: 14, duration: 0.2 });
            },
            rotation: -120,
            duration: 0.8,
            ease: 'power1.inOut',
            onUpdate: () => syncImagesWithRotation(`.${style.ImageComparator__circle}`),
          },
          0
        )
        .to(
          `.${style.ImageComparator__circle}`,
          {
            rotation: 180,
            duration: 1.4,
            ease: 'power1.inOut',
            onUpdate: () => syncImagesWithRotation(`.${style.ImageComparator__circle}`),
          },
          '>'
        )
        .to(
          `.${style.ImageComparator__circle}`,
          {
            rotation: 0,
            duration: 1,
            ease: 'power1.inOut',
            onUpdate: () => syncImagesWithRotation(`.${style.ImageComparator__circle}`),
            onComplete: () => {
              // Ensure this function returns void as well.
              gsap.to(`.${style.ImageComparator__circle}`, { borderWidth: 6, duration: 0.2 });
            },
          },
          '>'
        )
        .to(
          draggerElement,
          {
            x: DRAGGER_START_POSITION + DRAGGER_MOVE_DISTANCE,
            duration: 0.8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: 1,
            onStart: () => scaleDragger(draggerElement, 1.5),
            onUpdate: () => updateClipPath(draggerElement),
            onComplete: () => scaleDragger(draggerElement, 1),
          },
          '>'
        )
        .to(
          draggerElement,
          {
            x: 0,
            duration: 0.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: 1,
            onStart: () => scaleDragger(draggerElement, 1.5),
            onUpdate: () => updateClipPath(draggerElement),
            onComplete: () => scaleDragger(draggerElement, 1),
          },
          '>'
        );

      timeline.timeScale(1);
    },
    { scope: containerRef }
  );

  const neumorphicOptions =
    currentTheme.name === ThemePreset.LIGHT
      ? {
          depth: 0.8,
        }
      : {
          concavity: -1,
        };

  const mixedColor = useMemo(() => {
    const mix1 = chroma.mix(neonColors.firstGradientColor, '#ffffff', 0.1);
    const mix2 = chroma.mix(neonColors.secondGradientColor, '#ffffff', 0.1);
    return {
      firstGradientColor: mix1.hex(),
      secondGradientColor: mix2.hex(),
    };
  }, [neonColors.firstGradientColor, neonColors.secondGradientColor]);

  return (
    <div ref={containerRef} className={style.ImageComparator}>
      <NeumorphicElement.div
        className={style.ImageComparator__imageComparer}
        {...neumorphicOptions}
        surfaceColor={currentTheme.color}
        intensity={currentTheme.intensity}
        softness={48}
      >
        <NeonElement.div
          className={style.ImageComparator__circle2}
          showFlare={currentTheme.name === ThemePreset.DARK}
          intensity={0.5}
          blur={8}
          color1={
            currentTheme.name === ThemePreset.DARK ? '#e4ebf2' : mixedColor.firstGradientColor
          }
          color2={
            currentTheme.name === ThemePreset.DARK ? '#eff3f7' : mixedColor.secondGradientColor
          }
        ></NeonElement.div>
        <div className={style.ImageComparator__circle}>
          <div className={style.ImageComparator__clipWrapper}>
            <img
              className={style.ImageComparator__image}
              src="images/luis100realnofake.png"
              alt="programmer luis image"
              draggable="false"
            />
          </div>
          <img
            className={style.ImageComparator__backgroundImage}
            src="images/luis.png"
            alt="programmer luis image"
            draggable="false"
          />
          <NeonElement.div
            className={style.ImageComparator__dragger}
            showFlare={currentTheme.name === ThemePreset.DARK}
            intensity={0.5}
            blur={8}
            color1={
              currentTheme.name === ThemePreset.DARK ? '#e4ebf2' : mixedColor.firstGradientColor
            }
            color2={
              currentTheme.name === ThemePreset.DARK ? '#eff3f7' : mixedColor.secondGradientColor
            }
            gradientType={GradientType.CONIC}
          >
            <NeonElement.div
              className={style.ImageComparator__draggerHandle}
              showFlare={currentTheme.name === ThemePreset.DARK}
              intensity={0.5}
              blur={8}
              color1={
                currentTheme.name === ThemePreset.DARK ? '#e4ebf2' : mixedColor.firstGradientColor
              }
              color2={
                currentTheme.name === ThemePreset.DARK ? '#eff3f7' : mixedColor.secondGradientColor
              }
            >
              <div
                className={`${style.ImageComparator__draggerDot} ${style.ImageComparator__draggerDot_1}`}
              />
              <div
                className={`${style.ImageComparator__draggerDot} ${style.ImageComparator__draggerDot_2}`}
              />
              <div
                className={`${style.ImageComparator__draggerDot} ${style.ImageComparator__draggerDot_3}`}
              />
            </NeonElement.div>
          </NeonElement.div>
        </div>
      </NeumorphicElement.div>
    </div>
  );
};
