import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { archiveProject, fetchProject, type Project } from '@/api/projects';

function formatUpdated(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString();
}

export function ProjectDetailsPage() {
  const navigate = useNavigate();
  const { projectId = '' } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchProject(projectId)
      .then((data) => {
        if (!cancelled) setProject(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load project.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  function close() {
    navigate('/projects');
  }

  async function handleArchive() {
    if (!project) return;
    setError(null);
    setArchiving(true);
    try {
      await archiveProject(project.id);
      navigate('/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not archive project.');
      setArchiving(false);
    }
  }

  const isArchived = project?.status === 'Archived';

  return (
    <div
      className="create-overlay-backdrop"
      data-testid="project-details-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-details-title"
    >
      <div className="create-overlay-panel" data-testid="project-details-panel">
        <header className="create-overlay-header">
          <h2
            id="project-details-title"
            className="create-overlay-heading"
            data-testid="project-details-title"
          >
            Project Details
          </h2>
          <button
            type="button"
            className="create-overlay-close"
            data-testid="project-details-close"
            aria-label="Close"
            disabled={archiving}
            onClick={close}
          >
            ×
          </button>
        </header>

        <div className="details-body">
          {loading ? (
            <div className="dashboard-loader" data-testid="project-details-loader">
              Loading project…
            </div>
          ) : null}

          {project && !loading ? (
            <dl className="details-list">
              <div className="details-field">
                <dt>Name</dt>
                <dd data-testid="project-details-name">{project.name}</dd>
              </div>
              <div className="details-field">
                <dt>Owner</dt>
                <dd data-testid="project-details-owner">{project.owner}</dd>
              </div>
              <div className="details-field">
                <dt>Status</dt>
                <dd data-testid="project-details-status">{project.status}</dd>
              </div>
              <div className="details-field">
                <dt>Updated</dt>
                <dd data-testid="project-details-updated">
                  {formatUpdated(project.updatedAt)}
                </dd>
              </div>
            </dl>
          ) : null}

          {error ? (
            <p className="login-error" role="alert" data-testid="project-details-error">
              {error}
            </p>
          ) : null}

          {project && !loading ? (
            <div className="form-actions">
              <button
                type="button"
                className="btn-primary"
                data-testid="project-details-archive"
                disabled={isArchived || archiving}
                title={isArchived ? 'This project is already archived.' : undefined}
                onClick={handleArchive}
              >
                {archiving ? 'Archiving…' : 'Archive'}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
