import CandidateTable from '../../components/admin/CandidateTable.jsx';
import Loader from '../../components/common/Loader.jsx';
import { useCandidates } from '../../hooks/useCandidates.js';

export default function Candidates() {
  const { candidates, loading, error } = useCandidates();

  if (loading) return <Loader />;
  if (error) return <p className="field-error">{error}</p>;

  return (
    <section className="panel">
      <p className="eyebrow">Pipeline</p>
      <h2>Candidatures reçues</h2>
      <CandidateTable candidates={candidates} />
    </section>
  );
}

