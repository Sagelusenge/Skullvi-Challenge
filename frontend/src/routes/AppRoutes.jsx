import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Apply from '../pages/public/Apply.jsx';
import ApplicationSuccess from '../pages/public/ApplicationSuccess.jsx';
import Login from '../pages/auth/Login.jsx';
import Dashboard from '../pages/admin/Dashboard.jsx';
import Candidates from '../pages/admin/Candidates.jsx';
import CandidateDetails from '../pages/admin/CandidateDetails.jsx';
import Ranking from '../pages/admin/Ranking.jsx';
import Evaluations from '../pages/admin/Evaluations.jsx';
import ScoringCriteria from '../pages/admin/ScoringCriteria.jsx';
import Reports from '../pages/admin/Reports.jsx';
import Settings from '../pages/admin/Settings.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Apply />} />
        <Route path="/apply" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<Navigate to="/" replace />} />
        <Route path="/application-success" element={<ApplicationSuccess />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="candidates/:id" element={<CandidateDetails />} />
          <Route path="ranking" element={<Ranking />} />
          <Route path="evaluations" element={<Evaluations />} />
          <Route path="scoring-criteria" element={<ScoringCriteria />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

