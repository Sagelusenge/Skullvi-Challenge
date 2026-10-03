import { useEffect, useState } from 'react';
import { getCandidates } from '../services/candidateService.js';

export function useCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCandidates()
      .then(setCandidates)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { candidates, loading, error };
}

