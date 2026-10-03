import { useAuth } from '../../hooks/useAuth.js';
import Button from '../common/Button.jsx';

export default function AdminHeader({ title }) {
  const { user, logout } = useAuth();
  const displayName = user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Administrateur';

  return (
    <header className="admin-header">
      <div>
        <p className="eyebrow">SKULLVI CORE PROTOCOL</p>
        <h1>{title}</h1>
      </div>
      <div className="admin-user">
        <span className="engine-status"><span className="pulse-dot" /> Moteur actif</span>
        <span>{displayName}</span>
        <Button variant="secondary" onClick={logout}>Déconnexion</Button>
      </div>
    </header>
  );
}

