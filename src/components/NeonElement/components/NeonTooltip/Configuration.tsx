import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { AnglePicker, Format } from '@/components/AnglePicker';
import {
  deleteFalsyProperties,
  getContrast,
  isValidColor,
} from '@/components/NeumorphicElement/utils';
import { useNeumorphicStylesContext } from '@/providers/NeumorphicStylesProvider';
import { useNeonContext } from '../../providers/NeonProvider';
import { GradientType } from '../../types';
import { isSVGElement, isTextElement } from '../../utils';
import style from './Configuration.module.scss';
import { ConfigurationRange } from './ConfigurationRange';

const Configuration = () => {
  const { contextConfig, updateContextConfigProp } = useNeonContext();
  const {
    currentTheme: { color: mainColorContext },
  } = useNeumorphicStylesContext();

  const [colorInputText1, setColorInputText1] = useState<string>('');
  const [colorInputText2, setColorInputText2] = useState<string>('');
  const [defaultCssVariables, setDefaultCssVariables] = useState<Record<string, string>>({});

  const copyToClipboard = () => {
    const textConfig = `neonOptions=${JSON.stringify(deleteFalsyProperties(contextConfig))}`;
    navigator.clipboard.writeText(textConfig);
    alert(`Copied neon element config: \n ${textConfig}`);
  };

  const updateColorAndCssVariables = useCallback((newColor: string) => {
    setDefaultCssVariables({
      '--textColor': `${getContrast(newColor)}`,
      '--textColorOpposite': newColor,
    });
  }, []);

  const handleColor1Change = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setColorInputText1(value);
      if (isValidColor(value)) {
        updateContextConfigProp('color1', value);
      }
    },
    [updateContextConfigProp]
  );

  const handleColor2Change = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setColorInputText2(value);
      if (isValidColor(value)) {
        updateContextConfigProp('color2', value);
      }
    },
    [updateContextConfigProp]
  );

  useEffect(() => {
    updateColorAndCssVariables(mainColorContext || '#ffffff');
  }, [mainColorContext, updateColorAndCssVariables]);

  useEffect(() => {
    setColorInputText1(contextConfig.color1 ?? '#ffffff');
    setColorInputText2(contextConfig.color2 ?? '#ffffff');
  }, [contextConfig.color1, contextConfig.color2]);

  const isTextTag = contextConfig.tag && isTextElement(contextConfig.tag);

  const ConfigurationRanges = useMemo(() => {
    return [
      {
        label: 'Intensity',
        type: 'range',
        value: contextConfig.intensity,
        onChange: (e: ChangeEvent<HTMLInputElement>) =>
          updateContextConfigProp('intensity', Number(e.target.value)),
        min: 0,
        max: 1,
        step: 0.01,
      },
      {
        label: isTextTag ? 'Text Blur' : 'Blur',
        type: 'range',
        value: contextConfig.blur,
        onChange: (e: ChangeEvent<HTMLInputElement>) =>
          updateContextConfigProp('blur', Number(e.target.value)),
        min: isTextTag ? 0.01 : 0.1,
        max: isTextTag ? 10 : 50,
        step: isTextTag ? 0.01 : 1,
      },
      {
        label: 'Speed',
        type: 'range',
        value: contextConfig.speed,
        onChange: (e: ChangeEvent<HTMLInputElement>) =>
          updateContextConfigProp('speed', Number(e.target.value)),
        min: 0,
        max: 50,
        step: 1,
      },
    ];
  }, [contextConfig, updateContextConfigProp]);

  const isSVG = contextConfig.tag && isSVGElement(contextConfig.tag);

  return (
    <div className={style.Configuration} style={defaultCssVariables}>
      <div className={style.Configuration__row}>
        <label className={style.Configuration__label} htmlFor="color1">
          Pick first color:
        </label>
        <input
          type="color"
          name="color1"
          onChange={(e) => updateContextConfigProp('color1', e.target.value)}
          placeholder="#ffffff"
          value={contextConfig.color1}
          id="color1"
          className={style.Configuration__inputColor}
        />
        <label
          htmlFor="colorInput1"
          className={style.Configuration__label}
          style={{ paddingLeft: '10px' }}
        >
          or
        </label>
        <input
          type="text"
          placeholder="#ffffff"
          name="color1"
          id="colorInput1"
          value={colorInputText1}
          onChange={handleColor1Change}
          className={style.Configuration__inputText}
        />
      </div>
      <div className={style.Configuration__row}>
        <label className={style.Configuration__label} htmlFor="color2">
          Pick second color:
        </label>
        <input
          type="color"
          name="color2"
          onChange={(e) => updateContextConfigProp('color2', e.target.value)}
          placeholder="#ffffff"
          value={contextConfig.color2}
          id="color2"
          className={style.Configuration__inputColor}
        />
        <label
          htmlFor="colorInput2"
          className={style.Configuration__label}
          style={{ paddingLeft: '10px' }}
        >
          or
        </label>
        <input
          type="text"
          placeholder="#ffffff"
          name="color2"
          id="colorInput2"
          value={colorInputText2}
          onChange={handleColor2Change}
          className={style.Configuration__inputText}
        />
      </div>

      {!isSVG && (
        <div className={`${style.Configuration__row} ${style.Configuration__gradient}`}>
          <label className={style.Configuration__label}>Gradient Type:</label>

          <select
            value={contextConfig.gradientType}
            onChange={(e) =>
              updateContextConfigProp('gradientType', e.target.value as GradientType)
            }
          >
            <option value={GradientType.LINEAR}>Linear</option>
            <option value={GradientType.CONIC}>Conic</option>
          </select>
        </div>
      )}

      {contextConfig.gradientType === GradientType.LINEAR && (
        <div className={`${style.Configuration__row} ${style.Configuration__label}`}>
          <label className={style.Configuration__label}>Pick an angle:</label>

          <AnglePicker
            id="anglePicker"
            value={contextConfig.direction}
            onChange={(newAngle) => {
              updateContextConfigProp('direction', newAngle);
            }}
            onAfterChange={(newAngle) => {
              updateContextConfigProp('direction', newAngle);
            }}
            pointerColor="#000"
            pointerWidth={5}
            angle={0}
            format={isSVG ? Format.SVG : Format.CSS}
          />

          <div
            style={{ minWidth: '34px', display: 'flex', justifyContent: 'center' }}
          >{`${contextConfig.direction}°`}</div>
        </div>
      )}

      {ConfigurationRanges.map((row, index) => (
        <ConfigurationRange
          key={index}
          label={row.label}
          type={row.type}
          value={row.value}
          onChange={row.onChange}
          min={row.min}
          max={row.max}
          step={row.step}
        />
      ))}

      {!isSVG && (
        <div className={style.Configuration__row}>
          <label className={style.Configuration__label} htmlFor="showFlare">
            Show flare:
          </label>
          <input
            type="checkbox"
            name="showFlare"
            id="showFlare"
            checked={contextConfig.showFlare}
            onChange={(e) => updateContextConfigProp('showFlare', e.target.checked)}
          />
        </div>
      )}

      <div className={style.Configuration__row} style={{ justifyContent: 'flex-end' }}>
        <button className={style.Configuration__copy} onClick={copyToClipboard}>
          Copy Config
        </button>
      </div>
    </div>
  );
};

export default Configuration;
