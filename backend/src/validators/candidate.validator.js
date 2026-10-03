import { z } from 'zod';
import { VALID_CANDIDATE_STATUSES } from '../utils/scoringEngine.js';

const optionalUrl = z.union([z.string().url(), z.literal(''), z.null()]).optional();

export const skillSchema = z.object({
  name: z.string().trim().min(1).max(120),
  level: z.enum(['beginner', 'intermediate', 'advanced'])
});

export const projectSchema = z.object({
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().min(10),
  problemSolved: z.string().trim().min(5),
  candidateRole: z.string().trim().min(3),
  personalContribution: z.string().trim().min(5),
  technologies: z.string().trim().min(2).max(500),
  githubUrl: optionalUrl,
  gitlabUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  demoUrl: optionalUrl,
  usedAi: z.boolean().default(false),
  aiUsageDescription: z.string().trim().max(1000).optional().nullable(),
  personalContributionWithAi: z.string().trim().max(1000).optional().nullable()
}).partial({
  githubUrl: true,
  gitlabUrl: true,
  portfolioUrl: true,
  demoUrl: true,
  aiUsageDescription: true,
  personalContributionWithAi: true
});

export const createCandidateSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().email().max(160),
  phone: z.string().trim().min(5).max(60),
  country: z.string().trim().min(2).max(100),
  city: z.string().trim().min(1).max(100),
  domain: z.string().trim().min(2).max(120),
  experienceLevel: z.string().trim().min(1).max(80),
  educationLevel: z.string().trim().min(1).max(120),
  currentStatus: z.string().trim().min(1).max(120),
  yearsExperience: z.coerce.number().min(0).max(60),
  skills: z.array(skillSchema).min(1).max(30),
  project: projectSchema.optional(),
  motivation: z.string().trim().min(20).max(3000),
  learningGoal: z.string().trim().min(10).max(2000),
  preferredDomain: z.string().trim().min(2).max(120),
  weeklyAvailability: z.coerce.number().min(0).max(168),
  programAvailable: z.boolean()
});

export const listCandidatesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  domain: z.string().trim().optional(),
  status: z.enum(VALID_CANDIDATE_STATUSES).optional(),
  minScore: z.coerce.number().min(0).max(100).optional(),
  maxScore: z.coerce.number().min(0).max(100).optional(),
  sortBy: z.enum(['submitted_at', 'automatic_score', 'human_score', 'final_score', 'last_name', 'domain', 'status']).default('submitted_at'),
  order: z.enum(['asc', 'desc']).default('desc')
});

export const updateStatusSchema = z.object({
  status: z.enum(VALID_CANDIDATE_STATUSES)
});

