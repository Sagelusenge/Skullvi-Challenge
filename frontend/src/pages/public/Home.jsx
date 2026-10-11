import Hero from '../../components/public/Hero.jsx';
import { BookOpen, Box, Compass, Lightbulb, Search, Terminal } from 'lucide-react';

export default function Home() {
  const steps = [
    ['01', 'Candidatez', 'Présentez votre profil, vos compétences, vos expériences et vos réalisations en quelques minutes.'],
    ['02', 'Votre profil est évalué', 'Notre équipe examine la candidature selon des critères objectifs, pondérés et explicables.'],
    ['03', 'Les profils retenus sont contactés', 'Les candidats sélectionnés reçoivent une invitation directe pour poursuivre le processus.']
  ];

  const values = [
    [Compass, 'Curiosité', "Désir d'explorer sous la surface technique"],
    [Lightbulb, 'Créativité', 'Imagination appliquée aux contraintes'],
    [BookOpen, 'Capacité d’apprentissage', 'Assimilation rapide et rétroaction active'],
    [Search, 'Résolution de problèmes', "Décomposition méthodique de l'inconnu"],
    [Terminal, 'Compétences techniques', 'Fondamentaux solides et code maintenable'],
    [Box, 'Projets réalisés', "Preuves tangibles d'expérimentation"]
  ];

  return (
    <>
      <Hero />
      <section className="page" id="parcours">
        <p className="eyebrow">Parcours d'admission</p>
        <h2>Votre parcours commence ici</h2>
        <p>Un processus d'admission fluide, transparent et axé sur vos réalisations concrètes.</p>
        <div className="grid home-summary">
          {steps.map(([number, title, copy]) => (
            <article className="panel feature-tile" key={number}>
              <div className="feature-icon">{number}</div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="page">
        <div className="panel">
          <p className="eyebrow">Exigences & Mentalité</p>
          <h2>Au-delà du CV, nous cherchons du potentiel.</h2>
          <p>
            Nous nous intéressons à votre manière de réfléchir, d’apprendre,
            de résoudre des problèmes et de transformer vos connaissances en solutions concrètes.
          </p>
          <div className="grid home-summary">
            {values.map(([Icon, title, copy]) => (
              <article className="feature-tile" key={title}>
                <span className="feature-icon"><Icon size={20} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

