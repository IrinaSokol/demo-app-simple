import { Router } from 'express';
import type { DataStore, ProjectRow } from '../data/seed.js';
import { PROJECT_STATUSES } from '../data/seed.js';
import { randomDelayMs } from '../lib/delay.js';
import { requireBearerToken } from '../lib/authMiddleware.js';

export function createProjectsRouter(store: DataStore) {
  const router = Router();

  router.get('/', requireBearerToken, async (_req, res) => {
    await randomDelayMs(300, 800);
    res.json(store.getProjects());
  });

  router.post('/', requireBearerToken, (req, res) => {
    const { name, owner, status } = req.body as {
      name?: unknown;
      owner?: unknown;
      status?: unknown;
    };

    if (typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'Name is required.' });
      return;
    }
    if (typeof owner !== 'string' || !owner.trim()) {
      res.status(400).json({ error: 'Owner is required.' });
      return;
    }
    if (
      typeof status !== 'string' ||
      !PROJECT_STATUSES.includes(status as ProjectRow['status'])
    ) {
      res.status(400).json({ error: 'Status is required.' });
      return;
    }

    const created = store.addProject({
      name,
      owner,
      status: status as ProjectRow['status'],
    });
    res.status(201).json(created);
  });

  return router;
}
