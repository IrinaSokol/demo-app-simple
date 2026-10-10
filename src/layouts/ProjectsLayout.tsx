import { Outlet } from 'react-router-dom';
import { ProjectsPage } from '@/pages/ProjectsPage';

/**
 * Dashboard stays mounted; nested `new` and `:projectId` routes render an overlay via <Outlet />.
 */
export function ProjectsLayout() {
  return (
    <>
      <ProjectsPage />
      <Outlet />
    </>
  );
}
