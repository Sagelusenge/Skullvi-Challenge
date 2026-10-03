import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar.jsx';
import AdminHeader from '../components/admin/AdminHeader.jsx';

const titles = {
  '/admin': 'Dashboard',
  '/admin/candidates': 'Candidatures',
  '/admin/ranking': 'Classement',
  '/admin/evaluations': 'Évaluations',
  '/admin/scoring-criteria': 'Critères & Scoring',
  '/admin/reports': 'Rapports',
  '/admin/settings': 'Paramètres'
};

export default function AdminLayout() {
  const { pathname } = useLocation();
  const title = titles[pathname] || 'Candidate Details';

  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main">
        <AdminHeader title={title} />
        <section className="page">
          <Outlet />
        </section>
      </div>
    </div>
  );
}

