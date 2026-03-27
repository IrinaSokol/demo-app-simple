import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects, type Project } from '@/api/projects';
import { DataTable, type TableColumn } from '@/components/DataTable';

const columns: TableColumn[] = [
  { key: 'name', header: 'Name' },
  { key: 'owner', header: 'Owner' },
  { key: 'status', header: 'Status' },
  { key: 'updated', header: 'Updated' },
];

function formatUpdated(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString();
}

function toRow(p: Project): Record<string, string> {
  return {
    id: p.id,
    name: p.name,
    owner: p.owner,
    status: p.status,
    updated: formatUpdated(p.updatedAt),
  };
}

export function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchProjects()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load projects.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? items.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.owner.toLowerCase().includes(q)
        )
      : items;
    return filtered.map(toRow);
  }, [items, search]);

  return (
    <div data-testid="projects-dashboard-root">
      <h2 className="dashboard-title" data-testid="dashboard-title">
        Projects Dashboard
      </h2>

      <div className="dashboard-toolbar">
        <Link
          to="/projects/new"
          className="btn-new"
          data-testid="projects-new"
        >
          New Project
        </Link>
        <input
          type="search"
          placeholder="Search by name or owner"
          aria-label="Search projects"
          data-testid="projects-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={loading}
        />
      </div>

      {loading ? (
        <div className="dashboard-loader" data-testid="dashboard-loader">
          Loading projects…
        </div>
      ) : null}

      {error && !loading ? (
        <p className="login-error" role="alert">
          {error}
        </p>
      ) : null}

      {!loading && !error ? (
        <DataTable columns={columns} rows={rows} tableTestId="projects-table" />
      ) : null}
    </div>
  );
}
