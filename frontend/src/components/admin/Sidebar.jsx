import { NavLink } from 'react-router-dom';
import { BarChart3, ClipboardCheck, FileText, Gauge, ListChecks, Settings, Trophy, Users } from 'lucide-react';

const items = [
  { to: '/admin', label: 'Dashboard', icon: Gauge },
  { to: '/admin/candidates', label: 'Candidatures', icon: Users },
  { to: '/admin/ranking', label: 'Classement', icon: Trophy },
  { to: '/admin/evaluations', label: 'Évaluations', icon: ClipboardCheck },
  { to: '/admin/scoring-criteria', label: 'Critères & Scoring', icon: ListChecks },
  { to: '/admin/reports', label: 'Rapports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Paramètres', icon: Settings },
  { to: '/', label: 'Site public', icon: FileText }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          <span className="brand-mark">S</span>
          <strong>SKULLVI</strong>
        </div>
        <div className="sidebar-title">Console Recruteur</div>
        <nav>
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/admin'}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="sidebar-footer">
        <span className="engine-status"><span className="pulse-dot" /> Contrôle total</span>
        <NavLink to="/login">
          <Settings size={18} />
          <span>Déconnexion</span>
        </NavLink>
      </div>
    </aside>
  );
}

