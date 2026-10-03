import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/about', label: 'À propos' },
  { to: '/apply', label: 'Postuler' },
  { to: '/login', label: 'Admin' }
];

export default function Header() {
  return (
    <header className="site-header">
      <NavLink to="/" className="brand">
        <span className="brand-mark">S</span>
        <span className="brand-text">
          <strong>SKULLVI</strong>
          <span>Talent Engine</span>
        </span>
      </NavLink>
      <nav>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="site-actions">
        <NavLink className="btn btn-ghost" to="/login">Se connecter</NavLink>
        <NavLink className="btn btn-primary" to="/apply">Postuler</NavLink>
      </div>
    </header>
  );
}

