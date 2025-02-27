import { useNeumorphicStylesContext } from '@/providers/NeumorphicStylesProvider';
import { Progress } from 'radix-ui';
import * as React from 'react';
import { NeumorphicWrapper } from '../NeumorphicElement/NeumorphicWrapper';
import styles from './ProgressDemo.module.scss';

const ProgressDemo = () => {
  const { currentTheme } = useNeumorphicStylesContext();
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <NeumorphicWrapper
      surfaceColor={currentTheme.color}
      intensity={currentTheme.intensity}
      depth={-1}
      concavity={-1}
    >
      <Progress.Root className={styles.ProgressRoot} value={progress}>
        <NeumorphicWrapper surfaceColor={'#0bfe74'} intensity={0.5} depth={-1} concavity={-1}>
          <Progress.Indicator
            className={styles.ProgressIndicator}
            style={{ transform: `translateX(-${100 - progress}%)` }}
          />
        </NeumorphicWrapper>
      </Progress.Root>
    </NeumorphicWrapper>
  );
};

export default ProgressDemo;
