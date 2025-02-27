import { useEffect, useState } from 'react';

import useDeviceType from '../../hooks/useDeviceType';

import { useNeonColorsContext } from '@/providers/NeonColorsProvider';
import { useNeumorphicStylesContext } from '@/providers/NeumorphicStylesProvider';
import { NeumorphicElement } from '../NeumorphicElement/NeumorphicElement';
import { NeumorphicElementProps } from '../NeumorphicElement/types';
import {
  NeonColorPickerButton,
  NeonColorPickerButtonProps,
} from './components/NeonColorPickerButton';
import style from './SidebarMenu.module.scss';

interface SidebarMenuProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const SidebarMenu = ({ isOpen, setIsOpen }: SidebarMenuProps) => {
  const { handleChangeColorNeon } = useNeonColorsContext();
  const { currentTheme } = useNeumorphicStylesContext();
  const { isMobile } = useDeviceType();

  const initialButtonCloseConfig: Omit<NeumorphicElementProps<'button'>, 'surfaceColor'> = {
    id: 'externalButtonClose',
    className: style.SidebarMenu_button,
    concavity: 0,
    depth: 0.45,
    lightSource: 1,
    softness: 9,
    onClick: () => handleButtonClickX('externalButtonClose'),
  };
  const [buttonCloseConfig, setButtonCloseConfig] = useState(initialButtonCloseConfig);

  const handleButtonClickX = (id: string | number) => {
    setButtonCloseConfig((prevButtonCloseConfig) =>
      prevButtonCloseConfig.id === id
        ? {
            ...prevButtonCloseConfig,
            concavity: -(prevButtonCloseConfig.concavity ?? 0),
          }
        : prevButtonCloseConfig
    );
  };

  useEffect(() => {
    const externalButtonClose = document.getElementById('externalButtonClose');
    const handleButtonClickClose = () => {
      setIsOpen(false);
    };

    if (externalButtonClose) {
      externalButtonClose.addEventListener('click', handleButtonClickClose);
    }

    return () => {
      if (externalButtonClose) {
        externalButtonClose.removeEventListener('click', handleButtonClickClose);
      }
    };
  }, []);

  const handleButtonClick = (value: number) => {
    handleChangeColorNeon(value);
    setButtonConfigs((prev) =>
      prev.map((button) =>
        button.value === value
          ? {
              ...button,
              concavity: -1,
              depth: -1,
              lightSource: 1,
              style: {
                color: 'transparent',
              },
            }
          : {
              ...button,
              concavity: -0.5,
              depth: 0.8,
              lightSource: 1,
              style: {
                color: 'white',
              },
            }
      )
    );
  };

  const initialButtonConfigs: Omit<NeonColorPickerButtonProps, 'surfaceColor'>[] = [
    {
      id: 'Opcion1',
      text: 'Pink',
      value: 1,
      className: style.SidebarMenu_radio,
      textClassName: style.SidebarMenu_listElementText,
      handleButtonClick: handleButtonClick,
      concavity: -1,
      depth: -1,
      lightSource: 1,
      softness: 6,
      style: {
        color: 'transparent',
      },
    },
    {
      id: 'Opcion2',
      text: 'Blue',
      value: 2,
      className: style.SidebarMenu_radio,
      textClassName: style.SidebarMenu_listElementText,
      handleButtonClick: handleButtonClick,
      concavity: -0.5,
      depth: 0.8,
      lightSource: 1,
      softness: 5,
      style: {
        color: 'white',
      },
    },
    {
      id: 'Opcion3',
      text: 'Red',
      value: 3,
      className: style.SidebarMenu_radio,
      textClassName: style.SidebarMenu_listElementText,
      handleButtonClick: handleButtonClick,
      concavity: -0.5,
      depth: 0.8,
      lightSource: 1,
      softness: 5,
      style: {
        color: 'white',
      },
    },
  ];

  const [buttonConfigs, setButtonConfigs] = useState(initialButtonConfigs);

  return (
    <div>
      <NeumorphicElement.div
        depth={0.19}
        lightSource={1}
        softness={11}
        surfaceColor={currentTheme.color}
        intensity={currentTheme.intensity}
        className={style.SidebarMenu}
        style={{
          zIndex: 999,
          width: isOpen ? (isMobile ? '150px' : '275px') : '0',
          transition: 'width 0.5s ease',
        }}
      >
        <NeumorphicElement.button {...buttonCloseConfig} surfaceColor={currentTheme.color}>
          <img
            className={style.SidebarMenu_menuSVG}
            src="/images/cross.svg"
            alt="circle part of input"
          />
        </NeumorphicElement.button>
        <div className={style.SidebarMenu_divider}></div>
        <ul className={style.SidebarMenu_sectionsContainer}>
          <li className={style.SidebarMenu_listElement}>
            <div className={style.SidebarMenu_imageContainer}>
              <svg
                className={style.SidebarMenu_listSVG}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 2c3.213 0 5.982 1.908 7.254 4.648a7.8 7.8 0 0 1-.895-.498c-.409-.258-.873-.551-1.46-.772-.669-.255-1.4-.378-2.234-.378s-1.565.123-2.234.377c-.587.223-1.051.516-1.472.781-.378.237-.703.443-1.103.594C9.41 8.921 8.926 9 8.33 9c-.595 0-1.079-.079-1.524-.248-.4-.151-.728-.358-1.106-.598-.161-.101-.34-.208-.52-.313C6.587 5.542 9.113 4 12 4zm0 16c-4.411 0-8-3.589-8-8 0-.81.123-1.59.348-2.327.094.058.185.11.283.173.411.26.876.554 1.466.776.669.255 1.399.378 2.233.378.833 0 1.564-.123 2.235-.377.587-.223 1.051-.516 1.472-.781.378-.237.703-.443 1.103-.595.445-.168.929-.247 1.525-.247s1.08.079 1.525.248c.399.15.725.356 1.114.602.409.258.873.551 1.46.773.363.138.748.229 1.153.291.049.357.083.717.083 1.086 0 4.411-3.589 8-8 8z"></path>
                <circle cx="8.5" cy="13.5" r="1.5"></circle>
                <circle cx="15.5" cy="13.5" r="1.5"></circle>
              </svg>
            </div>
            <div className={style.SidebarMenu_listElementText}>Introducción</div>
          </li>
          <li className={style.SidebarMenu_listElement}>
            <div className={style.SidebarMenu_imageContainer}>
              <svg
                className={style.SidebarMenu_listSVG}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M20.5 5A1.5 1.5 0 0 0 19 6.5V11h-1V4.5a1.5 1.5 0 0 0-3 0V11h-1V3.5a1.5 1.5 0 0 0-3 0V11h-1V5.5a1.5 1.5 0 0 0-3 0v10.81l-2.22-3.6a1.5 1.5 0 0 0-2.56 1.58l3.31 5.34A5 5 0 0 0 9.78 22H17a5 5 0 0 0 5-5V6.5A1.5 1.5 0 0 0 20.5 5z"></path>
              </svg>
            </div>
            <div className={style.SidebarMenu_listElementText}>Presentación</div>
          </li>
          <li className={style.SidebarMenu_listElement}>
            <div className={style.SidebarMenu_imageContainer}>
              <svg
                className={style.SidebarMenu_listSVG}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M20 6h-3V4c0-1.103-.897-2-2-2H9c-1.103 0-2 .897-2 2v2H4c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2zm-5-2v2H9V4h6zM4 8h16v4h-3v-2h-2v2H9v-2H7v2H4V8zm0 11v-5h3v2h2v-2h6v2h2v-2h3.001v5H4z"></path>
              </svg>
            </div>
            <div className={style.SidebarMenu_listElementText}>Proyectos</div>
          </li>
          <li className={style.SidebarMenu_listElement}>
            <div className={style.SidebarMenu_imageContainer}>
              <svg
                className={style.SidebarMenu_listSVG}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M2 2h2v20H2z"></path>
                <rect x="6" y="13" width="16" height="6" rx="1"></rect>
                <rect x="6" y="5" width="12" height="6" rx="1"></rect>
              </svg>
            </div>
            <div className={style.SidebarMenu_listElementText}>Skills</div>
          </li>
          <li className={style.SidebarMenu_listElement}>
            <div className={style.SidebarMenu_imageContainer}>
              <svg
                className={style.SidebarMenu_listSVG}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M16.604 11.048a5.67 5.67 0 0 0 .751-3.44c-.179-1.784-1.175-3.361-2.803-4.44l-1.105 1.666c1.119.742 1.8 1.799 1.918 2.974a3.693 3.693 0 0 1-1.072 2.986l-1.192 1.192 1.618.475C18.951 13.701 19 17.957 19 18h2c0-1.789-.956-5.285-4.396-6.952z"></path>
                <path d="M9.5 12c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2zm1.5 7H8c-3.309 0-6 2.691-6 6v1h2v-1c0-2.206 1.794-4 4-4h3c2.206 0 4 1.794 4 4v1h2v-1c0-3.309-2.691-6-6-6z"></path>
              </svg>
            </div>
            <div className={style.SidebarMenu_listElementText}>Colaboraciones</div>
          </li>
          <li className={style.SidebarMenu_listElement}>
            <div className={style.SidebarMenu_imageContainer}>
              <svg
                className={style.SidebarMenu_listSVG}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="m7.375 16.781 1.25-1.562L4.601 12l4.024-3.219-1.25-1.562-5 4a1 1 0 0 0 0 1.562l5 4zm9.25-9.562-1.25 1.562L19.399 12l-4.024 3.219 1.25 1.562 5-4a1 1 0 0 0 0-1.562l-5-4zm-1.649-4.003-4 18-1.953-.434 4-18z"></path>
              </svg>
            </div>
            <div className={style.SidebarMenu_listElementText}>Código</div>
          </li>
          <li className={style.SidebarMenu_listElement}>
            <div className={style.SidebarMenu_imageContainer}>
              <svg
                className={style.SidebarMenu_listSVG}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M21 2H6a2 2 0 0 0-2 2v3H2v2h2v2H2v2h2v2H2v2h2v3a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-8 2.999c1.648 0 3 1.351 3 3A3.012 3.012 0 0 1 13 11c-1.647 0-3-1.353-3-3.001 0-1.649 1.353-3 3-3zM19 18H7v-.75c0-2.219 2.705-4.5 6-4.5s6 2.281 6 4.5V18z"></path>
              </svg>
            </div>
            <div className={style.SidebarMenu_listElementText}>Contacto</div>
          </li>
        </ul>
        <div className={style.SidebarMenu_divider}></div>
        <div className={style.SidebarMenu_neuContainer}>
          {buttonConfigs.map((button, index) => (
            <div key={index} style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <NeonColorPickerButton
                {...button}
                surfaceColor={currentTheme.color}
                intensity={currentTheme.intensity}
              ></NeonColorPickerButton>
            </div>
          ))}
        </div>
      </NeumorphicElement.div>
    </div>
  );
};
