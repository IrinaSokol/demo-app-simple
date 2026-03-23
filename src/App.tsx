import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { LoginPage } from '@/pages/LoginPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { AssetsPage } from '@/pages/AssetsPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

function AppShell() {
  return (
    <div className="app-shell" data-testid="app-shell">
      <Topbar />
      <div className="shell-body">
        <Sidebar />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/assets" element={<AssetsPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/projects" replace />} />
      <Route path="*" element={<Navigate to="/projects" replace />} />
    </Routes>
  );
}
