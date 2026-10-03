import { z } from 'zod';

const grade = z.coerce.number().min(0).max(10);

export const evaluationSchema = z.object({
  technicalSkills: grade,
  problemSolving: grade,
  projectQuality: grade,
  motivation: grade,
  learningPotential: grade,
  comment: z.string().trim().max(3000).optional().nullable()
});

