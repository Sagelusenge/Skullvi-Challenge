import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: 'admin@skullvi.local', password: 'admin123' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(credentials);
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="login-card panel">
      <span className="secure-chip"><span className="pulse-dot" /> Console d'administration sécurisée</span>
      <div className="brand" style={{ marginBottom: 16 }}>
        <span className="brand-mark"><span className="material-symbols-outlined">terminal</span></span>
        <span className="brand-text">
          <strong>SKULLVI</strong>
          <span>Talent Engine</span>
        </span>
      </div>
      <h1>Administration Talent Engine</h1>
      <p>Connectez-vous pour évaluer, scorer et gérer les candidatures du programme.</p>
      <form className="grid" onSubmit={submit}>
        <Input id="email" name="email" label="Adresse email professionnelle" value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} />
        <Input id="password" name="password" type="password" label="Mot de passe" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} />
        {error && <p className="field-error">{error}</p>}
        <Button type="submit">
          <span className="material-symbols-outlined">security</span>
          Se connecter à la console
        </Button>
      </form>
      <div className="console-card" style={{ marginTop: 24 }}>
        <p className="eyebrow">Protocole d'audit actif</p>
        <p>
          Accès strictement restreint au personnel habilité SKULLVI & GevConsulting.
        </p>
      </div>
    </section>
  );
}

