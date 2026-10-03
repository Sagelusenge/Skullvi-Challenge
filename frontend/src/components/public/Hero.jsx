import { Link } from 'react-router-dom';

export default function Hero() {
  const meters = [
    ['Résolution de problèmes complexes', 94, 'var(--secondary)'],
    ['Conception de solutions durables', 88, 'var(--primary)'],
    ['Transformation du savoir en livrable', 95, 'var(--secondary)']
  ];

  return (
    <section className="hero">
      <div>
        <div className="hero-copy">
          <span className="hero-kicker">SKULLVI × GevConsulting</span>
          <h1>Construisez. Apprenez. Évoluez.</h1>
          <p>
            SKULLVI recherche des talents curieux, créatifs et capables de
            transformer leurs connaissances en solutions concrètes.
          </p>
          <p>
            Présentez votre profil, vos compétences et vos réalisations pour
            rejoindre notre prochaine génération d'ingénieurs et créateurs.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/apply">
              Postuler maintenant
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <a className="btn btn-secondary" href="#parcours">Découvrir le programme</a>
          </div>
          <span className="hero-note">
            <span className="material-symbols-outlined">check_circle</span>
            Candidature directe et transparente sans création de compte requise.
          </span>
        </div>
        <aside className="hero-console" aria-label="Aperçu du moteur d'évaluation">
          <div className="console-header">
            <span><span className="pulse-dot" /> Diagnostics Moteur</span>
            <span>NODE_FR_02</span>
          </div>
          <div className="console-card">
            <div className="console-profile">
              <div>
                <span className="eyebrow">Profil évalué</span>
                <strong>Architecte Système · R&D</strong>
                <span>Stack: Rust, Go, architectures distribuées</span>
              </div>
              <span className="score-pill">Validé 92/100</span>
            </div>
            {meters.map(([label, value, color]) => (
              <div className="meter-row" key={label}>
                <div className="meter-label">
                  <span>{label}</span>
                  <strong>{value}%</strong>
                </div>
                <div className="meter-track">
                  <span style={{ width: `${value}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="hero-metrics">
            <div className="metric-card">
              <span>Temps moyen examen</span>
              <strong>48 heures</strong>
            </div>
            <div className="metric-card">
              <span>Approche</span>
              <strong>0% arbitraire</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

