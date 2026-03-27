import { Outlet } from 'react-router-dom';
import { ProjectsPage } from '@/pages/ProjectsPage';

/**
 * Dashboard stays mounted; nested `new` route renders an overlay via <Outlet />.
 */
export function ProjectsLayout() {
  return (
    <>
      <ProjectsPage />
      <Outlet />
    </>
  );
}
