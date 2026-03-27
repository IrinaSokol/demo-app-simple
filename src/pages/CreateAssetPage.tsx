import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAsset } from '@/api/assets';

const TYPES = ['Laptop', 'License', 'Device'] as const;
const STATUSES = ['Available', 'Assigned', 'Retired'] as const;

export function CreateAssetPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function validate(): string | null {
    if (!name.trim()) return 'Name is required.';
    if (!type) return 'Type is required.';
    if (!status) return 'Status is required.';
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setSaving(true);
    try {
      await createAsset({
        name: name.trim(),
        type,
        status,
      });
      navigate('/assets');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save asset.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div data-testid="create-asset-page">
      <h2 className="dashboard-title" data-testid="create-asset-title">
        Create Asset
      </h2>

      <div className="create-form-card">
        <form
          data-testid="create-asset-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-field">
            <label htmlFor="asset-name">Name</label>
            <input
              id="asset-name"
              data-testid="asset-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="form-field">
            <label htmlFor="asset-type">Type</label>
            <select
              id="asset-type"
              data-testid="asset-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select type</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="asset-status">Status</label>
            <select
              id="asset-status"
              data-testid="asset-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <p className="login-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              data-testid="create-asset-save"
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              data-testid="create-asset-cancel"
              disabled={saving}
              onClick={() => navigate('/assets')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
