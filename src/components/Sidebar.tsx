import { NavLink } from 'react-router-dom';

export function Sidebar() {
  return (
    <aside className="sidebar-root" data-testid="sidebar-root">
      <nav>
        <NavLink
          to="/projects"
          data-testid="nav-projects"
          className={({ isActive }) => (isActive ? 'active' : undefined)}
        >
          Projects
        </NavLink>
        <NavLink
          to="/assets"
          data-testid="nav-assets"
          className={({ isActive }) => (isActive ? 'active' : undefined)}
        >
          Assets
        </NavLink>
      </nav>
    </aside>
  );
}
