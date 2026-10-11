import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { createCandidate } from '../../services/candidateService.js';
import { isEmail, required } from '../../utils/validators.js';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: 'RDC',
  city: '',
  domain: '',
  experienceLevel: 'Junior',
  educationLevel: '',
  currentStatus: '',
  yearsExperience: '',
  skillsText: '',
  projectName: '',
  projectDescription: '',
  problemSolved: '',
  candidateRole: '',
  personalContribution: '',
  technologies: '',
  githubUrl: '',
  gitlabUrl: '',
  portfolioUrl: '',
  demoUrl: '',
  usedAi: 'false',
  aiUsageDescription: '',
  personalContributionWithAi: '',
  motivation: '',
  learningGoal: '',
  preferredDomain: '',
  weeklyAvailability: '',
  programAvailable: 'true'
};

function skillsFromText(value) {
  return value
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)
    .map((name) => ({ name, level: 'intermediate' }));
}

function emptyToUndefined(value) {
  return value?.trim() ? value.trim() : undefined;
}

export default function Apply() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    const nextErrors = {};
    if (!required(form.firstName)) nextErrors.firstName = 'Prénom requis';
    if (!required(form.lastName)) nextErrors.lastName = 'Nom requis';
    if (!isEmail(form.email)) nextErrors.email = 'Email valide requis';
    if (!required(form.phone)) nextErrors.phone = 'Téléphone requis';
    if (!required(form.domain)) nextErrors.domain = 'Domaine requis';
    if (!required(form.skillsText)) nextErrors.skillsText = 'Indiquez au moins une compétence';
    if (!required(form.projectName)) nextErrors.projectName = 'Projet requis';
    if (!required(form.projectDescription)) nextErrors.projectDescription = 'Présentation du projet requise';
    if (!required(form.problemSolved)) nextErrors.problemSolved = 'Problème traité requis';
    if (!required(form.candidateRole)) nextErrors.candidateRole = 'Rôle exact requis';
    if (!required(form.personalContribution)) nextErrors.personalContribution = 'Contribution personnelle requise';
    if (!required(form.technologies)) nextErrors.technologies = 'Technologies requises';
    if (!required(form.learningGoal)) nextErrors.learningGoal = 'Objectif d’apprentissage requis';
    if (!required(form.preferredDomain)) nextErrors.preferredDomain = 'Domaine souhaité requis';
    if (!required(form.motivation)) nextErrors.motivation = 'Motivation requise';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      country: form.country,
      city: form.city,
      domain: form.domain,
      experienceLevel: form.experienceLevel,
      educationLevel: form.educationLevel,
      currentStatus: form.currentStatus,
      yearsExperience: Number(form.yearsExperience || 0),
      skills: skillsFromText(form.skillsText),
      project: {
        name: form.projectName,
        description: form.projectDescription,
        problemSolved: form.problemSolved,
        candidateRole: form.candidateRole,
        personalContribution: form.personalContribution,
        technologies: form.technologies,
        githubUrl: emptyToUndefined(form.githubUrl),
        gitlabUrl: emptyToUndefined(form.gitlabUrl),
        portfolioUrl: emptyToUndefined(form.portfolioUrl),
        demoUrl: emptyToUndefined(form.demoUrl),
        usedAi: form.usedAi === 'true',
        aiUsageDescription: emptyToUndefined(form.aiUsageDescription),
        personalContributionWithAi: emptyToUndefined(form.personalContributionWithAi)
      },
      motivation: form.motivation,
      learningGoal: form.learningGoal,
      preferredDomain: form.preferredDomain,
      weeklyAvailability: Number(form.weeklyAvailability || 0),
      programAvailable: form.programAvailable === 'true'
    };

    try {
      setSubmitting(true);
      const result = await createCandidate(payload);
      navigate('/application-success', {
        state: { applicationReference: result?.applicationReference }
      });
    } catch (err) {
      setSubmitError(err.message || 'Impossible d’enregistrer la candidature pour le moment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page form-only-page">
      <form className="panel form-grid candidate-form" onSubmit={submit}>
        <div className="field-wide form-intro">
          <span className="secure-chip"><span className="pulse-dot" /> Candidature SKULLVI HCP · Aucun compte requis</span>
          <h1>Formulaire de candidature</h1>
          <p>
            Remplissez uniquement les informations essentielles pour permettre
            l’évaluation de votre profil, de votre projet personnel et de votre potentiel.
          </p>
        </div>

        <div className="field-wide form-section-title">Informations personnelles</div>
        <Input id="firstName" name="firstName" label="Prénom" value={form.firstName} onChange={updateField} error={errors.firstName} />
        <Input id="lastName" name="lastName" label="Nom" value={form.lastName} onChange={updateField} error={errors.lastName} />
        <Input id="email" name="email" label="Email" value={form.email} onChange={updateField} error={errors.email} />
        <Input id="phone" name="phone" label="Téléphone" value={form.phone} onChange={updateField} error={errors.phone} />
        <Input id="country" name="country" label="Pays" value={form.country} onChange={updateField} />
        <Input id="city" name="city" label="Ville" value={form.city} onChange={updateField} />

        <div className="field-wide form-section-title">Profil technique</div>
        <Input id="domain" name="domain" label="Domaine principal" placeholder="Backend, Frontend, Full Stack, Data..." value={form.domain} onChange={updateField} error={errors.domain} />
        <label className="field" htmlFor="experienceLevel">
          <span>Niveau d'expérience</span>
          <select id="experienceLevel" name="experienceLevel" value={form.experienceLevel} onChange={updateField}>
            <option>Débutant</option>
            <option>Junior</option>
            <option>Intermédiaire</option>
            <option>Avancé</option>
          </select>
        </label>
        <Input id="educationLevel" name="educationLevel" label="Niveau d’étude" value={form.educationLevel} onChange={updateField} />
        <Input id="currentStatus" name="currentStatus" label="Statut actuel" placeholder="Étudiant, freelance, employé..." value={form.currentStatus} onChange={updateField} />
        <Input id="yearsExperience" name="yearsExperience" type="number" label="Années d'expérience" value={form.yearsExperience} onChange={updateField} />
        <Input id="skillsText" name="skillsText" label="Compétences principales" placeholder="React, Express.js, MySQL..." value={form.skillsText} onChange={updateField} error={errors.skillsText} />

        <div className="field-wide form-section-title">Projet personnel réalisé</div>
        <Input id="projectName" name="projectName" label="Nom du projet" value={form.projectName} onChange={updateField} error={errors.projectName} />
        <Input id="technologies" name="technologies" label="Technologies utilisées" value={form.technologies} onChange={updateField} error={errors.technologies} />
        <label className="field field-wide" htmlFor="projectDescription">
          <span>Présentation du projet</span>
          <textarea id="projectDescription" name="projectDescription" rows="3" value={form.projectDescription} onChange={updateField} />
          {errors.projectDescription && <small className="field-error">{errors.projectDescription}</small>}
        </label>
        <Input id="problemSolved" name="problemSolved" label="Problème ou besoin traité" value={form.problemSolved} onChange={updateField} error={errors.problemSolved} />
        <Input id="candidateRole" name="candidateRole" label="Votre rôle exact" value={form.candidateRole} onChange={updateField} error={errors.candidateRole} />
        <label className="field field-wide" htmlFor="personalContribution">
          <span>Ce que vous avez personnellement réalisé</span>
          <textarea id="personalContribution" name="personalContribution" rows="3" value={form.personalContribution} onChange={updateField} />
          {errors.personalContribution && <small className="field-error">{errors.personalContribution}</small>}
        </label>
        <Input id="githubUrl" name="githubUrl" label="GitHub" value={form.githubUrl} onChange={updateField} />
        <Input id="gitlabUrl" name="gitlabUrl" label="GitLab" value={form.gitlabUrl} onChange={updateField} />
        <Input id="portfolioUrl" name="portfolioUrl" label="Portfolio" value={form.portfolioUrl} onChange={updateField} />
        <Input id="demoUrl" name="demoUrl" label="Démo / vidéo" value={form.demoUrl} onChange={updateField} />

        <div className="field-wide form-section-title">Usage de l’IA et motivation</div>
        <label className="field" htmlFor="usedAi">
          <span>Avez-vous utilisé l’IA ?</span>
          <select id="usedAi" name="usedAi" value={form.usedAi} onChange={updateField}>
            <option value="false">Non</option>
            <option value="true">Oui</option>
          </select>
        </label>
        <Input id="aiUsageDescription" name="aiUsageDescription" label="Comment l’IA a été utilisée" value={form.aiUsageDescription} onChange={updateField} />
        <Input id="personalContributionWithAi" name="personalContributionWithAi" label="Votre contribution personnelle avec IA" value={form.personalContributionWithAi} onChange={updateField} />
        <Input id="preferredDomain" name="preferredDomain" label="Domaine souhaité" value={form.preferredDomain} onChange={updateField} error={errors.preferredDomain} />
        <Input id="weeklyAvailability" name="weeklyAvailability" type="number" label="Disponibilité hebdomadaire (heures)" value={form.weeklyAvailability} onChange={updateField} />
        <label className="field" htmlFor="programAvailable">
          <span>Disponible pour le programme ?</span>
          <select id="programAvailable" name="programAvailable" value={form.programAvailable} onChange={updateField}>
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        </label>
        <label className="field field-wide" htmlFor="learningGoal">
          <span>Ce que vous voulez apprendre ou développer</span>
          <textarea id="learningGoal" name="learningGoal" rows="3" value={form.learningGoal} onChange={updateField} />
          {errors.learningGoal && <small className="field-error">{errors.learningGoal}</small>}
        </label>
        <label className="field field-wide" htmlFor="motivation">
          <span>Motivation</span>
          <textarea id="motivation" name="motivation" rows="5" value={form.motivation} onChange={updateField} />
          {errors.motivation && <small className="field-error">{errors.motivation}</small>}
        </label>

        <div className="form-actions">
          {submitError && <p className="field-error">{submitError}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Enregistrement...' : 'Soumettre ma candidature'}
            <ArrowRight size={20} aria-hidden="true" />
          </Button>
        </div>
      </form>
    </section>
  );
}

