import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '@/api/projects';

const STATUSES = ['Active', 'Draft', 'Archived'] as const;

export function CreateProjectPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function validate(): string | null {
    if (!name.trim()) return 'Name is required.';
    if (!owner.trim()) return 'Owner is required.';
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
      await createProject({
        name: name.trim(),
        owner: owner.trim(),
        status,
      });
      navigate('/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save project.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div data-testid="create-project-page">
      <h2 className="dashboard-title" data-testid="create-project-title">
        Create Project
      </h2>

      <div className="create-form-card">
        <form
          data-testid="create-project-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-field">
            <label htmlFor="project-name">Name</label>
            <input
              id="project-name"
              data-testid="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="form-field">
            <label htmlFor="project-owner">Owner</label>
            <input
              id="project-owner"
              data-testid="project-owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="form-field">
            <label htmlFor="project-status">Status</label>
            <select
              id="project-status"
              data-testid="project-status"
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
              data-testid="create-project-save"
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              data-testid="create-project-cancel"
              disabled={saving}
              onClick={() => navigate('/projects')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
