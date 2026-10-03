import { api } from './api.js';

const fallbackCandidates = [
  {
    id: 1,
    name: 'Amina Kabasele',
    email: 'amina@example.com',
    role: 'Frontend Developer',
    status: 'shortlisted',
    score: 86,
    reference: 'SK-2026-0001',
    createdAt: '2026-10-01T09:00:00.000Z'
  },
  {
    id: 2,
    name: 'Noah Ilunga',
    email: 'noah@example.com',
    role: 'Backend Developer',
    status: 'to_review',
    score: 78,
    reference: 'SK-2026-0002',
    createdAt: '2026-10-02T11:30:00.000Z'
  }
];

function normalizeCandidate(candidate) {
  if (!candidate) return candidate;
  return {
    ...candidate,
    id: candidate.id ?? candidate.candidateId,
    name: candidate.name || [candidate.firstName, candidate.lastName].filter(Boolean).join(' '),
    role: candidate.role || candidate.domain,
    score: candidate.score ?? candidate.finalScore ?? candidate.automaticScore ?? candidate.rankingScore ?? 0,
    reference: candidate.reference || candidate.applicationReference,
    createdAt: candidate.createdAt || candidate.submittedAt
  };
}

export async function getCandidates() {
  try {
    const data = await api.get('/candidates');
    const candidates = Array.isArray(data) ? data : data?.candidates || [];
    return candidates.map(normalizeCandidate);
  } catch {
    return fallbackCandidates;
  }
}

export async function getCandidate(id) {
  try {
    return normalizeCandidate(await api.get(`/candidates/${id}`));
  } catch {
    return fallbackCandidates.find((candidate) => String(candidate.id) === String(id));
  }
}

export async function createCandidate(candidate) {
  return api.post('/candidates', candidate);
}

