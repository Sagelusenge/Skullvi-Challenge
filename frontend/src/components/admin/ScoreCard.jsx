export default function ScoreCard({ label, score, max = 100 }) {
  const percent = Math.round((score / max) * 100);

  return (
    <article className="score-card">
      <div>
        <span>{label}</span>
        <strong>{score}/{max}</strong>
      </div>
      <div className="score-track" aria-label={`${label}: ${percent}%`}>
        <span style={{ width: `${percent}%` }} />
      </div>
    </article>
  );
}

