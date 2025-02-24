import { NeumorphicProps } from '../types';

interface NeumorphicValidations {
  depth: { min: -1; max: 1 };
  concavity: { min: -1; max: 1 };
  softness: { min: 1; max: 1000 };
  intensity: { min: 0.1; max: 0.5 };
  lightSource: { validValues: [1, 2, 3, 4] };
}

const NEUMORPHIC_VALIDATIONS: NeumorphicValidations = {
  depth: { min: -1, max: 1 },
  concavity: { min: -1, max: 1 },
  softness: { min: 1, max: 1000 },
  intensity: { min: 0.1, max: 0.5 },
  lightSource: { validValues: [1, 2, 3, 4] },
} as const;

interface ValidationError {
  property: string;
  value: unknown;
  message: string;
}

export const useNeumorphicValidation = (props: Partial<NeumorphicProps>) => {
  const validateProps = () => {
    const errors: ValidationError[] = [];

    if (props.surfaceColor && !/^#[0-9A-F]{6}$/i.test(props.surfaceColor)) {
      errors.push({
        property: 'surfaceColor',
        value: props.surfaceColor,
        message: 'Must be a valid hex color (e.g., #FF0000)',
      });
    }

    const numericValidations: Array<keyof Omit<NeumorphicValidations, 'lightSource'>> = [
      'depth',
      'concavity',
      'softness',
      'intensity',
    ];

    numericValidations.forEach((prop) => {
      const value = props[prop];
      if (value !== undefined) {
        const { min, max } = NEUMORPHIC_VALIDATIONS[prop];
        if (value < min || value > max) {
          errors.push({
            property: prop,
            value,
            message: `Must be between ${min} and ${max}`,
          });
        }
      }
    });

    if (props.lightSource !== undefined) {
      const { validValues } = NEUMORPHIC_VALIDATIONS.lightSource;
      if (!validValues.includes(props.lightSource as 1 | 2 | 3 | 4)) {
        errors.push({
          property: 'lightSource',
          value: props.lightSource,
          message: `Must be one of: ${validValues.join(', ')}`,
        });
      }
    }

    if (errors.length > 0) {
      handleValidationErrors(errors);
    }
  };

  const formatValidationErrors = (errors: ValidationError[]): string[] => {
    return errors.map((error) => {
      return `Invalid ${error.property}: ${error.value}\n${error.message}`;
    });
  };

  const handleValidationErrors = (errors: ValidationError[]): void => {
    if (errors.length > 0) {
      const formattedErrors = formatValidationErrors(errors);
      if (process.env.NODE_ENV === 'development') {
        throw new Error('NeumorphicElement Props Validation: \n' + formattedErrors.join('\n'));
      } else {
        console.error('NeumorphicElement Props Validation: \n', formattedErrors.join('\n\n'));
      }
    }
  };

  return {
    validateProps,
  };
};
