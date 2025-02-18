import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { useNeumorphicContext } from '../../../providers/NeumorphicProvider';
import { FormShape } from '../../../types';
import { deleteFalsyProperties, getContrast, isValidColor } from '../../../utils';

import { AnglePicker, Format } from '@/components/AnglePicker';
import { LightSourceSelector } from '../LightSourceSelector';
import { ShapeSwitcher } from '../ShapeSwitcher';
import style from './Configuration.module.scss';
import { ConfigurationRange } from './ConfigurationRange';
import { NeumorphicPath } from './NeumorphicPath/NeumorphicPath';

const getAngleFromDirection = (direction: number) => {
  const angleMap: { [key: number]: number } = {
    1: 225,
    2: 315,
    4: 145,
    3: 45,
  };
  return angleMap[direction] || 0;
};

const Configuration = () => {
  const { contextConfig, updateContextConfigProp, measureDimensions, dimensions } =
    useNeumorphicContext();
  const [color, setColor] = useState<string>('#ffffff');
  const [colorInputText, setColorInputText] = useState<string>('#ffffff');
  const [defaultCssVariables, setDefaultCssVariables] = useState<Record<string, string>>({});
  const [angle, setAngle] = useState<number>(() =>
    getAngleFromDirection(contextConfig.lightSource ?? 1)
  );

  const copyToClipboard = () => {
    const textConfig = `neumorphicOptions=${JSON.stringify(deleteFalsyProperties(contextConfig))}`;
    navigator.clipboard.writeText(textConfig);
    alert(`Copied neumorphic element config: \n ${textConfig}`);
  };

  const updateColorAndCssVariables = useCallback((newColor: string) => {
    setColor(newColor);
    setColorInputText(newColor);
    setDefaultCssVariables({
      '--textColor': `${getContrast(newColor)}`,
      '--textColorOpposite': newColor,
    });
  }, []);

  const handleColorChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setColorInputText(value);
      if (isValidColor(value)) {
        updateContextConfigProp('surfaceColor', value);
      }
    },
    [updateContextConfigProp]
  );

  const handleShape = useCallback(
    (name: FormShape) => {
      updateContextConfigProp('formShape', name);
    },
    [updateContextConfigProp]
  );

  const handleDirection = useCallback(
    (direction: number): void => {
      updateContextConfigProp('lightSource', direction);
      const newAngle = getAngleFromDirection(direction);
      setAngle(newAngle);
    },
    [updateContextConfigProp]
  );

  const handleDirectionAngle = useCallback(
    (angulo: number) => {
      const ranges = [
        { min: 0, max: 90, lightSource: 3 },
        { min: 90, max: 180, lightSource: 4 },
        { min: 180, max: 270, lightSource: 1 },
        { min: 270, max: 360, lightSource: 2 },
      ];
      const match = ranges.find((range) => angulo >= range.min && angulo < range.max);
      if (match) {
        updateContextConfigProp('lightSource', match.lightSource);
      } else {
        return -1;
      }
    },
    [updateContextConfigProp]
  );

  useEffect(() => {
    if (!contextConfig.surfaceColor) {
      updateColorAndCssVariables('#ffffff');
    } else {
      updateColorAndCssVariables(contextConfig.surfaceColor);
    }
  }, [contextConfig.surfaceColor, updateColorAndCssVariables]);

  const blurLimits = useMemo(() => {
    const maxSize = Math.max(dimensions.width, dimensions.height);
    return {
      minBlur: Math.round(maxSize / 100),
      maxBlur: Math.round(maxSize / 10),
    };
  }, [dimensions.width, dimensions.height]);

  const ConfigurationRanges = useMemo(
    () => [
      {
        label: 'Depth',
        type: 'range',
        value: contextConfig.depth ?? 0.15,
        onChange: (e: ChangeEvent<HTMLInputElement>) =>
          updateContextConfigProp('depth', Number(e.target.value)),
        min: -1,
        max: 1,
        step: 0.01,
      },
      {
        label: 'Concavity',
        type: 'range',
        value: contextConfig.concavity ?? 0.5,
        onChange: (e: ChangeEvent<HTMLInputElement>) =>
          updateContextConfigProp('concavity', Number(e.target.value)),
        min: -1,
        max: 1,
        step: 0.01,
      },
      {
        label: 'Intensity',
        type: 'range',
        value: contextConfig.intensity ?? 1,
        onChange: (e: ChangeEvent<HTMLInputElement>) =>
          updateContextConfigProp('intensity', Number(e.target.value)),
        min: 0.1,
        max: 0.5,
        step: 0.01,
      },
      {
        label: 'Blur',
        type: 'range',
        value: contextConfig.softness ?? 90,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          updateContextConfigProp('softness', Number(e.target.value));
          measureDimensions.current?.measure();
        },
        min: blurLimits.minBlur,
        max: blurLimits.maxBlur,
        step: 1,
      },
    ],
    [contextConfig, updateContextConfigProp, measureDimensions, blurLimits]
  );

  return (
    <div className={style.Configuration} style={defaultCssVariables}>
      <div className={style.Configuration__row}>
        <label className={style.Configuration__label} htmlFor="color">
          Pick a surface color:
        </label>
        <input
          type="color"
          name="color"
          onChange={(e) => updateContextConfigProp('surfaceColor', e.target.value)}
          placeholder="#ffffff"
          value={color}
          id="color"
          className={style.Configuration__inputColor}
        />
        <label
          htmlFor="colorInput"
          className={style.Configuration__label}
          style={{ paddingLeft: '10px' }}
        >
          or
        </label>
        <input
          type="text"
          placeholder="#ffffff"
          name="color"
          id="colorInput"
          value={colorInputText}
          onChange={handleColorChange}
          className={style.Configuration__inputText}
        />
      </div>
      <div className={`${style.Configuration__row} ${style.Configuration__label}`}>
        <label className={style.Configuration__label}>Pick an angle:</label>

        <AnglePicker
          id="anglePicker"
          value={angle}
          onChange={(newAngle) => {
            setAngle(newAngle ?? 0);
            handleDirectionAngle(newAngle ?? 0);
          }}
          onAfterChange={setAngle}
          pointerColor="#000"
          pointerWidth={5}
          angle={0}
          disabled={contextConfig.formShape === FormShape.Flat}
          format={Format.SVG}
        />

        <div
          style={{ minWidth: '34px', display: 'flex', justifyContent: 'center' }}
        >{`${angle}°`}</div>
        <LightSourceSelector
          lightSource={contextConfig.lightSource ?? 1}
          onDirectionChanged={handleDirection}
          disabled={contextConfig.formShape === FormShape.Flat}
        />
      </div>

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

      <div className={`${style.Configuration__row} ${style.Configuration__pathRow}`}>
        <NeumorphicPath
          concavity={contextConfig.concavity}
          softness={contextConfig.softness}
          depth={contextConfig.depth}
          className={style.Configuration__path}
        />
      </div>

      <div className={style.Configuration__row}></div>
      <button className={style.Configuration__copy} onClick={copyToClipboard}>
        Copy Config
      </button>
      <ShapeSwitcher formShape={contextConfig.formShape} setFormShape={handleShape} />
    </div>
  );
};

export default Configuration;
