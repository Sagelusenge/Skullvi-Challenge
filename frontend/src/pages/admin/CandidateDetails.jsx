import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ScoreCard from '../../components/admin/ScoreCard.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import Loader from '../../components/common/Loader.jsx';
import { getCandidate } from '../../services/candidateService.js';

export default function CandidateDetails() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    getCandidate(id).then(setCandidate);
  }, [id]);

  if (!candidate) return <Loader />;

  return (
    <section className="panel">
      <div className="details-header">
        <div>
          <p className="eyebrow">{candidate.reference}</p>
          <h2>{candidate.name}</h2>
          <p>{candidate.email}</p>
        </div>
        <StatusBadge status={candidate.status} />
      </div>
      <div className="grid">
        <ScoreCard label="Score global" score={candidate.score} />
        <ScoreCard label="Adéquation technique" score={84} />
        <ScoreCard label="Potentiel d’apprentissage" score={79} />
      </div>
    </section>
  );
}

