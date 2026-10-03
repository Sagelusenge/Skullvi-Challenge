import CandidateTable from '../../components/admin/CandidateTable.jsx';
import Loader from '../../components/common/Loader.jsx';
import { useCandidates } from '../../hooks/useCandidates.js';

export default function Ranking() {
  const { candidates, loading } = useCandidates();
  const ranked = [...candidates].sort((a, b) => b.score - a.score);

  if (loading) return <Loader />;

  return (
    <section className="panel">
      <p className="eyebrow">Classement</p>
      <h2>Profils priorisés</h2>
      <CandidateTable candidates={ranked} />
    </section>
  );
}

