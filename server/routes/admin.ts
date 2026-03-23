import { Router } from 'express';
import type { DataStore } from '../data/seed.js';
import { requireBearerToken } from '../lib/authMiddleware.js';

export function createAdminRouter(store: DataStore) {
  const router = Router();

  router.post('/reset', requireBearerToken, (_req, res) => {
    store.reset();
    res.json({ ok: true });
  });

  return router;
}
