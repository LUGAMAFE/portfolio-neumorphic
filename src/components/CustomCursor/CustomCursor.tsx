import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import styles from './CustomCursor.module.scss';

export const CustomCursor = () => {
  const cursorRef = useRef(null);

  useGSAP(
    () => {
      const moveCursor = (e: MouseEvent) => {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
        });
      };

      window.addEventListener('mousemove', moveCursor);

      return () => {
        window.removeEventListener('mousemove', moveCursor);
      };
    },
    { scope: cursorRef }
  );

  return (
    <div ref={cursorRef} className={styles.Cursor}>
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <circle cx="25.5" cy="25.5" r="2.5" fill="white" />
          <circle cx="25" cy="25" r="23.5" stroke="white" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
};
