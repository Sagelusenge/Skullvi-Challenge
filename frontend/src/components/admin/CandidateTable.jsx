import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters.js';
import StatusBadge from './StatusBadge.jsx';

export default function CandidateTable({ candidates = [] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Candidat</th>
            <th>Référence</th>
            <th>Domaine</th>
            <th>Statut</th>
            <th>Score</th>
            <th>Soumis</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <td><Link className="candidate-name" to={`/admin/candidates/${candidate.id}`}>{candidate.name}</Link></td>
              <td className="candidate-ref">{candidate.reference}</td>
              <td>{candidate.role}</td>
              <td><StatusBadge status={candidate.status} /></td>
              <td>
                <strong style={{ color: 'var(--secondary)' }}>{candidate.score}</strong>
                <span style={{ color: 'var(--outline)' }}>/100</span>
              </td>
              <td>{formatDate(candidate.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

