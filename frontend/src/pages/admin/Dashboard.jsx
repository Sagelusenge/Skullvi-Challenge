import CandidateTable from '../../components/admin/CandidateTable.jsx';
import StatCard from '../../components/admin/StatCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import { useCandidates } from '../../hooks/useCandidates.js';

export default function Dashboard() {
  const { candidates, loading } = useCandidates();
  const shortlisted = candidates.filter((candidate) => candidate.status === 'shortlisted').length;

  if (loading) return <Loader />;

  return (
    <div className="grid">
      <div className="stats-grid">
        <StatCard label="Total candidatures" value={candidates.length} helper="Flux constant" />
        <StatCard label="Présélectionnées" value={shortlisted} helper="Évaluations validées" />
        <StatCard label="Score moyen" value="82" helper="Cohorte 2026" />
      </div>
      <section className="panel">
        <p className="eyebrow">Analyse opérationnelle</p>
        <h2>Candidatures récentes</h2>
        <CandidateTable candidates={candidates} />
      </section>
    </div>
  );
}

