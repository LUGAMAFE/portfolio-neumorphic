import { NeumorphicProps } from '../types';
import { validateNeumorphicProps } from '../utils/validation';

export const useNeumorphicValidation = (props: Partial<NeumorphicProps>) => {
  const validateProps = () => {
    const errors = validateNeumorphicProps(props);

    if (errors.length > 0) {
      const errorMessage = errors.join('\n');
      if (process.env.NODE_ENV === 'development') {
        throw new Error(`NeumorphicElement Props Validation:\n${errorMessage}`);
      } else {
        console.error('NeumorphicElement Props Validation:', errorMessage);
      }
    }
  };

  return { validateProps };
};
