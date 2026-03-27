import { Outlet } from 'react-router-dom';
import { AssetsPage } from '@/pages/AssetsPage';

/**
 * Dashboard stays mounted; nested `new` route renders an overlay via <Outlet />.
 */
export function AssetsLayout() {
  return (
    <>
      <AssetsPage />
      <Outlet />
    </>
  );
}
