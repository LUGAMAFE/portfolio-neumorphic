export const DEFAULT_CONFIG: Omit<Required<NeumorphicOptions>, 'surfaceColor' | 'formShape'> = {
  depth: 0.15,
  lightSource: 1,
  softness: 15,
  concavity: 0.5,
  intensity: 0.2,
};
