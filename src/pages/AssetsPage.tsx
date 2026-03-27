import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAssets, type Asset } from '@/api/assets';
import { DataTable, type TableColumn } from '@/components/DataTable';

const columns: TableColumn[] = [
  { key: 'name', header: 'Name' },
  { key: 'type', header: 'Type' },
  { key: 'status', header: 'Status' },
  { key: 'updated', header: 'Updated' },
];

function formatUpdated(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString();
}

function toRow(a: Asset): Record<string, string> {
  return {
    id: a.id,
    name: a.name,
    type: a.type,
    status: a.status,
    updated: formatUpdated(a.updatedAt),
  };
}

export function AssetsPage() {
  const [items, setItems] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchAssets()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load assets.');
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
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.type.toLowerCase().includes(q)
        )
      : items;
    return filtered.map(toRow);
  }, [items, search]);

  return (
    <div data-testid="assets-dashboard-root">
      <h2 className="dashboard-title" data-testid="dashboard-title">
        Assets Dashboard
      </h2>

      <div className="dashboard-toolbar">
        <Link to="/assets/new" className="btn-new" data-testid="assets-new">
          New Asset
        </Link>
        <input
          type="search"
          placeholder="Search by name or type"
          aria-label="Search assets"
          data-testid="assets-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={loading}
        />
      </div>

      {loading ? (
        <div className="dashboard-loader" data-testid="dashboard-loader">
          Loading assets…
        </div>
      ) : null}

      {error && !loading ? (
        <p className="login-error" role="alert">
          {error}
        </p>
      ) : null}

      {!loading && !error ? (
        <DataTable columns={columns} rows={rows} tableTestId="assets-table" />
      ) : null}
    </div>
  );
}
