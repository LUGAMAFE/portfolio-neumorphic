import { z } from 'zod';
import { NeumorphicProps } from '../types';

export const NEUMORPHIC_VALIDATIONS = {
  depth: { min: -1, max: 1 },
  concavity: { min: -1, max: 1 },
  softness: { min: 1, max: 1000 },
  intensity: { min: 0.1, max: 0.5 },
  lightSource: { validValues: ['1', '2', '3', '4'] },
};

const neumorphicSchema = z.object({
  surfaceColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color (e.g., #FF0000)')
    .optional(),
  depth: z
    .number()
    .min(NEUMORPHIC_VALIDATIONS.depth.min)
    .max(NEUMORPHIC_VALIDATIONS.depth.max)
    .optional(),
  concavity: z
    .number()
    .min(NEUMORPHIC_VALIDATIONS.concavity.min)
    .max(NEUMORPHIC_VALIDATIONS.concavity.max)
    .optional(),
  softness: z
    .number()
    .min(NEUMORPHIC_VALIDATIONS.softness.min)
    .max(NEUMORPHIC_VALIDATIONS.softness.max)
    .optional(),
  intensity: z
    .number()
    .min(NEUMORPHIC_VALIDATIONS.intensity.min)
    .max(NEUMORPHIC_VALIDATIONS.intensity.max)
    .optional(),
  lightSource: z
    .number()
    .refine((value) => [1, 2, 3, 4].includes(value), 'Number, must be 1, 2, 3 or 4')
    .optional(),
});

export const validateNeumorphicProps = (props: Partial<NeumorphicProps>): string[] => {
  const result = neumorphicSchema.safeParse(props);

  if (result.success) return [];

  return result.error.issues.map(
    (issue: z.ZodIssue) =>
      `Invalid ${issue.path.join('.')}: (Received: ${props[issue.path[0] as keyof NeumorphicProps]}) ${issue.message}`
  );
};
