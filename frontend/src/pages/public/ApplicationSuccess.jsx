import { Link, useLocation } from 'react-router-dom';

export default function ApplicationSuccess() {
  const { state } = useLocation();
  const applicationReference = state?.applicationReference || 'Référence envoyée après enregistrement';

  return (
    <section className="page panel">
      <p className="eyebrow">Transmission confirmée</p>
      <h1>Candidature envoyée !</h1>
      <p>Notre équipe examinera votre profil et vous contactera si vous êtes retenu pour la prochaine étape.</p>
      <div className="console-card">
        <span className="eyebrow">Référence candidature</span>
        <strong style={{ color: 'var(--primary)' }}>{applicationReference}</strong>
        <p>Conservez cette référence si vous devez contacter notre équipe.</p>
      </div>
      <Link className="text-link" to="/">Retour à l'accueil</Link>
    </section>
  );
}

