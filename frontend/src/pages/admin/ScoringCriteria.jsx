const criteria = [
  { name: 'Technical skills', weight: 40 },
  { name: 'Experience relevance', weight: 25 },
  { name: 'Communication', weight: 20 },
  { name: 'Culture fit', weight: 15 }
];

export default function ScoringCriteria() {
  return (
    <section className="panel">
      <p className="eyebrow">Pondérations</p>
      <h2>Critères de scoring</h2>
      <div className="grid">
        {criteria.map((item) => (
          <article className="score-card" key={item.name}>
            <div>
              <span>{item.name}</span>
              <strong>{item.weight}%</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

